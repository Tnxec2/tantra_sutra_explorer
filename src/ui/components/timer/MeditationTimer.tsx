import { useEffect, useRef, useState } from "react";
import { Clock3, Pause, Play, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { TimerProfile } from "./timerTypes";
import { imagePath, musicSounds, soundPath } from "./data";
import { blankProfile, formatTime, loadProfiles, loadSelectedProfileId, saveProfiles, saveSelectedProfileId } from "./helper";
import { MeditationTimerSettings } from "./TimerSettings";
import { TImerList } from "./TimerList";





export function MeditationTimer({ onClose }: { onClose: () => void }) {
  const [profiles, setProfiles] = useState<TimerProfile[]>(loadProfiles);
  const [selectedId, setSelectedId] = useState<string>(loadSelectedProfileId);
  const [activeTab, setActiveTab] = useState<"timer" | "settings">("timer");
  const [runState, setRunState] = useState<"idle" | "delay" | "running" | "paused" | "complete">("idle");
  const [pausedFrom, setPausedFrom] = useState<"delay" | "running">("running");
  const [remainingMs, setRemainingMs] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [audioError, setAudioError] = useState("");
  const remainingRef = useRef(0);
  const deadlineRef = useRef(0);
  const playedIntervalsRef = useRef<Record<string, number>>({});
  const musicRef = useRef<HTMLAudioElement | null>(null);

  const selected = profiles.find(profile => profile.id === selectedId) ?? profiles[0];
  const durationMs = selected.durationMinutes * 60_000;
  const musicCover = musicSounds.find(sound => sound.file === selected.music)?.image;

  useEffect(() => {
    try {
       saveProfiles(profiles);
    } catch (e: any) {
      setAudioError(e.message)
    }
  }, [profiles]);

  useEffect(() => {
    if (!selected) return;
    try {
      saveSelectedProfileId(selected.id);
    } catch (error) {
      setAudioError(error instanceof Error ? error.message : "Das Timerprofil konnte nicht gespeichert werden.");
    }
  }, [selected.id]);

  const playSound = (file: string) => {
    if (!file) return;
    const audio = new Audio(soundPath(file));
    audio.play().catch(error => {
      console.error(`Sound konnte nicht abgespielt werden: ${file}`, error);
      setAudioError("Ein Sound konnte nicht abgespielt werden. Bitte prüfe die Audio-Berechtigung.");
    });
  };

  const stopMusic = () => {
    if (musicRef.current) {
      musicRef.current.pause();
      musicRef.current.currentTime = 0;
      musicRef.current = null;
    }
  };

  const beginSession = () => {
    remainingRef.current = durationMs;
    setRemainingMs(durationMs);
    setElapsedMs(0);
    playedIntervalsRef.current = {};
    setRunState("running");
    setAudioError("");
    playSound(selected.startSound);
  };

  useEffect(() => {
    if (runState !== "delay" && runState !== "running") return;
    deadlineRef.current = Date.now() + remainingMs;
    const timer = window.setInterval(() => {
      const nextRemaining = Math.max(0, deadlineRef.current - Date.now());
      remainingRef.current = nextRemaining;
      setRemainingMs(nextRemaining);
      if (runState === "delay") {
        if (nextRemaining <= 0) beginSession();
        return;
      }

      const elapsed = durationMs - nextRemaining;
      setElapsedMs(elapsed);
      if (nextRemaining > 0) {
        let intervalSoundToPlay: string | null = null;
        selected.intervalSounds.forEach(interval => {
          if (interval.intervalMinutes <= 0) return;
          const intervalNumber = Math.floor(elapsed / (interval.intervalMinutes * 60_000));
          const previousNumber = playedIntervalsRef.current[interval.id] ?? 0;
          if (intervalNumber > previousNumber) {
            if (interval.repeat || previousNumber === 0) intervalSoundToPlay = interval.file;
            playedIntervalsRef.current[interval.id] = intervalNumber;
          }
        });
        if (intervalSoundToPlay) playSound(intervalSoundToPlay);
      }
      if (nextRemaining <= 0) {
        stopMusic();
        playSound(selected.endSound);
        setRunState("complete");
      }
    }, 200);
    return () => window.clearInterval(timer);
    // The timer is re-created only when its phase changes; remaining time is read from its deadline.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runState]);

  useEffect(() => () => {
    stopMusic();
    //previewRef.current?.pause();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const updateProfile = (key: keyof TimerProfile, value: TimerProfile[keyof TimerProfile]) => {
    if (!selected) return;
    setProfiles(current => current.map(profile =>
      profile.id === selected.id ? { ...profile, [key]: value } : profile
    ));
  };

  const addProfile = () => {
    const profile = blankProfile();
    setProfiles(current => [...current, profile]);
    setSelectedId(profile.id);
    resetTimer();
  };

  const resetTimer = () => {
    stopMusic();
    setRunState("idle");
    setRemainingMs(0);
    remainingRef.current = 0;
    setElapsedMs(0);
    setAudioError("");
  };

  const removeProfile = () => {
    if (!selected || profiles.length <= 1) return;
    const next = profiles.filter(profile => profile.id !== selected.id);
    setProfiles(next);
    setSelectedId(next[0].id);
    resetTimer();
  };

  const startTimer = () => {
    setAudioError("");
    if (selected.music) {
      const music = new Audio(soundPath(selected.music));
      music.loop = true;
      music.volume = 0.35;
      musicRef.current = music;
      music.play().catch(error => {
        console.error(`Hintergrundmusik konnte nicht abgespielt werden: ${selected.music}`, error);
        setAudioError("Die Hintergrundmusik konnte nicht abgespielt werden.");
      });
    }
    if (selected.startPauseSeconds > 0) {
      const delay = selected.startPauseSeconds * 1000;
      remainingRef.current = delay;
      setRemainingMs(delay);
      setRunState("delay");
    } else {
      beginSession();
    }
  };

  const pauseTimer = () => {
    setPausedFrom(runState as "delay" | "running");
    setRemainingMs(remainingRef.current);
    if (runState === "running") musicRef.current?.pause();
    setRunState("paused");
  };

  const resumeTimer = () => {
    if (pausedFrom === "running") {
      setElapsedMs(durationMs - remainingMs);
      musicRef.current?.play().catch(error => {
        console.error("Hintergrundmusik konnte nicht fortgesetzt werden.", error);
        setAudioError("Die Hintergrundmusik konnte nicht fortgesetzt werden.");
      });
    }
    setRunState(pausedFrom);
  };


  if (!selected) return null;
  
  const isLocked = runState === "delay" || runState === "running" || runState === "paused";

  const progress = runState === "delay"
    ? 0
    : runState === "complete"
      ? 1
      : Math.min(1, elapsedMs / durationMs);
  const timerDisplay = runState === "delay" || (runState === "paused" && pausedFrom === "delay")
    ? formatTime(remainingMs)
    : formatTime(runState === "paused" && pausedFrom === "delay" ? 0 : durationMs - elapsedMs);
  const phaseLabel = runState === "delay"
    ? "Komm zur Ruhe"
    : runState === "running"
      ? "In deiner Praxis"
      : runState === "paused"
        ? "Pausiert"
        : runState === "complete"
          ? "Wunderbar – deine Praxis ist vollendet"
          : "Ein Moment nur für dich";

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-theme-overlay/80 p-3 backdrop-blur-md sm:p-6"
      // onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="meditation-timer-title"
        className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl 
        border border-theme-border/50
         bg-theme-surface/90 text-theme-text
         shadow-[0_30px_100px_rgba(0,0,0,0.65)] backdrop-blur-2xl"
      >
        <header className="flex items-center justify-between border-b border-theme-border/40 px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-2.5 text-amber-200">
              <Clock3 className="h-5 w-5" />
            </div>
            <div>
              <h2 id="meditation-timer-title" className="font-serif text-xl font-semibold text-amber-50 
              sm:text-2xl">Meditationstimer</h2>
              <p className="text-xs text-slate-400">Dein eigener Raum für Stille</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Timer schließen" 
          className="rounded-full p-2 text-slate-400 transition hover:bg-theme-raised hover:text-theme-text-strong">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div role="tablist" aria-label="Timeransicht" className="grid grid-cols-2 gap-1 border-b border-theme-border/40 bg-theme-raised/40 p-2">
          <button
            id="meditation-timer-tab"
            type="button"
            role="tab"
            aria-selected={activeTab === "timer"}
            aria-controls="meditation-timer-panel"
            onClick={() => setActiveTab("timer")}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition ${activeTab === "timer" ? "border border-amber-300/25 bg-amber-300/10 text-amber-100 shadow-inner" : "text-slate-400 hover:bg-theme-raised hover:text-slate-200"}`}
          >
            <Clock3 className="h-4 w-4" />
            Timer
          </button>
          <button
            id="meditation-settings-tab"
            type="button"
            role="tab"
            aria-selected={activeTab === "settings"}
            aria-controls="meditation-settings-panel"
            onClick={() => setActiveTab("settings")}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition ${activeTab === "settings" ? "border border-amber-300/25 bg-amber-300/10 text-amber-100 shadow-inner" : "text-slate-400 hover:bg-theme-raised hover:text-slate-200"}`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Einstellungen
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div
            id="meditation-timer-panel"
            role="tabpanel"
            aria-labelledby="meditation-timer-tab"
            hidden={activeTab !== "timer"}
            className="animate-fadeIn"
          >
            <div className="mx-auto w-full max-w-3xl space-y-6 p-5 sm:p-7">
              <div className={`relative overflow-hidden rounded-3xl border border-theme-border/40 px-5 py-8 text-center shadow-inner sm:py-10 ${musicCover ? "bg-theme-overlay" : "bg-gradient-to-br from-theme-raised to-theme-surface"}`}>
                {musicCover && (
                  <>
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
                      style={{ backgroundImage: `url("${imagePath(musicCover)}")`, opacity: 0.55 }}
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-br from-theme-overlay/70 via-theme-overlay/60 to-theme-surface/75"
                    />
                  </>
                )}
                <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-violet-400/10 blur-3xl" />
                <div className="relative z-10 mx-auto mb-5 flex h-48 w-48 items-center justify-center sm:h-56 sm:w-56">
                  <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
                    <circle cx="50" cy="50" r="46" fill="none" stroke="rgb(var(--theme-border) / 0.5)" strokeWidth="1.5" />
                    <circle cx="50" cy="50" r="46" fill="none" stroke="rgb(var(--theme-accent) / 0.9)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray={2 * Math.PI * 46} strokeDashoffset={2 * Math.PI * 46 * (1 - progress)} className="transition-[stroke-dashoffset] duration-300" />
                  </svg>
                  <div className="flex flex-col items-center">
                    <span className={`font-mono text-4xl font-light tracking-wider sm:text-5xl ${musicCover ? "text-white" : "text-theme-text-strong"}`}>{timerDisplay}</span>
                    <span className="mt-2 text-[10px] uppercase tracking-[0.3em] text-amber-200/70">{runState === "delay" || (runState === "paused" && pausedFrom === "delay") ? "Start in" : "verbleibend"}</span>
                  </div>
                </div>
                <p className={`relative z-10 text-sm font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] ${musicCover ? "text-white" : "text-theme-text-strong"}`}>{phaseLabel}</p>
                <p className={`relative z-10 mt-1 text-xs drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] ${musicCover ? "text-white/85" : "text-theme-muted"}`}>{selected.name}</p>
                <div className="relative z-10 mt-6 flex justify-center gap-3">
                  {(runState === "idle" || runState === "complete") && (
                    <button onClick={startTimer} className="flex items-center gap-2 rounded-full bg-gradient-to-r from-theme-accent-light to-theme-accent px-6 py-3 text-sm font-semibold text-theme-on-accent shadow-lg shadow-amber-900/20 transition hover:brightness-110">
                      <Play className="h-4 w-4 fill-current" /> Meditation starten
                    </button>
                  )}
                  {(runState === "delay" || runState === "running") && (
                    <button onClick={pauseTimer} className="flex items-center gap-2 rounded-full border border-theme-border/50 bg-theme-raised px-6 py-3 text-sm font-medium text-theme-text transition hover:bg-theme-surface">
                      <Pause className="h-4 w-4" /> Pause
                    </button>
                  )}
                  {runState === "paused" && (
                    <button onClick={resumeTimer} className="flex items-center gap-2 rounded-full bg-gradient-to-r from-theme-accent-light to-theme-accent px-6 py-3 text-sm font-semibold text-theme-on-accent transition hover:brightness-110">
                      <Play className="h-4 w-4 fill-current" /> Fortsetzen
                    </button>
                  )}
                  {runState !== "idle" && (
                    <button onClick={resetTimer} aria-label="Timer zurücksetzen" className="rounded-full border border-theme-border/40 p-3 text-slate-300 transition hover:bg-theme-raised">
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              {audioError && <p role="alert" className="rounded-xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-xs text-rose-200">{audioError}</p>}
              <p className="text-center text-xs text-slate-500">
                {runState === "delay" ? "Die Startpause schenkt dir Zeit, anzukommen." : `Gesamtdauer: ${selected.durationMinutes} Minuten`}
              </p>
            </div>
          </div>

          <div
            id="meditation-settings-panel"
            role="tabpanel"
            aria-labelledby="meditation-settings-tab"
            hidden={activeTab !== "settings"}
            className="animate-fadeIn"
          >
            <div className="mx-auto w-full max-w-2xl space-y-5 p-5 sm:p-7">
              <TImerList 
                selected={selected}
                profiles={profiles}
                addProfile={addProfile}
                openProfile={(id) => {setSelectedId(id); resetTimer(); }}
                isLocked={isLocked}
              />
              <MeditationTimerSettings
                selected={selected}
                updateProfile={updateProfile}
                isLocked={isLocked}
                canDelete={profiles.length > 1}
                removeProfile={removeProfile}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

