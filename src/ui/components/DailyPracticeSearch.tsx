import { useEffect, useMemo, useState } from "react"
import { Search, X } from "lucide-react"
import { DailyPractice } from "../../model/DailyPractice"
import { SUTRA } from "../../model/Sutra"

type PracticeResult = {
    practice: DailyPractice
    sutra: SUTRA
    key: string
}

export const DailyPracticeSearch = ({
    sutras,
    onClose,
    onSelectSutra,
}: {
    sutras: SUTRA[]
    onClose: () => void
    onSelectSutra: (id: string) => void
}) => {
    const [query, setQuery] = useState("")
    const [selectedTag, setSelectedTag] = useState<string>()
    const [selectedPractice, setSelectedPractice] = useState<PracticeResult | null>(null)

    const tags = useMemo(() => {
        const uniqueTags = new Map<string, string>()
        sutras.forEach(sutra => {
            (sutra.dailyPractices || []).forEach(practice => {
                (practice.tags || []).forEach(tag => {
                    const normalizedTag = tag.trim()
                    if (normalizedTag) {
                        const key = normalizedTag.toLocaleLowerCase("de")
                        if (!uniqueTags.has(key)) uniqueTags.set(key, normalizedTag)
                    }
                })
            })
        })
        const t = Array.from(uniqueTags.values()).sort((a, b) => a.localeCompare(b, "de"))
        console.log("tags", t);
        
        return t;
    }, [sutras])

    const suggestions = useMemo(() => {
        const normalizedQuery = query.trim().toLocaleLowerCase("de")
        if (!normalizedQuery || selectedTag) return []
        
        return tags.filter(tag => tag.toLocaleLowerCase("de").includes(normalizedQuery))
    }, [query, selectedTag, tags])

    const results = useMemo<PracticeResult[]>(() => {
        if (!selectedTag) return []
        const normalizedTag = selectedTag.toLocaleLowerCase("de")
        return sutras.flatMap(sutra =>
            (sutra.dailyPractices || []).flatMap((practice, index) =>
                (practice.tags || []).some(tag => tag.trim().toLocaleLowerCase("de") === normalizedTag)
                    ? [{ practice, sutra, key: `${sutra.id}-${index}` }]
                    : []
            )
        )
    }, [selectedTag, sutras])

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose()
            if (
                event.key === "Enter" &&
                event.target instanceof HTMLInputElement &&
                event.target.id === "daily-practice-tag" &&
                suggestions.length > 0
            ) {
                event.preventDefault()
                const normalizedQuery = query.trim().toLocaleLowerCase("de")
                const selectedSuggestion = suggestions.find(
                    tag => tag.toLocaleLowerCase("de") === normalizedQuery
                ) || suggestions[0]
                setSelectedTag(selectedSuggestion)
                setQuery(selectedSuggestion)
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [onClose, query, suggestions])

    const selectTag = (tag: string) => {
        setQuery(tag)
        setSelectedTag(tag)
        setSelectedPractice(null)
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
            onMouseDown={event => {
                if (event.target === event.currentTarget) onClose()
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="daily-practice-search-title"
                className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-amber-500/30 bg-[#14102b] shadow-2xl"
            >
                <div className="flex items-center justify-between gap-4 border-b border-amber-500/20 bg-[#1b1537] p-4">
                    <h2 id="daily-practice-search-title" className="font-serif font-bold text-amber-100">
                        Alltagspraktiken suchen
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Suche schließen"
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-5 p-5">
                    <div className="relative">
                        <label htmlFor="daily-practice-tag" className="mb-2 block text-sm font-medium text-amber-200">
                            Tag auswählen oder eingeben
                        </label>
                        <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-[#0b091a]/70 px-3 focus-within:border-amber-400">
                            <Search className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
                            <input
                                id="daily-practice-tag"
                                type="text"
                                autoFocus
                                autoComplete="off"
                                value={query}
                                onChange={event => {
                                    setQuery(event.target.value)
                                    setSelectedTag(undefined)
                                    setSelectedPractice(null)
                                }}
                                aria-label="Nach einem Praxis-Tag suchen"
                                aria-autocomplete="list"
                                aria-expanded={suggestions.length > 0}
                                className="w-full bg-transparent py-2.5 text-sm text-slate-100 
                                outline-none placeholder:text-slate-500"
                                placeholder="z. B. Atem, Klang oder Achtsamkeit"
                            />
                            {query && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setQuery("")
                                        setSelectedTag(undefined)
                                        setSelectedPractice(null)
                                    }}
                                    aria-label="Suchbegriff löschen"
                                    className="text-slate-400 hover:text-slate-100"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {suggestions.length > 0 && (
                            <ul
                                role="listbox"
                                aria-label="Passende Tags"
                                className="fixed z-10 mt-1 max-h-52 w-auto overflow-y-auto rounded-lg border border-amber-500/25 bg-[#1b1537] p-1 shadow-xl"
                            >
                                {suggestions.map(tag => (
                                    <li key={tag}>
                                        <button
                                            type="button"
                                            role="option"
                                            aria-selected={false}
                                            onClick={() => selectTag(tag)}
                                            className="w-full rounded-md px-3 py-2 text-left text-sm text-slate-200 hover:bg-amber-500/15 hover:text-amber-100"
                                        >
                                            {tag}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {selectedTag && (
                        <section aria-live="polite" className="space-y-3">
                            <h3 className="text-sm font-semibold text-amber-200">
                                Praktiken mit Tag „{selectedTag}“ ({results.length})
                            </h3>
                            {results.length === 0 ? (
                                <p className="text-sm text-slate-400">Keine Praktiken mit diesem Tag gefunden.</p>
                            ) : (
                                <ul className="space-y-2 h-[100pt] overflow-y-auto p-3 rounded-lg border border-amber-500/25">
                                    {results.map(result => (
                                        <li key={result.key}>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedPractice(result)}
                                                aria-pressed={selectedPractice?.key === result.key}
                                                className={`w-full rounded-lg border p-3 text-left transition-colors ${
                                                    selectedPractice?.key === result.key
                                                        ? "border-amber-400/60 bg-amber-500/10"
                                                        : "border-slate-800 bg-[#0b091a]/50 hover:border-amber-500/40"
                                                }`}
                                            >
                                                <span className="block font-medium text-amber-100">
                                                    {result.practice.title}
                                                </span>
                                                <span className="mt-1 block text-xs text-slate-400">
                                                    {result.sutra.verseNum} · {result.sutra.title}
                                                </span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    )}

                    {selectedPractice && (
                        <article className="space-y-4 rounded-xl border border-amber-500/25 bg-[#0b091a]/60 p-4">
                            <h3 className="font-serif text-lg font-bold text-amber-100">
                                {selectedPractice.practice.title}
                            </h3>
                            <div className="text-sm">
                                <p className="mb-1 font-semibold text-amber-400">Situation</p>
                                <p className="text-slate-300">{selectedPractice.practice.situation}</p>
                            </div>
                            <div className="text-sm leading-relaxed">
                                <p className="mb-1 font-semibold text-amber-300">Praxis</p>
                                <p className="text-slate-200">{selectedPractice.practice.practice}</p>
                            </div>
                            {selectedPractice.practice.quote && (
                                <p className="border-t border-slate-800 pt-3 font-serif text-sm italic text-slate-400">
                                    „{selectedPractice.practice.quote}“
                                </p>
                            )}
                            <div className="border-t border-amber-500/20 pt-3 text-sm">
                                <span className="text-slate-400">Ursprungsutra: </span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onSelectSutra(selectedPractice.sutra.id)
                                        onClose()
                                    }}
                                    className="font-medium text-amber-300 underline decoration-amber-500/50 underline-offset-4 hover:text-amber-100"
                                >
                                    {selectedPractice.sutra.verseNum}: {selectedPractice.sutra.title}
                                </button>
                            </div>
                        </article>
                    )}
                </div>
            </section>
        </div>
    )
}
