
import { Sparkles } from "lucide-react"
import { PhilosophicalNote } from "../../model/PhilosophicalNote"

export const TranslationAndCommentary = ({ translationGerman, philosophicalNotes }:
    { translationGerman?: string, philosophicalNotes?: PhilosophicalNote[] }) => {

    return <div className="space-y-6 animate-fadeIn">
        <div className="bg-[#14102b]/70 backdrop-blur-md rounded-2xl p-6 md:p-8 border 
        border-amber-500/20 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400/80">
                Deutsche Übersetzung
            </h3>
            <p className="font-serif text-lg md:text-2xl text-amber-100 leading-relaxed">
                „{translationGerman}“
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {philosophicalNotes?.map((note, idx) => (
                <div key={idx} className="bg-[#14102b]/50 backdrop-blur-md p-5 rounded-xl
                border border-amber-500/15 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center space-x-2 text-amber-300 font-serif
                        font-bold text-base mb-2">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            <span>{note.title}</span>
                        </div>
                        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                            {note.text}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    </div>
}