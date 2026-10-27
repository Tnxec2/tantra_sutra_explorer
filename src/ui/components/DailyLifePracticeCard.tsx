import { DailyPractice } from "../../model/DailyPractice"
import { DynamicIcon } from "./DynamicIcon"

export const DailyLifePracticeCard = ({ prac }:
  { prac: DailyPractice }) => {


  return <div className="bg-[#14102b]/60 backdrop-blur-md p-5 rounded-xl 
  border border-amber-500/20 hover:border-amber-500/40 transition-all flex flex-col 
  justify-between space-y-3">
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
          <DynamicIcon name={prac.icon} className="w-4 h-4" />
        </div>
        <h4 className="font-serif font-bold text-amber-100 text-base">{prac.title}</h4>
      </div>

      <div className="text-xs bg-[#0b091a]/60 p-2.5 rounded-lg border border-slate-800">
        <span className="text-amber-400 font-semibold block mb-0.5">Situation:</span>
        <span className="text-slate-300">{prac.situation}</span>
      </div>

      <div className="text-xs text-slate-200 leading-relaxed">
        <span className="text-amber-300 font-semibold block mb-0.5">Praxis:</span>
        {prac.practice}
      </div>
    </div>

    {prac.quote && (
      <p className="italic text-xs text-slate-400 border-t border-slate-800 pt-2 font-serif">
        "{prac.quote}"
      </p>
    )}
  </div>
}