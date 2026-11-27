import { ChevronDown } from "lucide-react"
import { KeyboardEvent, useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react"

export type CustomSelectOption = {
    value: string,
    label: string
}

export const CustomSelect = ({ value, options, onChange, label }: {
    value: string,
    options: CustomSelectOption[],
    onChange: (value: string) => void,
    label: string
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0)
    const rootRef = useRef<HTMLDivElement>(null)
    const activeOptionRef = useRef<HTMLDivElement>(null)
    const listboxId = useId()
    const selectedIndex = options.findIndex(option => option.value === value)
    const selectedOption = options[selectedIndex]

    useLayoutEffect(() => {
        if (isOpen) {
            activeOptionRef.current?.scrollIntoView({ block: "nearest" })
        }
    }, [isOpen, activeIndex])

    useEffect(() => {
        if (!isOpen) return

        const handlePointerDown = (event: PointerEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("pointerdown", handlePointerDown)
        return () => document.removeEventListener("pointerdown", handlePointerDown)
    }, [isOpen])

    const selectOption = useCallback((index: number) => {
        const option = options[index]        
        if (!option) return
        onChange(option.value)
        setIsOpen(false)
    }, [onChange, options])

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
        if (options.length === 0) return

        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault()
            const direction = event.key === "ArrowDown" ? 1 : -1
            if (!isOpen) {
                setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0)
                setIsOpen(true)
                return
            }
            setActiveIndex(index => (index + direction + options.length) % options.length)
        } else if (event.key === "Home" || event.key === "End") {
            event.preventDefault()
            setIsOpen(true)
            setActiveIndex(event.key === "Home" ? 0 : options.length - 1)
        } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            if (isOpen) {
                selectOption(activeIndex)
            } else {
                setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0)
                setIsOpen(true)
            }
        } else if (event.key === "Escape" && isOpen) {
            event.preventDefault()
            setIsOpen(false)
        }
    }

    return (
        <div ref={rootRef} className="relative min-w-0 flex-1 md:w-56 md:flex-none">
            <button
                type="button"
                role="combobox"
                aria-label={label}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls={listboxId}
                aria-activedescendant={isOpen ? `${listboxId}-option-${activeIndex}` : undefined}
                onClick={(e) => {
                    if (!isOpen) {
                        setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0)
                    }
                    setIsOpen(open => !open)
                }}
                onKeyDown={handleKeyDown}
                onBlur={event => {
                    if (!rootRef.current?.contains(event.relatedTarget as Node | null)) {
                        setIsOpen(false)
                    }
                }}
                className="flex w-full items-center justify-between gap-2 rounded-lg border border-amber-500/30
                bg-theme-raised px-3 py-2 text-left text-sm font-serif text-amber-200
                hover:border-amber-400/60 focus:outline-none focus:border-amber-400"
            >
                <span className="truncate">{selectedOption?.label ?? label}</span>
                <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div
                    id={listboxId}
                    role="listbox"
                    aria-label={label}
                    className="absolute -left-4 top-full z-50 mt-1 max-h-72 
                    w-[calc(100vw-1rem)] 
                    md:w-auto
                    overflow-y-auto
                    ml-2 
                    mr-2
                    rounded-lg border border-amber-500/30 
                    bg-theme-raised p-1 shadow-xl"
                >
                    {options.map((option, index) => (
                        <div
                            key={option.value}
                            id={`${listboxId}-option-${index}`}
                            role="option"
                            aria-selected={option.value === value}
                            title={option.label}
                            ref={index === activeIndex ? activeOptionRef : undefined}
                            onMouseDown={event => event.preventDefault()}
                            onMouseMove={() => setActiveIndex(index)}
                            onClick={() => selectOption(index)}
                            className={`cursor-pointer truncate rounded-md px-3 py-2 
                                text-sm font-serif
                                ${index === activeIndex
                                ? "bg-amber-500/20 text-amber-100"
                                : "text-amber-200 hover:bg-amber-500/10"}`}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
