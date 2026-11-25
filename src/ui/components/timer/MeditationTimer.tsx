import { useEffect, useRef, useState } from "react";
import { Clock3, Pause, Play, Plus, RotateCcw, X } from "lucide-react";
import { TimerProfile } from "./timerTypes";
import { imagePath, musicSounds, soundPath } from "./data";
import { blankProfile, formatTime, loadProfiles, saveProfiles } from "./helper";
import { MeditationTimerSettings } from "./TimerSettings";





export function MeditationTimer({ onClose }: { onClose: () => void }) {
  const [profiles, setProfiles] = useState<TimerProfile[]>(loadProfiles);
  const [selectedId, setSelectedId] = useState("");
  const [runState, setRunState] = useState<"idle" | "delay" | "running" | "paused" | "complete">("idle");
  const [pausedFrom, setPausedFrom] = useState<"delay" | "running">("running");
  const [remainingMs, setRemainingMs] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [audioError, setAudioError] = useState("");
  const remainingRef = useRef(0);
  const deadlineRef = useRef(0);
  const lastIntervalRef = useRef(0);
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
    lastIntervalRef.current = 0;
    setRunState("running");
    setAudioError("");
    playSound(selected.startSound);
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
      const intervalNumber = selected.intervalMinutes > 0
        ? Math.floor(elapsed / (selected.intervalMinutes * 60_000))
        : 0;
      if (intervalNumber > lastIntervalRef.current) {
        lastIntervalRef.current = intervalNumber;
        playSound(selected.intervalSound);
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
    // previewRef.current?.pause();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const updateProfile = (key: keyof TimerProfile, value: string | number) => {
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
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#080614]/80 p-3 backdrop-blur-md sm:p-6"
      onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="meditation-timer-title"
        className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/15 bg-[#17142b]/80 text-slate-100 shadow-[0_30px_100px_rgba(0,0,0,0.65)] backdrop-blur-2xl"
      >
        <header className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-2.5 text-amber-200">
              <Clock3 className="h-5 w-5" />
            </div>
            <div>
              <h2 id="meditation-timer-title" className="font-serif text-xl font-semibold text-amber-50 sm:text-2xl">Meditationstimer</h2>
              <p className="text-xs text-slate-400">Dein eigener Raum für Stille</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Timer schließen" className="rounded-full p-2 text-slate-400 transition hover:bg-white/10 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <div className="space-y-6 p-5 sm:p-7">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {profiles.map(profile => (
                <button
                  key={profile.id}
                  onClick={() => { if (!isLocked) { setSelectedId(profile.id); resetTimer(); } }}
                  disabled={isLocked}
                  className={`max-w-48 truncate rounded-full border px-4 py-2 text-sm transition ${profile.id === selected.id ? "border-amber-200/50 bg-amber-200/15 text-amber-100" : "border-white/10 bg-white/[0.04] text-slate-400 hover:bg-white/10"} disabled:cursor-not-allowed`}
                >{profile.name || "Unbenannter Timer"}</button>
              ))}
              <button onClick={addProfile} disabled={isLocked} aria-label="Neuen Timer hinzufügen" className="shrink-0 rounded-full border border-dashed border-white/20 p-2 text-slate-400 transition hover:border-amber-200/40 hover:text-amber-100 disabled:opacity-40">
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className={`relative overflow-hidden rounded-3xl border border-white/10 px-5 py-8 text-center shadow-inner sm:py-10 ${musicCover ? "bg-[#090810]" : "bg-gradient-to-br from-white/[0.09] to-white/[0.025]"}`}>
              {musicCover && (
                <>
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
                    style={{ backgroundImage: `url("${imagePath(musicCover)}")`, opacity: 0.55 }}
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-br from-[#090810]/70 via-[#090810]/60 to-[#120c20]/75"
                  />
                </>
              )}
              <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-violet-400/10 blur-3xl" />
              <div className="relative z-10 mx-auto mb-5 flex h-48 w-48 items-center justify-center sm:h-56 sm:w-56">
                <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                  <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(252,211,77,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray={2 * Math.PI * 46} strokeDashoffset={2 * Math.PI * 46 * (1 - progress)} className="transition-[stroke-dashoffset] duration-300" />
                </svg>
                <div className="flex flex-col items-center">
                  <span className="font-mono text-4xl font-light tracking-wider text-white sm:text-5xl">{timerDisplay}</span>
                  <span className="mt-2 text-[10px] uppercase tracking-[0.3em] text-amber-200/70">{runState === "delay" || (runState === "paused" && pausedFrom === "delay") ? "Start in" : "verbleibend"}</span>
                </div>
              </div>
              <p className="relative z-10 text-sm font-medium text-amber-50 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">{phaseLabel}</p>
              <p className="relative z-10 mt-1 text-xs text-white/85 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">{selected.name}</p>
              <div className="relative z-10 mt-6 flex justify-center gap-3">
                {(runState === "idle" || runState === "complete") && (
                  <button onClick={startTimer} className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-300 to-amber-500 px-6 py-3 text-sm font-semibold text-[#241b18] shadow-lg shadow-amber-900/20 transition hover:brightness-110">
                    <Play className="h-4 w-4 fill-current" /> Meditation starten
                  </button>
                )}
                {(runState === "delay" || runState === "running") && (
                  <button onClick={pauseTimer} className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/15">
                    <Pause className="h-4 w-4" /> Pause
                  </button>
                )}
                {runState === "paused" && (
                  <button onClick={resumeTimer} className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-300 to-amber-500 px-6 py-3 text-sm font-semibold text-[#241b18] transition hover:brightness-110">
                    <Play className="h-4 w-4 fill-current" /> Fortsetzen
                  </button>
                )}
                {runState !== "idle" && (
                  <button onClick={resetTimer} aria-label="Timer zurücksetzen" className="rounded-full border border-white/10 p-3 text-slate-300 transition hover:bg-white/10">
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

          <MeditationTimerSettings
            selected={selected}
            updateProfile={updateProfile}
            isLocked={isLocked}
            canDelete={profiles.length > 1}
            removeProfile={removeProfile}
          />
        </div>
      </section>
    </div>
  );
}

