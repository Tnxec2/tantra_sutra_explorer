export function OriginalSanskrit({ sanskritDevanagari, sanskritIAST }: {
    sanskritDevanagari: string,
    sanskritIAST: string
}) {
    return <div className="bg-[#14102b]/70 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-amber-500/20 shadow-2xl relative overflow-hidden group text-center space-y-4">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>

        <p className="font-serif text-2xl md:text-4xl text-amber-200/90 leading-relaxed tracking-wide whitespace-pre-line">
            {sanskritDevanagari}
        </p>
        <div className="h-px w-24 bg-amber-500/20 mx-auto my-2"></div>
        <p className="font-serif italic text-base md:text-xl text-slate-300/90 whitespace-pre-line">
            {sanskritIAST}
        </p>
    </div>
}