import { Music2, Pause, Play } from "lucide-react";
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
    const selectedSound = sounds.find(sound => sound.file === value);
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
                <select value={value} disabled={disabled} onChange={event => onChange(event.target.value)} className="min-w-0 flex-1 bg-transparent text-xs text-slate-200 outline-none disabled:opacity-50">
                    {allowNone && <option value="" className="bg-[#17142b]">Keine Musik</option>}
                    {sounds.map(sound => <option key={sound.file} value={sound.file} className="bg-[#17142b]">
                        {soundLabel(sound.file)}
                        </option>)
                    }
                </select>
                {value && <button 
                    onClick={() => onPreview(value)} 
                    aria-label={previewing === value ? "Vorschau stoppen" : `${title} anhören`} 
                    className={`rounded-lg p-2 text-amber-200 transition ${!disabled && 'hover:bg-amber-200/10'}`}
                    disabled={disabled}
                    >
                    {previewing === value ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>}
            </div>
        </div>
    );
}