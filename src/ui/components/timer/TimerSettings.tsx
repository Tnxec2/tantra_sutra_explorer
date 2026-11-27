
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Bell, Check, Clock3, Music2, Plus, Trash2 } from "lucide-react";
import { IntervalSound, TimerProfile } from "./timerTypes";
import { bellSounds, musicSounds, soundPath } from "./data";
import { SoundPicker } from "./SoundPicker";
import { blankIntervalSound } from "./helper";
import { TimerSettingsHelp } from "./TimerSettingsHelp";



function NumberField({ label, min, max, value, disabled, onChange }: {
    label: string;
    min: number;
    max: number;
    value: number;
    disabled: boolean;
    onChange: (value: number) => void;
}) {
    return (
        <label className="min-w-0 space-y-1.5">
            <span className="block truncate text-[10px] font-medium text-slate-400 sm:text-xs">{label}</span>
            <input type="number" min={min} max={max} value={value} disabled={disabled}
                onChange={event => onChange(Math.min(max, Math.max(min, Number(event.target.value) || min)))}
                className="w-full rounded-xl border border-theme-border/40 bg-theme-input/50 px-2.5 py-2.5 text-sm text-theme-text outline-none transition focus:border-amber-200/40 disabled:opacity-50" />
        </label>
    );
}

