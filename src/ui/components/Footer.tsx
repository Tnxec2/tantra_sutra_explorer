import { ChevronLeft, ChevronRight } from "lucide-react";


export function Footer({ activeSlide, setActiveSlide }: { setActiveSlide: (n: number) => void, activeSlide: number }) {
  return <footer className="relative z-20 w-full px-6 py-4 bg-[#14102b]/80 backdrop-blur-md border-t border-amber-500/15 flex items-center justify-between">
    <button
      onClick={() => setActiveSlide(Math.max(1, activeSlide - 1))}
      disabled={activeSlide === 1}
      className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#1b1537] hover:bg-amber-500/20 text-slate-300 hover:text-amber-200 disabled:opacity-30 border border-amber-500/20 transition-all cursor-pointer text-xs md:text-sm"
    >
      <ChevronLeft className="w-4 h-4" />
      <span>Zurück</span>
    </button>

    <div className="text-xs text-amber-400/80 font-mono">
      Folie <span className="font-bold text-amber-200">{activeSlide}</span> von 4
    </div>

    <button
      onClick={() => setActiveSlide(Math.min(4, activeSlide + 1))}
      disabled={activeSlide === 4}
      className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#1b1537] hover:bg-amber-500/20 text-slate-300 hover:text-amber-200 disabled:opacity-30 border border-amber-500/20 transition-all cursor-pointer text-xs md:text-sm"
    >
      <span>Weiter</span>
      <ChevronRight className="w-4 h-4" />
    </button>
  </footer>;
}