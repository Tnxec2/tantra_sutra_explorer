
import { Sparkles } from "lucide-react"
import { PhilosophicalNote } from "../../model/PhilosophicalNote"
import { ShareableContent } from "./ShareableContent"
import { Card, CardHeader } from "../shared/Card"
import { TextBox } from "../shared/Box"



export const TranslationAndCommentary = ({ translationGerman, philosophicalNotes, verseNum, verseTitle }:
    { translationGerman?: string, philosophicalNotes?: PhilosophicalNote[], verseNum: string, verseTitle?: string }) => {

    return <div className="space-y-6 animate-fadeIn">
        <ShareableContent
            title="Deutsche Übersetzung"
            markdownContent={`# Deutsche Übersetzung\n\n„${translationGerman ?? ""}“`}
            verseNum={verseNum}
            verseTitle={verseTitle}
        >
            <Card>
                <CardHeader title="Deutsche Übersetzung" uppercase primary />
                
                <p className="font-serif text-lg md:text-2xl text-amber-100 leading-relaxed">
                    „{translationGerman}“
                </p>
            </Card>
        </ShareableContent>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {philosophicalNotes?.map((note, idx) => (
                <ShareableContent
                    key={idx}
                    title={note.title}
                    markdownContent={`# ${note.title}\n\n${note.text}`}
                    verseNum={verseNum}
                    verseTitle={verseTitle}
                >
                    <Card>
                        <CardHeader title={note.title} icon={<Sparkles className="w-4 h-4" />} />
                        <TextBox>
                            {note.text}
                        </TextBox>
                    </Card>
                </ShareableContent>
            ))}
        </div>
    </div>
}