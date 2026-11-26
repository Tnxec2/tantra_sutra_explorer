import { useEffect, useState } from "react";
import { CircleHelp, X } from "lucide-react";

export function TimerSettingsHelp() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.stopImmediatePropagation();
                setIsOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown, true);
        return () => window.removeEventListener("keydown", handleKeyDown, true);
    }, [isOpen]);

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                aria-label="Hilfe zu den Timer-Einstellungen öffnen"
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs text-slate-400 
                transition hover:bg-white/10 hover:text-amber-100"
            >
                <CircleHelp className="h-4 w-4" />
                Hilfe
            </button>
            {isOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 
                p-4 backdrop-blur-sm">
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="timer-settings-help-title"
                        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-amber-500/30 bg-[#14102b] shadow-2xl"
                    >
                        <header className="flex items-center justify-between gap-4 border-b border-amber-500/20 bg-[#1b1537] p-4 sm:p-5">
                            <div>
                                <h2 id="timer-settings-help-title" className="font-serif text-lg font-bold text-amber-100">
                                    Hilfe zu den Timer-Einstellungen
                                </h2>
                                <p className="mt-1 text-xs text-slate-400">So gestaltest du den Ablauf deiner Meditation.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                aria-label="Hilfe schließen"
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-slate-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </header>

                        <div className="space-y-5 overflow-y-auto p-5 text-sm leading-relaxed text-slate-300 sm:p-6">
                            <section className="space-y-2">
                                <h3 className="font-semibold text-amber-100">Grundlegender Ablauf</h3>
                                <p>
                                    Vergib einen Namen, lege Dauer und Startpause fest und wähle Beginn- und End-Sound.
                                    Die Startpause gibt dir Zeit, anzukommen; die Meditationsdauer beginnt danach.
                                </p>
                                <p>
                                    Änderungen werden automatisch lokal im Browserspeicher gespeichert.
                                </p>
                                <p>
                                    <strong>
                                        Achtung! Wenn du Browserdaten bzw. Seitendaten löschst, werden auch alle Timers gelöscht.
                                    </strong>
                                </p>
                            </section>

                            <section className="space-y-2">
                                <h3 className="font-semibold text-amber-100">Intervall-Sounds einstellen</h3>
                                <p>
                                    Füge beliebig viele Intervall-Sounds hinzu. Für jeden Eintrag wählst du einen Klang,
                                    den Minutenabstand und ob er wiederholt wird. Der Abstand zählt ab Beginn der Meditation:
                                    Bei 5 Minuten erklingt der Sound erstmals nach 5 Minuten.
                                </p>
                                <p>
                                    Ist „Wiederholen“ aktiviert, erklingt er danach in diesem Abstand erneut. Ist es
                                    deaktiviert, kommt er nur beim ersten Erreichen des Abstands.
                                </p>
                            </section>

                            <section className="space-y-2">
                                <h3 className="font-semibold text-amber-100">Warum verschiedene Klänge?</h3>
                                <p>
                                    Unterschiedliche Klänge können einzelne Momente der Praxis erkennbar machen, ohne dass
                                    du auf die Uhr schauen musst. Ein sanfter Ton kann zum Beispiel einen frühen Check-in
                                    markieren, ein anderer später eine neue Phase oder das nahende Ende. So entsteht eine
                                    dezente zeitliche Orientierung, und wiederkehrende Signale klingen weniger eintönig.
                                </p>
                                <p>
                                    Du kannst die Abstände auf deine Praxis abstimmen: etwa einen einmaligen Hinweis nach
                                    einigen Minuten und einen anderen Klang, der dich in größeren Abständen begleitet.
                                    Weniger Signale sind ebenfalls möglich – entferne dafür einfach nicht benötigte Einträge.
                                </p>
                            </section>

                            <section className="space-y-2">
                                <h3 className="font-semibold text-amber-100">Priorität bei gleichzeitig fälligen Sounds</h3>
                                <p>
                                    Wenn mehrere Sounds zum selben Zeitpunkt fällig sind, wird nur der Eintrag mit dem
                                    höchsten Index abgespielt – also der, der in der Liste am weitesten unten steht.
                                    Verschiebe Einträge mit den Pfeilen, um die Priorität festzulegen.
                                </p>
                            </section>

                            <section className="space-y-2">
                                <h3 className="font-semibold text-amber-100">Hintergrundmusik</h3>
                                <p>
                                    Wähle optional eine Musik aus. Sie läuft während der Meditation im Hintergrund und
                                    wird beim Zurücksetzen oder Beenden des Timers gestoppt.
                                </p>
                            </section>
                        </div>

                        <footer className="flex justify-end border-t border-white/10 p-4">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="rounded-xl bg-gradient-to-r from-amber-300 to-amber-500 px-4 py-2.5 text-sm font-semibold text-[#241b18] transition hover:brightness-110"
                            >
                                Verstanden
                            </button>
                        </footer>
                    </section>
                </div>
            )}
        </>
    );
}
