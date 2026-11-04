
import { Sparkles } from "lucide-react"
import { PhilosophicalNote } from "../../model/PhilosophicalNote"
import { ShareableContent } from "./ShareableContent"



export const TranslationAndCommentary = ({ translationGerman, philosophicalNotes, verseNum, verseTitle }:
    { translationGerman?: string, philosophicalNotes?: PhilosophicalNote[], verseNum: string, verseTitle?: string }) => {

    return <div className="space-y-6 animate-fadeIn">
        <ShareableContent
            title="Deutsche Übersetzung"
            markdownContent={`# Deutsche Übersetzung\n\n„${translationGerman ?? ""}“`}
            verseNum={verseNum}
            verseTitle={verseTitle}
            className="bg-[#14102b]/70 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-amber-500/20 space-y-4"
        >
            <h3 className="pr-10 text-xs font-semibold uppercase tracking-wider text-amber-400/80">
                Deutsche Übersetzung
            </h3>
            <p className="font-serif text-lg md:text-2xl text-amber-100 leading-relaxed">
                „{translationGerman}“
            </p>
        </ShareableContent>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {philosophicalNotes?.map((note, idx) => (
                <ShareableContent
                    key={idx}
                    title={note.title}
                    markdownContent={`# ${note.title}\n\n${note.text}`}
                    verseNum={verseNum}
                    verseTitle={verseTitle}
                    className="bg-[#14102b]/50 backdrop-blur-md p-5 rounded-xl border border-amber-500/15 flex flex-col justify-between"
                >
                    <div className="pr-10">
                        <div className="flex items-center space-x-2 text-amber-300 font-serif
                        font-bold text-base mb-2">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            <span>{note.title}</span>
                        </div>
                        <p className="text-sm md:text-sm text-slate-300 leading-relaxed">
                            {note.text}
                        </p>
                    </div>
                </ShareableContent>
            ))}
        </div>
    </div>
}