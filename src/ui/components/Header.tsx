import { Clock3, Search, Shuffle, Sparkles } from "lucide-react"
import { SUTRA } from "../../model/Sutra"
import { VERSION } from "../../index"
import { Button } from "../shared/Button"
import { CustomSelect } from "../shared/CustomSelect"



export const Header = ({ activeSutraId, handleSelectSutra, sutras, onOpenSearch, onOpenRandomPractice, onOpenMeditationTimer }:
    {
        sutras: SUTRA[],
        activeSutraId: string,
        handleSelectSutra: (id: string) => void,
        onOpenSearch: () => void,
        onOpenRandomPractice: () => void,
        onOpenMeditationTimer: () => void
    }) => {

    return <>
        <header className="relative z-20 w-full px-4 md:px-8 py-4 bg-[#14102b]/60
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

            <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-end">
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
            </div>
        </header>

    </>
}
