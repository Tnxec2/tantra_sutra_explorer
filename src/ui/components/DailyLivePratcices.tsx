import { DailyPractice } from "../../model/DailyPractice"
import { DailyLifePracticeCard } from "./DailyLifePracticeCard"

export const DailyLifePractice = ({ dailyPractices }:
    { dailyPractices?: DailyPractice[] }) => {

    return <div className="space-y-4 animate-fadeIn">
        <div className="text-center mb-2">
            <h3 className="text-lg font-serif font-bold text-amber-200">
                Praktische Anwendung im Alltag
            </h3>
            <p className="text-xs text-slate-400">
                Wie du diese Sutra im normalen Leben verankerst
            </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dailyPractices?.map((prac, idx) =>
                <DailyLifePracticeCard prac={prac} key={idx} />
            )}
        </div>
    </div>
}