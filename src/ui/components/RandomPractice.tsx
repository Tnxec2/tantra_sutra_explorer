import { Shuffle, X } from "lucide-react"
import { DailyPractice } from "../../model/DailyPractice"
import { useCallback, useEffect, useState } from "react"
import { SUTRA } from "../../model/Sutra"
import { DailyLifePracticeCard } from "./DailyLifePracticeCard"

type RandomPracticeProps = {
    disabled: boolean,
    sutras: SUTRA[],
    handleSelectSutra: (id: string) => void
    onClose: () => void
}

type PracticeSelection = {
    practice: DailyPractice
    sutra: SUTRA
}

export const RandomPractice = ({ sutras, disabled, handleSelectSutra, onClose }: RandomPracticeProps) => {

    const [randomPractice, setRandomPractice] = useState<PracticeSelection | null>(null)

    useEffect(() => {
        const body = document.body
        const previousOverflow = body.style.overflow
        const previousPaddingRight = body.style.paddingRight
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

        body.style.overflow = "hidden"
        if (scrollbarWidth > 0) {
            const currentPaddingRight = Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0
            body.style.paddingRight = `${currentPaddingRight + scrollbarWidth}px`
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose()
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => {
            window.removeEventListener("keydown", handleKeyDown)
            body.style.overflow = previousOverflow
            body.style.paddingRight = previousPaddingRight
        }
    }, [onClose])

    const showRandomPractice = useCallback(() => {
        const options = sutras.flatMap(sutra =>
            (sutra.dailyPractices || []).map(practice => ({ practice, sutra }))
        )
        if (options.length === 0) return

        setRandomPractice(options[Math.floor(Math.random() * options.length)])
    }, [sutras])

    useEffect(() => {
        showRandomPractice()
    }, [showRandomPractice])

    return <div
        className="fixed inset-0 z-50 flex items-center justify-center overscroll-contain bg-black/75 backdrop-blur-sm p-4"
        onMouseDown={event => {
            if (event.target === event.currentTarget) onClose()
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
                    disabled={disabled}
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
                        onClick={() => onClose()}
                        aria-label="Modal schließen"
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100"
                    >
                        <X className="h-5 w-5" />
                    </button></div>
            </div>
            {randomPractice &&
                <div className="space-y-4 p-5">
                    <DailyLifePracticeCard 
                        prac={randomPractice.practice}
                    
                    />

                    <div className="text-sm">
                        <span className="text-slate-400">Ursprungsutra: </span>
                        <button
                            type="button"
                            onClick={() => {
                                handleSelectSutra(randomPractice.sutra.id)
                                setRandomPractice(null)
                                onClose()
                            }}
                            className="font-medium text-amber-300 underline decoration-amber-500/50 underline-offset-4 
                            hover:text-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"
                        >
                            {randomPractice.sutra.chapter} • {randomPractice.sutra.verseNum}: {randomPractice.sutra.title}
                        </button>
                    </div>
                </div>
            }
        </section>
    </div>
}