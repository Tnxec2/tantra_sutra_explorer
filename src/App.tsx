import { useState, useEffect, useMemo } from 'react';

import {
  Sparkles,
  BookOpen,
  Code,
  Activity,
  FileText,
  Sliders
} from 'lucide-react';

import { SUTRA } from './model/Sutra';
import { INITIAL_SUTRAS_DATA } from './data/InitialData';
import { CustomSutraEditor } from './ui/components/CustomSutraEditor';
import { MeditationTool } from './ui/components/MeditationTool';
import { Footer } from './ui/components/Footer';
import { DailyLifePractice } from './ui/components/DailyLivePratcices';
import { TranslationAndCommentary } from './ui/components/TranslationAndCommentary';
import { VocabularyBreakdownGrid } from './ui/components/VocabularyBreakdownGrid';
import { OriginalSanskrit } from './ui/components/OriginalSanskrit';
import { Header } from './ui/components/Header';
import { SlideNavigation } from './ui/components/SlideNavigation';


// Background Particles Animation
function initParticles() {
  const canvas = document.getElementById('canvas-particles') as HTMLCanvasElement;
  if (canvas == null) return;

  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = Array.from({ length: 45 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2 + 0.5,
    alpha: Math.random() * 0.5 + 0.2,
    speedY: -Math.random() * 0.3 - 0.1,
    speedX: (Math.random() - 0.5) * 0.2
  }));

  function animate() {

    if (ctx == null) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;

      if (p.y < 0) p.y = canvas.height;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#d4af37';
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }
  animate();
}

function App() {
  // Application States
  const [sutras, setSutras] = useState<SUTRA[]>(() => {
    const saved = undefined; // localStorage.getItem('tantra_sutras_data');
    return saved ? JSON.parse(saved) : INITIAL_SUTRAS_DATA;
  });

  const initId = useMemo(() => (Math.ceil(Math.random() * sutras?.length-1)), [])
  console.log(initId, sutras[initId]?.id);
  
  const [activeSutraId, setActiveSutraId] = useState(sutras[initId]?.id);
  const [activeSlide, setActiveSlide] = useState(1);
  const [showJsonEditor, setShowJsonEditor] = useState(false);
  const [jsonText, setJsonText] = useState("");
  const [jsonError, setJsonError] = useState<string | undefined>("");

  // Audio state simulation
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Active Sutra Object
  const currentSutra = sutras.find(s => s.id === activeSutraId) || sutras[0];

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('tantra_sutras_data', JSON.stringify(sutras));
  }, [sutras]);

  useEffect(() => {
    initParticles();
  }, []);

  // Reset slide when switching sutra
  const handleSelectSutra = (id: string) => {
    setActiveSutraId(id);
    setActiveSlide(1);
    setIsPlayingAudio(false);
  };

  // JSON Editor Handlers
  const handleOpenEditor = () => {
    setJsonText(JSON.stringify(sutras, null, 2));
    setJsonError("");
    setShowJsonEditor(true);
  };

  const handleSaveJson = (jsonTextToSave: string) => {
    try {
      const parsed = JSON.parse(jsonTextToSave);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error("Das JSON muss ein Array mit mindestens einer Sutra enthalten.");
      }
      setJsonText("");
      setSutras(parsed);
      setActiveSutraId(parsed[0].id);
      setShowJsonEditor(false);
      setJsonError("");
    } catch (err: any) {
      setJsonError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b091a] text-slate-100 font-sans flex flex-col 
    justify-between relative overflow-x-hidden">
      <canvas id="canvas-particles" className="absolute inset-0 z-0 pointer-events-none opacity-40"></canvas>

      {/* Background Ambient Glows */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-purple-900/15 rounded-full blur-3xl 
      pointer-events-none animate-pulse"></div>
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl
       pointer-events-none animate-pulse" style={{ animationDuration: '6s' }}></div>

      <Header 
        sutras={sutras}
        activeSutraId={activeSutraId}
        handleSelectSutra={(id) => setActiveSutraId(id)}
        handleOpenEditor={() => handleOpenEditor() }
      />

      {/* MAIN CONTAINER */}
      <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto px-4 md:px-6 py-6 flex 
      flex-col justify-center">

        {/* SUBHEADER / METADATA */}
        <div className="text-center mb-6 space-y-1">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border 
          border-amber-500/20 text-amber-300 text-xs font-semibold tracking-widest uppercase">
            {currentSutra.chapter} • {currentSutra.verseNum}
          </span>
          <h2 className="text-2xl md:text-4xl font-serif font-bold text-slate-100">
            {currentSutra.title}
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto italic">
            {currentSutra.subtitle}
          </p>
        </div>

        <SlideNavigation activeSlide={activeSlide} setActiveSlide={(id) => setActiveSlide(id)} />

        {/* SLIDE CONTENT AREA */}
        <div className="w-full min-h-[420px] flex flex-col justify-between">

          {activeSlide === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <OriginalSanskrit
                sanskritDevanagari={currentSutra.sanskrit}
                sanskritIAST={currentSutra.iast}
                isPlayingAudio={isPlayingAudio}
                togglePlayingAudio={() => setIsPlayingAudio(!isPlayingAudio)}
              />

              <VocabularyBreakdownGrid vocabulary={currentSutra.vocabulary} />
            </div>
          )}

          {activeSlide === 2 && <TranslationAndCommentary
            translationGerman={currentSutra.translationGerman}
            philosophicalNotes={currentSutra.philosophicalNotes} />}

          {activeSlide === 3 && <DailyLifePractice dailyPractices={currentSutra.dailyPractices} />}

          {activeSlide === 4 && <MeditationTool config={currentSutra.meditationConfig} />}

        </div>
      </main>

{/* 
      <Footer
        activeSlide={activeSlide}
        setActiveSlide={(n) => setActiveSlide(n)}
      /> */}

      {showJsonEditor && (
        <CustomSutraEditor
          close={() => setShowJsonEditor(false)}
          onSave={(jsonText) => handleSaveJson(jsonText)}
          initJsonText={jsonText}
          jsonError={jsonError}
        />
      )}
    </div>
  );
}




export default App;
