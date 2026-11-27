
import { Plus } from "lucide-react";
import { TimerProfile } from "./timerTypes";





export function TImerList({ selected, profiles, isLocked, openProfile, addProfile }: {
    profiles: TimerProfile[],
    selected: TimerProfile,
    isLocked: boolean,
    openProfile: (id: string) => void,
    addProfile: () => void
}) {


    return (
        <div className="flex flex-wrap items-center gap-2 overflow-y-auto pb-1">
            {profiles.map(profile => (
                <button
                    key={profile.id}
                    onClick={() => { if (!isLocked) { openProfile(profile.id) } }}
                    disabled={isLocked}
                    className={`max-w-48 truncate rounded-full border px-4 py-2 text-sm transition ${profile.id === selected.id ? "border-amber-200/50 bg-amber-200/15 text-amber-100" : "border-theme-border/40 bg-theme-raised/40 text-slate-400 hover:bg-theme-raised"} disabled:cursor-not-allowed`}
                >{profile.name || "Unbenannter Timer"}</button>
            ))}
            <button onClick={addProfile} disabled={isLocked} aria-label="Neuen Timer hinzufügen" className="shrink-0 rounded-full border border-dashed border-theme-border/60 p-2 text-slate-400 transition hover:border-amber-200/40 hover:text-amber-100 disabled:opacity-40">
                <Plus className="h-4 w-4" />
            </button>
        </div>
    )
}