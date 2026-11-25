
import { useEffect, useRef, useState } from "react";
import { Bell, Check, Clock3, Music2, Trash2 } from "lucide-react";
import { TimerProfile } from "./timerTypes";
import { bellSounds, musicSounds, soundPath } from "./data";
import { SoundPicker } from "./SoundPicker";



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
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-2.5 py-2.5 text-sm text-white outline-none transition focus:border-amber-200/40 disabled:opacity-50" />
        </label>
    );
}

export function MeditationTimerSettings({ selected, isLocked, canDelete, removeProfile, updateProfile }: {
    selected: TimerProfile,
    isLocked: boolean,
    canDelete: boolean,
    removeProfile: () => void,
    updateProfile: (key: keyof TimerProfile, value: string | number) => void
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

    return (
        <div className="space-y-5 border-t border-white/10 bg-black/10 p-5 sm:p-7 lg:border-l lg:border-t-0">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-serif text-lg text-amber-50">Timer gestalten</h3>
                    <p className="text-xs text-slate-400">Einstellungen werden automatisch lokal gespeichert.</p>
                </div>
                {canDelete && <button onClick={removeProfile}
                    disabled={isLocked}
                    aria-label="Timer löschen"
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-400/10 hover:text-rose-300 disabled:opacity-40">
                    <Trash2 className="h-4 w-4" />
                </button>}
            </div>

            <label className="block space-y-1.5">
                <span className="text-xs font-medium text-slate-300">Name</span>
                <input value={selected.name} onChange={event => updateProfile("name", event.target.value)} disabled={isLocked} maxLength={40} className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-amber-200/40 disabled:opacity-50" />
            </label>

            <div className="grid grid-cols-3 gap-3">
                <NumberField label="Dauer (Min.)" min={1} max={240} value={selected.durationMinutes} disabled={isLocked} onChange={value => updateProfile("durationMinutes", value)} />
                <NumberField label="Intervall (Min.)" min={0} max={120} value={selected.intervalMinutes} disabled={isLocked} onChange={value => updateProfile("intervalMinutes", value)} />
                <NumberField label="Startpause (Sek.)" min={0} max={300} value={selected.startPauseSeconds} disabled={isLocked} onChange={value => updateProfile("startPauseSeconds", value)} />
            </div>
            <p className="-mt-3 text-[10px] text-slate-500">Intervall 0 deaktiviert den Zwischenton.</p>

            <SoundPicker title="Beginn-Sound" icon={<Bell className="h-4 w-4" />} value={selected.startSound} sounds={bellSounds} disabled={isLocked} previewing={previewing} onChange={value => updateProfile("startSound", value)} onPreview={previewSound} />
            <SoundPicker title="Intervall-Sound" icon={<Clock3 className="h-4 w-4" />} value={selected.intervalSound} sounds={bellSounds} disabled={isLocked} previewing={previewing} onChange={value => updateProfile("intervalSound", value)} onPreview={previewSound} />
            <SoundPicker title="End-Sound" icon={<Check className="h-4 w-4" />} value={selected.endSound} sounds={bellSounds} disabled={isLocked} previewing={previewing} onChange={value => updateProfile("endSound", value)} onPreview={previewSound} />
            <SoundPicker title="Hintergrundmusik" icon={<Music2 className="h-4 w-4" />} value={selected.music} sounds={musicSounds} disabled={isLocked} allowNone previewing={previewing} onChange={value => updateProfile("music", value)} onPreview={previewSound} />

            {audioError && <p role="alert" className="rounded-xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-xs text-rose-200">{audioError}</p>}
        </div>
    )
}