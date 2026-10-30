import { useState, useEffect, useMemo } from 'react';


import { SUTRA } from './model/Sutra';
import { INITIAL_SUTRAS_DATA } from './data/InitialData';
import { MeditationTool } from './ui/components/MeditationTool';
import { DailyLifePractice } from './ui/components/DailyLivePratcices';
import { TranslationAndCommentary } from './ui/components/TranslationAndCommentary';
import { VocabularyBreakdownGrid } from './ui/components/VocabularyBreakdownGrid';
import { OriginalSanskrit } from './ui/components/OriginalSanskrit';
import { Header } from './ui/components/Header';
import { SlideNavigation } from './ui/components/SlideNavigation';
import { hasDynamicIcon } from './ui/components/DynamicIcon';



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


function debugDynamicIcons(sutras: SUTRA[]){
  console.log(new Set(
    sutras.flatMap(s => s.dailyPractices)
    .map(p => p.icon.replaceAll('-', '').toLowerCase())
    .filter(icon => !hasDynamicIcon(icon))
    .sort()
  ))
}

const KEY_ACTIVE_SUTRA_ID = 'tantra_sutras_explorer.active_sutra_id';
const KEY_ACTIVE_SLIDE = 'tantra_sutras_explorer.active_slide';
export const KEY_ACTIVE_RANDOM_PRACTICE = 'tantra_sutras_explorer.active_random_practice';

function App() {
  // Application States
  const sutras = useMemo(() => INITIAL_SUTRAS_DATA, []);

  //debugDynamicIcons(sutras);
  
  const [activeSutraId, setActiveSutraId] = useState(() => {
    let initId = sutras[Math.ceil(Math.random() * sutras?.length-1)].id;
    return localStorage.getItem(KEY_ACTIVE_SUTRA_ID) || initId;
  });

  const [activeSlide, setActiveSlide] = useState(() => 
    Number(localStorage.getItem(KEY_ACTIVE_SLIDE)) || 1
  );

  // Active Sutra Object
  const currentSutra = sutras.find(s => s.id === activeSutraId) || sutras[0];

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem(KEY_ACTIVE_SUTRA_ID, activeSutraId);
  }, [activeSutraId]);

  useEffect(() => {
    localStorage.setItem(KEY_ACTIVE_SLIDE, activeSlide.toString());
  }, [activeSlide]);

  useEffect(() => {
    initParticles();
  }, []);

  // Reset slide when switching sutra
  const handleSelectSutra = (id: string) => {
    setActiveSutraId(id);
    setActiveSlide(1);
  };

  return (
    <div className="min-h-screen bg-[#0b091a] text-slate-100 font-sans flex flex-col 
    justify-between relative overflow-x-hidden">
      <canvas id="canvas-particles" className="absolute inset-0 z-0 pointer-events-none opacity-40"></canvas>

      {/* Background Ambient Glows */}
      <div className="fixed top-1/2 left-1/2 w-96 h-96 bg-purple-900/15 rounded-full blur-3xl 
      pointer-events-none animate-pulse"></div>
      <div className="fixed bottom-1/2 right-1/2 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl
       pointer-events-none animate-pulse" style={{ animationDuration: '6s' }}></div>

      <Header 
        sutras={sutras}
        activeSutraId={activeSutraId}
        handleSelectSutra={(id) => handleSelectSutra(id)}
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

    </div>
  );
}




export default App;
