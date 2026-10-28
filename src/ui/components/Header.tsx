import { useEffect, useState } from "react"
import { Code, Search, Shuffle, Sparkles, X } from "lucide-react"
import { DailyPractice } from "../../model/DailyPractice"
import { SUTRA } from "../../model/Sutra"
import { DailyPracticeSearch } from "./DailyPracticeSearch"
import { DynamicIcon } from "./DynamicIcon"

type PracticeSelection = {
    practice: DailyPractice
    sutra: SUTRA
}


export const Header = ({ activeSutraId, handleSelectSutra, sutras, handleOpenEditor }:
    {
        sutras: SUTRA[],
        activeSutraId: string,
        handleSelectSutra: (id: string) => void,
        handleOpenEditor: () => void,
    }) => {
    const [randomPractice, setRandomPractice] = useState<PracticeSelection | null>(null)
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    useEffect(() => {
        if (!randomPractice) return

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setRandomPractice(null)
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [randomPractice])

    const showRandomPractice = () => {
        const options = sutras.flatMap(sutra =>
            (sutra.dailyPractices || []).map(practice => ({ practice, sutra }))
        )
        if (options.length === 0) return

        setRandomPractice(options[Math.floor(Math.random() * options.length)])
    }

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
                    onClick={showRandomPractice}
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
        {randomPractice && (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
                onMouseDown={event => {
                    if (event.target === event.currentTarget) setRandomPractice(null)
                }}
            >
                <section
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="random-practice-title"
                    className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-amber-500/30 bg-[#14102b] shadow-2xl"
                >
                    <div className="flex items-center justify-between gap-4 border-b border-amber-500/20 bg-[#1b1537] p-4">
                        <h2 id="random-practice-title" className="font-serif font-bold text-amber-100">
                            Zufällige Alltagspraxis
                        </h2>
                        <div className="flex gap-2"><button
                            type="button"
                            onClick={showRandomPractice}
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
                            type="button"
                            onClick={() => setRandomPractice(null)}
                            aria-label="Modal schließen"
                            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100"
                        >
                            <X className="h-5 w-5" />
                        </button></div>
                    </div>
                    <div className="space-y-4 p-5">
                        <div className="flex items-center space-x-2">
                            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                                <DynamicIcon name={randomPractice.practice.icon} className="w-4 h-4" />
                            </div>
                            <h3 className="font-serif text-lg font-bold text-amber-200">
                                {randomPractice.practice.title}
                            </h3>
                        </div>
                        <div className="rounded-lg border border-slate-800 bg-[#0b091a]/60 p-3 text-sm">
                            <p className="mb-1 font-semibold text-amber-400">Situation</p>
                            <p className="text-slate-300">{randomPractice.practice.situation}</p>
                        </div>
                        <div className="text-sm leading-relaxed text-slate-200">
                            <p className="mb-1 font-semibold text-amber-300">Praxis</p>
                            <p>{randomPractice.practice.practice}</p>
                        </div>
                        {randomPractice.practice.quote && (
                            <p className="border-t border-slate-800 pt-3 font-serif text-sm italic text-slate-400">
                                „{randomPractice.practice.quote}“
                            </p>
                        )}
                        <div className="border-t border-amber-500/20 pt-4 text-sm">
                            <span className="text-slate-400">Ursprungsutra: </span>
                            <button
                                type="button"
                                onClick={() => {
                                    handleSelectSutra(randomPractice.sutra.id)
                                    setRandomPractice(null)
                                }}
                                className="font-medium text-amber-300 underline decoration-amber-500/50 underline-offset-4 hover:text-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"
                            >
                                {randomPractice.sutra.chapter} • {randomPractice.sutra.verseNum}: {randomPractice.sutra.title}
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        )}
    </>
}
