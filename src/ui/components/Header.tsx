import { Clock3, Search, Shuffle, Sparkles } from "lucide-react"
import { SUTRA } from "../../model/Sutra"
import { VERSION } from "../../index"
import { Button } from "../shared/Button"
import { CustomSelect } from "../shared/CustomSelect"
import { APP_THEMES, AppTheme, isAppTheme } from "../shared/theme"



export const Header = ({ activeSutraId, handleSelectSutra, sutras, onOpenSearch, onOpenRandomPractice, onOpenMeditationTimer, theme, onThemeChange }:
    {
        sutras: SUTRA[],
        activeSutraId: string,
        handleSelectSutra: (id: string) => void,
        onOpenSearch: () => void,
        onOpenRandomPractice: () => void,
        onOpenMeditationTimer: () => void,
        theme: AppTheme,
        onThemeChange: (theme: AppTheme) => void
    }) => {

    return <>
        <header className="relative z-20 w-full px-4 md:px-8 py-4 bg-theme-surface/60
      backdrop-blur-md border-b border-amber-500/15 flex flex-col md:flex-row items-center 
      justify-between gap-4">
            <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 
          to-purple-600/20 border border-amber-500/30 text-amber-300">
                    <Sparkles className="w-5 h-5" />
                </div>
                <div>
                    <h1 className="font-serif text-lg md:text-xl font-bold tracking-wider text-amber-100">
                        Tantra Sutra Explorer
                    </h1>
                    <p className="text-xs text-amber-400/70 font-xs">
                        version: {VERSION}
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto justify-end">
                <CustomSelect
                    value={activeSutraId}
                    onChange={handleSelectSutra}
                    label="Sutra auswählen"
                    options={sutras.map(s => ({
                        value: s.id,
                        label: `${s.verseNum}: ${s.title}`
                    }))}
                />

                <Button title="Alltagspraktiken nach Tag suchen" 
                        onClick={onOpenSearch} 
                        icon={<Search className="w-4 h-4" />} >Suchen</Button>

                <Button title="Zufällige Alltagspraxis anzeigen" 
                        disabled={!sutras.some(sutra => sutra.dailyPractices?.length)}
                        onClick={onOpenRandomPractice} 
                        icon={<Shuffle className="w-4 h-4" />} >Zufallspraxis</Button>

                <Button title="Meditationstimer öffnen"
                        onClick={onOpenMeditationTimer}
                        icon={<Clock3 className="w-4 h-4" />} >Timer</Button>
                <label className="sr-only sm:not-sr-only sm:text-xs sm:text-slate-400" htmlFor="theme-select">Farbschema</label>
                <select
                    id="theme-select"
                    aria-label="Farbschema"
                    value={theme}
                    onChange={event => {
                        if (isAppTheme(event.target.value)) onThemeChange(event.target.value);
                    }}
                    className="min-h-10 rounded-lg border border-amber-500/30 bg-theme-raised px-3 py-2 text-xs text-amber-200 outline-none transition focus:border-amber-400"
                >
                    {APP_THEMES.map(option => (
                        <option key={option.value} value={option.value} className="bg-theme-surface text-theme-text">
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </header>

    </>
}
