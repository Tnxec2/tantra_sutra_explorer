import { Check, Code, X } from "lucide-react"
import { useEffect, useState } from "react";


export const CustomSutraEditor = ({ initJsonText, jsonError, close, onSave }:
    { initJsonText: string, jsonError?: string, close: () => void, onSave: (jsonText: string) => void }) => {


    const [jsonText, setJsonText] = useState("");

    useEffect(() => {
        setJsonText(initJsonText);
    }, [initJsonText])

    const handleSaveJson = () => {
        onSave(jsonText);
    };

    return <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-[#14102b] border border-amber-500/30 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-amber-500/20 flex justify-between items-center bg-[#1b1537]">
                <div className="flex items-center space-x-2 text-amber-200 font-serif font-bold">
                    <Code className="w-5 h-5 text-amber-400" />
                    <span>Sutra-Datenbank Bearbeiten (JSON)</span>
                </div>
                <button
                    onClick={() => close()}
                    className="text-slate-400 hover:text-slate-200 p-1"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-3">
                <p className="text-xs text-slate-300">
                    Füge hier neue Sutren hinzu oder bearbeite das JSON-Array. Das Format erlaubt beliebig viele Sutren.
                </p>

                {jsonError && (
                    <div className="p-3 bg-red-900/40 border border-red-500/50 rounded-lg text-red-200 text-xs font-mono">
                        Fehler: {jsonError}
                    </div>
                )}

                <textarea
                    value={jsonText}
                    onChange={(e) => setJsonText(e.target.value)}
                    className="w-full h-80 bg-[#0b091a] text-amber-100 font-mono text-xs p-3 rounded-lg border border-amber-500/20 focus:outline-none focus:border-amber-400"
                />
            </div>

            <div className="p-4 border-t border-amber-500/20 flex justify-end space-x-3 bg-[#1b1537]">
                <button
                    onClick={() => close()}
                    className="px-4 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800"
                >
                    Abbrechen
                </button>
                <button
                    onClick={handleSaveJson}
                    className="px-5 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-600 to-amber-500 text-slate-900 hover:brightness-110 flex items-center space-x-1.5"
                >
                    <Check className="w-4 h-4" />
                    <span>Änderungen Übernehmen</span>
                </button>
            </div>
        </div>
    </div>
}