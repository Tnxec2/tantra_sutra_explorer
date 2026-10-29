import { RefObject, useEffect, useRef, useState } from "react"
import { Code2, Download, Ellipsis, FileCode2, FileText, Image as ImageIcon } from "lucide-react"
import { DailyPractice } from "../../model/DailyPractice"

type ShareMode = "html" | "text" | "markdown"

type PracticeShareMenuProps = {
  prac: DailyPractice
  targetRef: RefObject<HTMLElement | null>
}

export const PracticeShareMenu = ({ prac, targetRef }: PracticeShareMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!menuOpen) return

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false)
    }

    document.addEventListener("mousedown", closeOnOutsideClick)
    document.addEventListener("keydown", closeOnEscape)
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick)
      document.removeEventListener("keydown", closeOnEscape)
    }
  }, [menuOpen])

  const createPng = async () => {
    const target = targetRef.current
    if (!target) throw new Error("Die Praxis konnte nicht gefunden werden.")

    const clone = target.cloneNode(true) as HTMLElement
    const originalElements = [target, ...Array.from(target.querySelectorAll("*"))]
    const clonedElements = [clone, ...Array.from(clone.querySelectorAll("*"))]
    originalElements.forEach((element, index) => {
      const computedStyle = window.getComputedStyle(element)
      const inlineStyle = (clonedElements[index] as HTMLElement).style
      Array.from(computedStyle).forEach(property => {
        inlineStyle.setProperty(property, computedStyle.getPropertyValue(property))
      })
    })

    const { width, height } = target.getBoundingClientRect()
    clone.setAttribute("xmlns", "http://www.w3.org/1999/xhtml")
    clone.style.width = `${width}px`
    clone.style.height = `${height}px`
    clone.style.margin = "0"
    clone.style.backgroundColor = "#14102b"
    const markup = new XMLSerializer().serializeToString(clone)
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><foreignObject width="100%" height="100%">${markup}</foreignObject></svg>`
    const image = new Image()
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve()
      image.onerror = () => reject(new Error("Die Praxis konnte nicht gerendert werden."))
    })

    const scale = window.devicePixelRatio || 1
    const canvas = document.createElement("canvas")
    canvas.width = Math.ceil(width * scale)
    canvas.height = Math.ceil(height * scale)
    const context = canvas.getContext("2d")
    if (!context) throw new Error("PNG-Erstellung wird in diesem Browser nicht unterstützt.")
    context.scale(scale, scale)
    context.fillStyle = "#14102b"
    context.fillRect(0, 0, width, height)
    context.drawImage(image, 0, 0, width, height)

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(blob => {
        if (blob) resolve(blob)
        else reject(new Error("Das PNG-Bild konnte nicht erstellt werden."))
      }, "image/png")
    })
  }

  const downloadPng = (png: Blob) => {
    const url = URL.createObjectURL(png)
    const download = document.createElement("a")
    download.href = url
    download.download = `${prac.title.trim().replace(/[^a-z0-9-_]+/gi, "-") || "praxis"}.png`
    download.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const saveAsPng = async () => {
    try {
      downloadPng(await createPng())
      setMessage("PNG-Bild wurde gespeichert.")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Das PNG-Bild konnte nicht gespeichert werden.")
    }
    setMenuOpen(false)
  }

  const sharePng = async () => {
    try {
      const png = await createPng()
      const filename = `${prac.title.trim().replace(/[^a-z0-9-_]+/gi, "-") || "praxis"}.png`
      const file = new File([png], filename, { type: "image/png" })
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: prac.title, files: [file] })
        setMessage("PNG-Bild wurde geteilt.")
      } else {
        downloadPng(png)
        setMessage("PNG-Teilen wird nicht unterstützt; das Bild wurde stattdessen gespeichert.")
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setMenuOpen(false)
        return
      }
      setMessage(error instanceof Error ? error.message : "Das PNG-Bild konnte nicht geteilt werden.")
    }
    setMenuOpen(false)
  }

  const share = async (mode: ShareMode) => {
    const target = targetRef.current
    if (!target) return

    const content = mode === "html"
      ? target.outerHTML
      : mode === "markdown"
        ? `# ${prac.title}\n\n**Situation:** ${prac.situation}\n\n**Praxis:** ${prac.practice}${prac.quote ? `\n\n> ${prac.quote}` : ""}`
        : target.innerText
    try {
      if (navigator.share) {
        await navigator.share({ title: prac.title, text: content })
        setMessage(mode === "html" ? "HTML-Text wurde geteilt." : mode === "markdown" ? "Markdown-Text wurde geteilt." : "Text wurde geteilt.")
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(content)
        setMessage(mode === "html" ? "HTML-Text wurde in die Zwischenablage kopiert." : mode === "markdown" ? "Markdown-Text wurde in die Zwischenablage kopiert." : "Text wurde in die Zwischenablage kopiert.")
      } else {
        throw new Error("Teilen oder Kopieren wird in diesem Browser nicht unterstützt.")
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return
      setMessage(error instanceof Error ? error.message : "Der Inhalt konnte nicht geteilt werden.")
    }
    setMenuOpen(false)
  }

  return (
    <>
      <div className="absolute right-3 top-3" ref={menuRef}>
        <button
          type="button"
          aria-label="Kartenmenü öffnen"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(open => !open)}
          className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <Ellipsis className="h-5 w-5" aria-hidden="true" />
        </button>
        {menuOpen && (
          <div role="menu" className="absolute right-0 z-20 mt-1 min-w-52 rounded-lg border border-slate-700 bg-[#14102b] p-1 shadow-xl">
            <button type="button" role="menuitem" onClick={saveAsPng} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-slate-200 hover:bg-white/10">
              <Download className="h-4 w-4" aria-hidden="true" />
              Screenshot speichern
            </button>
            <button type="button" role="menuitem" onClick={sharePng} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-slate-200 hover:bg-white/10">
              <ImageIcon className="h-4 w-4" aria-hidden="true" />
              PNG-Bild teilen
            </button>
            <button type="button" role="menuitem" onClick={() => share("html")} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-slate-200 hover:bg-white/10">
              <Code2 className="h-4 w-4" aria-hidden="true" />
              HTML-Text teilen
            </button>
            <button type="button" role="menuitem" onClick={() => share("text")} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-slate-200 hover:bg-white/10">
              <FileText className="h-4 w-4" aria-hidden="true" />
              Plain Text teilen
            </button>
            <button type="button" role="menuitem" onClick={() => share("markdown")} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-slate-200 hover:bg-white/10">
              <FileCode2 className="h-4 w-4" aria-hidden="true" />
              Markdown-Text teilen
            </button>
          </div>
        )}
      </div>
      <span role="status" aria-live="polite" className="sr-only">{message}</span>
    </>
  )
}
