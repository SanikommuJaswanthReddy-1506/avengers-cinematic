import { useState, useEffect, useRef } from 'react';
import IntroAnimation from './components/IntroAnimation';
import MainSite from './pages/MainSite';

export default function App() {
  const [introComplete, setIntroComplete] = useState(false);
  const [showMain, setShowMain] = useState(false);

  const handleIntroComplete = () => {
    setIntroComplete(true);
    setTimeout(() => setShowMain(true), 100);
  };

  return (
    <>
      {!introComplete && (
        <IntroAnimation onComplete={handleIntroComplete} />
      )}
      {showMain && (
        <div style={{ animation: 'fadeInApp 0.8s ease forwards' }}>
          <MainSite />
        </div>
      )}
      <style>{`
        @keyframes fadeInApp {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        /* Override any custom cursor — use default */
        *, *::before, *::after { cursor: default !important; }
        button, a, [role="button"] { cursor: pointer !important; }
      `}</style>
    </>
  );
}
