import { useState } from "react"
import { Code, Search, Shuffle, Sparkles } from "lucide-react"
import { SUTRA } from "../../model/Sutra"
import { DailyPracticeSearch } from "./DailyPracticeSearch"
import { RandomPractice } from "./RandomPractice"



export const Header = ({ activeSutraId, handleSelectSutra, sutras, handleOpenEditor }:
    {
        sutras: SUTRA[],
        activeSutraId: string,
        handleSelectSutra: (id: string) => void,
        handleOpenEditor: () => void,
    }) => {
    
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isRandomPracticeOpen, setIsRandomPracticeOpen] = useState(false)


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
                    <p className="text-xs text-amber-400/70 font-medium">
                        {/* Subtitel */}
                    </p>
                </div>
            </div>

            {/* Sutra Selector Controls */}
            <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-end">
                <select
                    value={activeSutraId}
                    onChange={(e) => handleSelectSutra(e.target.value)}
                    className="bg-[#1b1537] text-amber-200 border border-amber-500/30 
            rounded-lg px-3 py-2 text-sm font-serif focus:outline-none focus:border-amber-400 
            cursor-pointer min-w-0 flex-1 md:w-56 md:flex-none"
                >
                    {sutras.map(s => (
                        <option key={s.id} value={s.id}>
                            {s.verseNum}: {s.title}
                        </option>
                    ))}
                </select>

                <button
                    type="button"
                    onClick={() => setIsSearchOpen(true)}
                    title="Alltagspraktiken nach Tag suchen"
                    aria-label="Alltagspraktiken nach Tag suchen"
                    className="p-2 rounded-lg bg-[#1b1537] hover:bg-amber-500/20 border
            border-amber-500/30 text-amber-300 transition-all flex items-center gap-1.5
            text-xs shrink-0"
                >
                    <Search className="w-4 h-4" />
                    <span className="hidden sm:inline">Suchen</span>
                </button>

                <button
                    type="button"
                    onClick={() => setIsRandomPracticeOpen(true)}
                    disabled={!sutras.some(sutra => sutra.dailyPractices?.length)}
                    title="Zufällige Alltagspraxis anzeigen"
                    aria-label="Zufällige Alltagspraxis anzeigen"
                    className="p-2 rounded-lg bg-[#1b1537] hover:bg-amber-500/20 border
            border-amber-500/30 text-amber-300 transition-all flex items-center gap-1.5
            text-xs shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <Shuffle className="w-4 h-4" />
                    <span className="hidden sm:inline">Zufallspraxis</span>
                </button>

                <button
                    onClick={handleOpenEditor}
                    title="Sutra Data JSON bearbeiten"
                    aria-label="Sutra Data JSON bearbeiten"
                    className="p-2 rounded-lg bg-[#1b1537] hover:bg-amber-500/20 border 
            border-amber-500/30 text-amber-300 transition-all flex items-center gap-1 text-xs shrink-0"
                >
                    <Code className="w-4 h-4" />
                    <span className="hidden sm:inline">JSON</span>
                </button>
            </div>
        </header>
        {isSearchOpen && (
            <DailyPracticeSearch
                sutras={sutras}
                onClose={() => setIsSearchOpen(false)}
                onSelectSutra={handleSelectSutra}
            />
        )}
        {isRandomPracticeOpen && (
                <RandomPractice
                    sutras={sutras}
                    handleSelectSutra={handleSelectSutra}
                    onClose={() => setIsRandomPracticeOpen(false)}
                    disabled={!sutras.some(sutra => sutra.dailyPractices?.length)}
                />
        )}
    </>
}
