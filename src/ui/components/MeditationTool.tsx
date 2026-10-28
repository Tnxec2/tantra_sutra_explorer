

// ==========================================
// INTERACTIVE MEDITATION TOOL COMPONENT

import { useEffect, useRef, useState } from "react";
import { MeditationConfig } from "../../model/MeditationConfig";
import { Pause, Play } from "lucide-react";

// ==========================================
export function MeditationTool({ config }: { config: MeditationConfig}) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('idle'); // 'inhale' | 'hold' | 'exhale' | 'idle'
  const [timerText, setTimerText] = useState("Bereit?");
  const [remainingTimeProgress, setRemainingTimeProgress] = useState(1);

  const [instructionText, setInstructionText] = useState(config?.instruction || "Starte die Meditationspraxis.");

  const configRef = useRef(config);
  configRef.current = config;

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let intervalId: ReturnType<typeof setInterval> | undefined;

    if (isActive) {
      const runPhase = (phaseIndex: number) => {
        const c = configRef.current || {};
        const phaseDetails = [
          { phase: 'inhale', fallbackName: "Einatmen...", fallbackInstruction: "Sammle Gewahrsein und Energie..." },
          { phase: 'hold', fallbackName: "DIE LÜCKE", fallbackInstruction: "Verweile vollkommen still im unberührten Raum." },
          { phase: 'exhale', fallbackName: "Ausatmen...", fallbackInstruction: "Lass das Konzept los, das reine Bewusstsein bleibt." },
          { phase: 'hold', fallbackName: "DIE LÜCKE...", fallbackInstruction: "Verweile vollkommen still im unberührten Raum." },
        ];
        const details = phaseDetails[phaseIndex];
        const duration = Math.max(1, (c.phases[phaseIndex]?.duration || 4) * 1000);
        const startTime = Date.now();

        setPhase(details.phase);
        setTimerText(c.phases[phaseIndex]?.name || details.fallbackName);
        setInstructionText(c.phases[phaseIndex]?.instruction || details.fallbackInstruction);
        setRemainingTimeProgress(1);

        intervalId = setInterval(() => {
          setRemainingTimeProgress(Math.max(0, 1 - (Date.now() - startTime) / duration));
        }, 50);

        timeoutId = setTimeout(() => {
          clearInterval(intervalId);
          const nextPhaseIndex = phaseIndex + 1;
          if (nextPhaseIndex < phaseDetails.length) {
            runPhase(nextPhaseIndex);
          } else if (c.type === "breath") {
            runPhase(0);
          } else {
            setIsActive(false);
          }
        }, duration);
      };

      runPhase(0);
    } else {
      setPhase('idle');
      setTimerText("Bereit?");
      setRemainingTimeProgress(1);
      setInstructionText(config?.instruction || "Klicke auf Start für die geführte Meditationssequenz.");
    }

    return () => {
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      if (intervalId !== undefined) clearInterval(intervalId);
    };
  }, [isActive, config]);

  // Dynamic Scale and Glow classes
  const getCircleStyles = () => {
    switch (phase) {
      case 'inhale':
        return 'scale-125 border-amber-400/80 shadow-[0_0_50px_rgba(251,191,36,0.4)]';
      case 'hold':
        return 'scale-125 border-white shadow-[0_0_70px_rgba(255,255,255,0.7)]';
      case 'exhale':
        return 'scale-100 border-amber-500/30 shadow-none';
      default:
        return 'scale-100 border-amber-500/40';
    }
  };

  return (
    <div className="bg-[#14102b]/70 backdrop-blur-md rounded-2xl p-6 md:p-8 border
    border-amber-500/20 text-center flex flex-col items-center justify-center space-y-6 my-auto
    animate-fadeIn">
      <div className="space-y-1">
        <h3 className="text-xl md:text-2xl font-serif font-bold text-amber-100">
          {config?.title || "Meditations-Übung"}</h3>
        <p className="text-xs text-amber-400/80">Fokussierte Praxis zur Sutra</p>
      </div>

      {/* Interactive Animated Circle */}
      <div className="relative flex items-center justify-center my-4">
        <div className={`w-48 h-48 md:w-64 md:h-64 rounded-full border-2 transition-all duration-1000
           relative flex flex-col items-center justify-center p-4 bg-[#0b091a]/80 backdrop-blur-sm
           ${getCircleStyles()}`}>
          <svg
            className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            <circle
              cx="50"
              cy="50"
              r="48.5"
              fill="none"
              stroke="rgba(251, 191, 36, 0.15)"
              strokeWidth="1.5"
            />
            <circle
              cx="50"
              cy="50"
              r="48.5"
              fill="none"
              stroke="rgba(251, 191, 36, 0.9)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 48.5}
              strokeDashoffset={2 * Math.PI * 48.5 * (1 - remainingTimeProgress)}
              className="transition-[stroke-dashoffset] duration-100"
            />
          </svg>
          <span className="font-serif text-lg md:text-2xl font-bold text-amber-200 mb-1">
            {timerText}
          </span>
          <span className="text-[10px] md:text-xs text-amber-400 font-mono uppercase tracking-widest">
            {phase === 'idle' ? 'Start drücken' : phase}
          </span>
        </div>
      </div>

      <p className="text-xs md:text-sm text-slate-300 max-w-lg min-h-[40px] px-4 font-light">
        {instructionText}
      </p>

      <button
        onClick={() => setIsActive(!isActive)}
        className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-500
        hover:from-amber-500 hover:to-amber-400 text-slate-950 font-semibold text-xs md:text-sm
        transition-all shadow-lg flex items-center space-x-2 cursor-pointer"
      >
        {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        <span>{isActive ? "Übung Stoppen" : "Meditation Starten"}</span>
      </button>
    </div>
  );
}