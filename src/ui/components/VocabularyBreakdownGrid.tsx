
import { Vocabulary } from "../../model/Vocabulary"
import { Card } from "../shared/Card"

export const VocabularyBreakdownGrid = ({ vocabulary }:
    { vocabulary?: Vocabulary[] }) => {


    return <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400/80">Wort-für-Wort Schlüsselbegriffe:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {vocabulary?.map((v, i) => 
                <VocabularyCard key={i} vocabularyItem={v} />
            )}
        </div>
    </div>
}

export const VocabularyCard = ({ vocabularyItem }:
    { vocabularyItem: Vocabulary }) => {


    return <Card>
        <div className="font-serif font-bold text-amber-200 text-sm">{vocabularyItem.term}</div>
        <div className="text-xs text-amber-400/80 mb-1">{vocabularyItem.translation}</div>
        <p className="text-xs text-slate-300 leading-snug">{vocabularyItem.meaning}</p>
    </Card>

}