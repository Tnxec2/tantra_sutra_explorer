

import { DailyPractice } from "../../model/DailyPractice"
import { TextBox, TextBoxBordered } from "../shared/Box"
import { Card, CardHeader } from "../shared/Card"
import { TagsBox } from "../shared/TagsBox"
import { DynamicIcon } from "./DynamicIcon"
import { ShareableContent } from "./ShareableContent"

export const DailyLifePracticeCard = ({ prac, verseNum, verseTitle, onOpenSearch, onOpenPractice }: 
  { 
    prac: DailyPractice, 
    verseNum: string, verseTitle: string, 
    onOpenSearch: (tag: string) => void,
    onOpenPractice?: () => void
  }) => {


  return <div className="relative h-full">
    <ShareableContent
      title={prac.title}
      markdownContent={`# ${prac.title}\n\n**Situation:** ${prac.situation}\n\n**Praxis:** ${prac.practice}${prac.quote ? `\n\n> ${prac.quote}` : ""}`}
      verseNum={verseNum}
      verseTitle={verseTitle}
    >
      <Card>
        <CardHeader 
          icon={<DynamicIcon name={prac.icon} className="w-4 h-4" />} 
          title={prac.title} 
          onClick={onOpenPractice}
          />

        <TextBoxBordered title="Situation:" >
          {prac.situation}
        </TextBoxBordered>

        <TextBox title="Praxis:">
          {prac.practice}
        </TextBox>

        {prac.quote && (
          <div className="italic text-sm text-slate-400 border-t border-slate-800 pt-2 font-serif">
            "{prac.quote}"
          </div>
        )}

        {prac.tags && prac.tags.length > 0 && (
          <TagsBox onClick={onOpenSearch} tags={prac.tags} />
        )}

        <p className="mt-2 text-[10px] leading-tight text-slate-500 text-end">
            {verseNum} {verseTitle ? `• ${verseTitle}` : ""}
        </p>
      </Card>
    </ShareableContent>
  </div>

}