import { useEffect, useState } from "react";
import { Check, Music2, Pause, Play, X } from "lucide-react";
import { imagePath } from "./data";
import { SoundOption } from "./timerTypes";
import { soundLabel } from "./helper";

export function SoundPicker({ title, icon, value, sounds, disabled, allowNone, previewing, onChange, onPreview }: {
    title: string;
    icon: React.ReactNode;
    value: string;
    sounds: SoundOption[];
    disabled: boolean;
    allowNone?: boolean;
    previewing: string;
    onChange: (value: string) => void;
    onPreview: (file: string) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [draftValue, setDraftValue] = useState(value);
    const selectedSound = sounds.find(sound => sound.file === value);
    const selectedLabel = value ? soundLabel(value) : "Keine Musik";

    const stopPreview = () => {
        if (previewing) onPreview(previewing);
    };

    const closePicker = () => {
        stopPreview();
        setIsOpen(false);
    };

    const confirmSelection = () => {
        stopPreview();
        onChange(draftValue);
        setIsOpen(false);
    };

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                if (previewing) onPreview(previewing);
                setIsOpen(false);
                event.stopImmediatePropagation();
            }
        };
        window.addEventListener("keydown", handleKeyDown, true);
        return () => window.removeEventListener("keydown", handleKeyDown, true);
    }, [isOpen, previewing, onPreview]);

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                {icon}<span>{title}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] p-2">
                <div className="h-10 w-12 shrink-0 overflow-hidden rounded-lg bg-white/5">
                    {selectedSound?.image
                        ? <img src={imagePath(selectedSound.image)} alt="" className="h-full w-full object-cover" />
                        : <div className="flex h-full items-center justify-center text-slate-600">
                            <Music2 className="h-4 w-4" />
                        </div>
                    }
                </div>
                <span className="min-w-0 flex-1 truncate text-xs text-slate-200">{selectedLabel}</span>
                <button
                    type="button"
                    onClick={() => {
                        setDraftValue(value);
                        setIsOpen(true);
                    }}
                    disabled={disabled}
                    className="rounded-lg border border-white/10 px-3 py-2 text-xs text-amber-100 transition hover:bg-white/10 disabled:opacity-50"
                >
                    Auswählen
                </button>
            </div>

            {isOpen && (
                <div
                    className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
                    //onMouseDown={event => {
                        // if (event.target === event.currentTarget) closePicker();
                    //}}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="sound-picker-title"
                        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-amber-500/30 bg-[#14102b] shadow-2xl"
                    >
                        <div className="flex items-center justify-between gap-4 border-b border-amber-500/20 bg-[#1b1537] p-4">
                            <div>
                                <h2 id="sound-picker-title" className="font-serif font-bold text-amber-100">
                                    {title} auswählen
                                </h2>
                                <p className="mt-1 text-xs text-slate-400">Wähle einen Sound aus und höre ihn bei Bedarf an.</p>
                            </div>
                            <button
                                type="button"
                                onClick={closePicker}
                                aria-label="Soundauswahl schließen"
                                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="min-h-0 flex-1 overflow-y-auto p-4">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {allowNone && (
                                    <button
                                        type="button"
                                        aria-pressed={draftValue === ""}
                                        onClick={() => setDraftValue("")}
                                        className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${draftValue === "" ? "border-amber-300/60 bg-amber-300/10" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.07]"}`}
                                    >
                                        <div className="flex h-14 w-16 shrink-0 items-center justify-center rounded-lg bg-white/5 text-slate-500">
                                            <Music2 className="h-5 w-5" />
                                        </div>
                                        <span className="min-w-0 flex-1 text-sm text-slate-200">Keine Musik</span>
                                        {draftValue === "" && <Check className="h-4 w-4 text-amber-200" />}
                                    </button>
                                )}
                                {sounds.map(sound => (
                                    <div
                                        key={sound.file}
                                        className={`flex items-center gap-3 rounded-xl border p-3 transition ${draftValue === sound.file ? "border-amber-300/60 bg-amber-300/10" : "border-white/10 bg-white/[0.03]"}`}
                                    >
                                        <button
                                            type="button"
                                            aria-pressed={draftValue === sound.file}
                                            onClick={() => setDraftValue(sound.file)}
                                            className="flex min-w-0 flex-1 items-center gap-3 text-left"
                                        >
                                            <div className="h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-white/5">
                                                {sound.image && <img src={imagePath(sound.image)} alt="" className="h-full w-full object-cover" />}
                                            </div>
                                            <span className="min-w-0 flex-1 truncate text-sm text-slate-200">{soundLabel(sound.file)}</span>
                                            {draftValue === sound.file && <Check className="h-4 w-4 shrink-0 text-amber-200" />}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onPreview(sound.file)}
                                            aria-label={previewing === sound.file ? `${soundLabel(sound.file)} Vorschau stoppen` : `${soundLabel(sound.file)} anhören`}
                                            className="shrink-0 rounded-lg p-2 text-amber-200 transition hover:bg-amber-200/10"
                                        >
                                            {previewing === sound.file ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 border-t border-white/10 p-4">
                            <button
                                type="button"
                                onClick={closePicker}
                                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/10"
                            >
                                Abbrechen
                            </button>
                            <button
                                type="button"
                                onClick={confirmSelection}
                                className="rounded-xl bg-gradient-to-r from-amber-300 to-amber-500 px-4 py-2.5 text-sm font-semibold text-[#241b18] transition hover:brightness-110"
                            >
                                Übernehmen
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}
