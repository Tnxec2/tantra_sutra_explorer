import { Activity, BookOpen, FileText, LucideIcon, Sliders } from "lucide-react";


export const SlideNavigation = ({ activeSlide, setActiveSlide }:
    { activeSlide: number, setActiveSlide: (id: number) => void }) => {


    return <div className="flex justify-center mb-6">
        <div className="inline-flex p-1 rounded-xl bg-[#14102b]/80 border border-amber-500/15 backdrop-blur-md overflow-x-auto max-w-full">
            {[
                { id: 1, label: "1. Original & Sanskrit", icon: BookOpen },
                { id: 2, label: "2. Übersetzung", icon: FileText },
                { id: 3, label: "3. Alltags-Praxis", icon: Sliders },
                { id: 4, label: "4. Meditation", icon: Activity }
            ].map(tab => {
                const Icon: LucideIcon = tab.icon;
                const isActive = activeSlide === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSlide(tab.id)}
                        className={`flex items-center space-x-2 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${isActive
                            ? 'bg-gradient-to-r from-amber-600/30 to-amber-500/20 text-amber-200 border border-amber-500/40 shadow-lg'
                            : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                    </button>
                );
            })}
        </div>
    </div>
}