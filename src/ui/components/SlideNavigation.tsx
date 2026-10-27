import { Activity, BookOpen, FileText, LucideIcon, Sliders } from "lucide-react";

const tabs: { id: number; label: string; mobileLabel: string; icon: LucideIcon }[] = [
    { id: 1, label: "1. Original & Sanskrit", mobileLabel: "Original", icon: BookOpen },
    { id: 2, label: "2. Übersetzung", mobileLabel: "Übersetzung", icon: FileText },
    { id: 3, label: "3. Alltags-Praxis", mobileLabel: "Praxis", icon: Sliders },
    { id: 4, label: "4. Meditation", mobileLabel: "Meditation", icon: Activity }
];

export const SlideNavigation = ({ activeSlide, setActiveSlide }:
    { activeSlide: number, setActiveSlide: (id: number) => void }) => (
    <nav aria-label="Inhaltsabschnitte" className="flex justify-center mb-6">
        <div className="grid grid-cols-2 gap-1 w-full max-w-sm p-1 rounded-xl bg-[#14102b]/80 border border-amber-500/15 backdrop-blur-md sm:inline-flex sm:w-auto sm:max-w-full">
            {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeSlide === tab.id;
                return (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveSlide(tab.id)}
                        aria-pressed={isActive}
                        className={`flex min-h-11 items-center justify-center gap-2 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 ${isActive
                            ? 'bg-gradient-to-r from-amber-600/30 to-amber-500/20 text-amber-200 border border-amber-500/40 shadow-lg'
                            : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <span className="sm:hidden">{tab.mobileLabel}</span>
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                );
            })}
        </div>
    </nav>
);