export function MeditationTimerSettings({ selected, isLocked, canDelete, removeProfile, updateProfile }: {
    selected: TimerProfile,
    isLocked: boolean,
    canDelete: boolean,
    removeProfile: () => void,
    updateProfile: (key: keyof TimerProfile, value: TimerProfile[keyof TimerProfile]) => void
}) {

    const [audioError, setAudioError] = useState("");
    const [previewing, setPreviewing] = useState("");
    const previewRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => () => {
        //if (isLocked) {
            previewRef.current?.pause();
            setPreviewing("");
        //}
    }, [isLocked]);

    const previewSound = (file: string) => {
        previewRef.current?.pause();
        if (previewing === file) {
            setPreviewing("");
            return;
        }
        const audio = new Audio(soundPath(file));
        previewRef.current = audio;
        setPreviewing(file);
        audio.play().catch(error => {
            console.error(`Sound konnte nicht vorgespielt werden: ${file}`, error);
            setAudioError("Soundvorschau nicht möglich.");
            setPreviewing("");
        });
        audio.onended = () => setPreviewing("");
    };

    const updateIntervalSound = (id: string, changes: Partial<IntervalSound>) => {
        updateProfile("intervalSounds", selected.intervalSounds.map(interval =>
            interval.id === id ? { ...interval, ...changes } : interval
        ));
    };

    const moveIntervalSound = (index: number, offset: -1 | 1) => {
        const nextIndex = index + offset;
        if (nextIndex < 0 || nextIndex >= selected.intervalSounds.length) return;
        const intervalSounds = [...selected.intervalSounds];
        [intervalSounds[index], intervalSounds[nextIndex]] = [intervalSounds[nextIndex], intervalSounds[index]];
        updateProfile("intervalSounds", intervalSounds);
    };

    return (
        <div className="space-y-5 rounded-2xl border border-theme-border/40 bg-theme-raised/40 p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between">
                <div>
                    <h3 className="font-serif text-lg text-amber-50">Timer gestalten</h3>
                </div>
                <div className="flex items-center gap-1">
                    <TimerSettingsHelp />
                    {canDelete && <button onClick={removeProfile}
                        disabled={isLocked}
                        aria-label="Timer löschen"
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-400/10 hover:text-rose-300 disabled:opacity-40">
                        <Trash2 className="h-4 w-4" />
                    </button>}
                </div>
            </div>

            <label className="block space-y-1.5">
                <span className="text-xs font-medium text-slate-300">Name</span>
                <input value={selected.name} onChange={event => updateProfile("name", event.target.value)} disabled={isLocked} maxLength={40} className="w-full rounded-xl border border-theme-border/40 bg-theme-input/50 px-3.5 py-2.5 text-sm text-theme-text outline-none transition placeholder:text-slate-600 focus:border-amber-200/40 disabled:opacity-50" />
            </label>

            <div className="grid grid-cols-2 gap-3">
                <NumberField label="Dauer (Min.)" min={1} max={240} value={selected.durationMinutes} disabled={isLocked} onChange={value => updateProfile("durationMinutes", value)} />
                <NumberField label="Startpause (Sek.)" min={0} max={300} value={selected.startPauseSeconds} disabled={isLocked} onChange={value => updateProfile("startPauseSeconds", value)} />
            </div>

            <SoundPicker title="Beginn-Sound" icon={<Bell className="h-4 w-4" />} value={selected.startSound} sounds={bellSounds} disabled={isLocked} previewing={previewing} onChange={value => updateProfile("startSound", value)} onPreview={previewSound} />
            <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                        <Clock3 className="h-4 w-4" />
                        <span>Intervall-Sounds</span>
                    </div>
                    <button
                        type="button"
                        disabled={isLocked}
                        onClick={() => updateProfile("intervalSounds", [...selected.intervalSounds, blankIntervalSound()])}
                        className="flex items-center gap-1.5 rounded-lg border border-theme-border/40 px-3 py-2 text-xs text-amber-100 transition hover:bg-theme-raised disabled:opacity-50"
                    >
                        <Plus className="h-3.5 w-3.5" /> Hinzufügen
                    </button>
                </div>
                {selected.intervalSounds.length === 0 && (
                    <p className="text-xs text-slate-500">Noch keine Intervall-Sounds hinzugefügt.</p>
                )}
                {selected.intervalSounds.map((interval, index) => (
                    <div key={interval.id} className="space-y-3 rounded-xl border border-theme-border/40 bg-theme-surface/40 p-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-400">Intervall-Sound {index + 1}</span>
                            <div className="flex items-center">
                                <button
                                    type="button"
                                    disabled={isLocked || index === 0}
                                    aria-label={`Intervall-Sound ${index + 1} nach oben verschieben`}
                                    onClick={() => moveIntervalSound(index, -1)}
                                    className="rounded-lg p-2 text-slate-500 transition hover:bg-theme-raised hover:text-slate-200 disabled:opacity-30"
                                >
                                    <ArrowUp className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    disabled={isLocked || index === selected.intervalSounds.length - 1}
                                    aria-label={`Intervall-Sound ${index + 1} nach unten verschieben`}
                                    onClick={() => moveIntervalSound(index, 1)}
                                    className="rounded-lg p-2 text-slate-500 transition hover:bg-theme-raised hover:text-slate-200 disabled:opacity-30"
                                >
                                    <ArrowDown className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    disabled={isLocked}
                                    aria-label={`Intervall-Sound ${index + 1} entfernen`}
                                    onClick={() => updateProfile("intervalSounds", selected.intervalSounds.filter(item => item.id !== interval.id))}
                                    className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-400/10 hover:text-rose-300 disabled:opacity-40"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <SoundPicker
                            title="Sound"
                            icon={<Bell className="h-4 w-4" />}
                            value={interval.file}
                            sounds={bellSounds}
                            disabled={isLocked}
                            previewing={previewing}
                            onChange={file => updateIntervalSound(interval.id, { file })}
                            onPreview={previewSound}
                        />
                        <div className="flex flex-wrap items-end gap-4">
                            <div className="w-32">
                                <NumberField
                                    label="Abstand (Min.)"
                                    min={1}
                                    max={240}
                                    value={interval.intervalMinutes}
                                    disabled={isLocked}
                                    onChange={intervalMinutes => updateIntervalSound(interval.id, { intervalMinutes })}
                                />
                            </div>
                            <label className="flex items-center gap-2 pb-2.5 text-xs text-slate-300">
                                <input
                                    type="checkbox"
                                    checked={interval.repeat}
                                    disabled={isLocked}
                                    onChange={event => updateIntervalSound(interval.id, { repeat: event.target.checked })}
                                    className="h-4 w-4 accent-amber-300"
                                />
                                Wiederholen
                            </label>
                        </div>
                        <p className="text-[10px] text-slate-500">
                            {interval.repeat ? "Wird in diesem Abstand wiederholt." : "Wird nur beim ersten Erreichen des Abstands abgespielt."}
                        </p>
                    </div>
                ))}
            </div>
            <SoundPicker title="End-Sound" icon={<Check className="h-4 w-4" />} value={selected.endSound} sounds={bellSounds} disabled={isLocked} previewing={previewing} onChange={value => updateProfile("endSound", value)} onPreview={previewSound} />
            <SoundPicker title="Hintergrundmusik" icon={<Music2 className="h-4 w-4" />} value={selected.music} sounds={musicSounds} disabled={isLocked} allowNone previewing={previewing} onChange={value => updateProfile("music", value)} onPreview={previewSound} />

            {audioError && <p role="alert" className="rounded-xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-xs text-rose-200">{audioError}</p>}
        </div>
    )
}