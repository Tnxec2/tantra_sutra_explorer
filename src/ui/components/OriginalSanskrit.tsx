import { Volume2, VolumeX } from "lucide-react";

export function OriginalSanskrit({ sanskritDevanagari, sanskritIAST, isPlayingAudio, togglePlayingAudio }: {
    sanskritDevanagari: string,
    sanskritIAST: string,
    isPlayingAudio: boolean,
    togglePlayingAudio: () => void
}) {
    return <div className="bg-[#14102b]/70 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-amber-500/20 shadow-2xl relative overflow-hidden group text-center space-y-4">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>

        {/* Audio simulation toggle */}
        <div className="flex justify-end">
            <button
                onClick={() => togglePlayingAudio()}
                className="flex items-center space-x-2 text-xs px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-all"
            >
                {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isPlayingAudio ? "Rezitation Stoppen" : "Rezitation Anhören (Audio)"}</span>
            </button>
        </div>

        <p className="font-serif text-2xl md:text-4xl text-amber-200/90 leading-relaxed tracking-wide whitespace-pre-line">
            {sanskritDevanagari}
        </p>
        <div className="h-px w-24 bg-amber-500/20 mx-auto my-2"></div>
        <p className="font-serif italic text-base md:text-xl text-slate-300/90 whitespace-pre-line">
            {sanskritIAST}
        </p>

        {isPlayingAudio && (
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 animate-pulse">
                🔊 Simuliere Rezitation der Sutra...
            </div>
        )}
    </div>
}