import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import {
  playIronManSound, playCapSound, playThorSound,
  playHulkSound, playWidowSound, playAssembleSound,
  setMuted,
} from './SoundManager';

const INTRO_HEROES = [
  { id: 'ironman',    name: 'Iron Man',        quote: 'I AM IRON MAN',            color: '#c0392b', accent: '#f39c12', img: '/ironman.png',     sound: playIronManSound },
  { id: 'cap',        name: 'Captain America', quote: 'TILL THE END OF THE LINE', color: '#1a6fc4', accent: '#e8e8ff', img: '/cap.png',         sound: playCapSound },
  { id: 'thor',       name: 'Thor',            quote: 'BRING ME THANOS',          color: '#f0c040', accent: '#3498db', img: '/thor.png',        sound: playThorSound },
  { id: 'hulk',       name: 'The Hulk',        quote: 'HULK... SMASH',            color: '#27ae60', accent: '#2ecc71', img: '/hulk.png',        sound: playHulkSound },
  { id: 'blackwidow', name: 'Black Widow',     quote: 'WHATEVER IT TAKES',        color: '#e74c3c', accent: '#c0392b', img: '/blackwidow.png',  sound: playWidowSound },
];

export default function IntroAnimation({ onComplete }) {
  const overlayRef   = useRef(null);
  const canvasRef    = useRef(null);
  const tlRef        = useRef(null);
  const animRef      = useRef(null);
  const heroColorRef = useRef('#d4af37');

  const [activeIdx,  setActiveIdx]  = useState(-1);   // which hero is currently shown
  const [showLogo,   setShowLogo]   = useState(false);
  const [showEnter,  setShowEnter]  = useState(false);
  const [shaking,    setShaking]    = useState(false);
  const [mutedState, setMutedState] = useState(false);

  /* ── Canvas particles ──────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const pts = Array.from({ length: 180 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      a: Math.random() * 0.5 + 0.2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const col = heroColorRef.current;
      pts.forEach(p => {
        p.x = (p.x + p.vx + canvas.width)  % canvas.width;
        p.y = (p.y + p.vy + canvas.height) % canvas.height;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = col + Math.floor(p.a * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize); };
  }, []);

  /* ── GSAP Timeline ─────────────────────────────────────── */
  useEffect(() => {
    const tl = gsap.timeline();
    tlRef.current = tl;

    // Scene 0 — opening flash
    tl.set(overlayRef.current, { opacity: 1 });
    tl.fromTo('#if-flash', { opacity: 0 }, { opacity: 0.6, duration: 0.08, yoyo: true, repeat: 3, ease: 'none' });
    tl.to('#if-orb', { scale: 1, opacity: 1, duration: 0.9, ease: 'expo.out' });

    // Scene 1 — hero reveals (one at a time)
    INTRO_HEROES.forEach((hero, i) => {
      tl.call(() => {
        setActiveIdx(i);
        heroColorRef.current = hero.color;
        hero.sound();
        if (hero.id === 'hulk') { setShaking(true); setTimeout(() => setShaking(false), 600); }
      });

      // color splash
      tl.to('#if-flash', { background: hero.color, opacity: 0.18, duration: 0.08 });
      tl.to('#if-flash', { opacity: 0, duration: 0.2 });

      // img slides in
      tl.fromTo(`#ih-img-${i}`,
        { x: i % 2 === 0 ? -140 : 140, opacity: 0, scale: 0.9 },
        { x: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.3)' }, '<0.05'
      );

      // name slams
      tl.fromTo(`#ih-name-${i}`,
        { y: 80, opacity: 0, skewX: -8, scaleY: 0.5 },
        { y: 0, opacity: 1, skewX: 0, scaleY: 1, duration: 0.5, ease: 'expo.out' }, '<0.12'
      );

      // quote
      tl.fromTo(`#ih-quote-${i}`,
        { opacity: 0, x: i % 2 === 0 ? -20 : 20 },
        { opacity: 1, x: 0, duration: 0.4 }, '<0.15'
      );

      // underline sweep
      tl.fromTo(`#ih-line-${i}`,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.45, transformOrigin: i % 2 === 0 ? 'left' : 'right' }, '<0.1'
      );

      // hold 1.1s then fade out
      tl.to(`#ih-img-${i}`,   { opacity: 0, x: i % 2 === 0 ? -60 : 60, duration: 0.3, ease: 'power2.in' }, '+=1.0');
      tl.to(`#ih-name-${i}`,  { opacity: 0, y: -40, duration: 0.25, ease: 'power2.in' }, '<0.05');
      tl.to(`#ih-quote-${i}`, { opacity: 0, duration: 0.2 }, '<');
      tl.to(`#ih-line-${i}`,  { opacity: 0, duration: 0.2 }, '<');

      tl.call(() => setActiveIdx(-1), [], '<0.28');
    });

    // Scene 2 — merge
    heroColorRef.current = '#d4af37';
    tl.to('#if-orb', { scale: 10, opacity: 0.8, duration: 0.6, ease: 'power4.in' });
    tl.to('#if-wflash', { opacity: 1, duration: 0.12 });
    tl.to('#if-wflash', { opacity: 0, duration: 0.45 });
    tl.set('#if-orb', { scale: 0, opacity: 0 });

    // Scene 3 — logo
    tl.call(() => { setShowLogo(true); playAssembleSound(); });
    tl.fromTo('.il-letter', { y: -90, opacity: 0, rotateX: 90 },
      { y: 0, opacity: 1, rotateX: 0, duration: 0.65, stagger: 0.055, ease: 'back.out(1.7)' }, '<0.1'
    );
    tl.fromTo('#il-line',  { scaleX: 0 }, { scaleX: 1, duration: 0.7, transformOrigin: 'center' }, '<0.3');
    tl.fromTo('#il-sub',   { opacity: 0, letterSpacing: '2em', y: 16 },
      { opacity: 1, letterSpacing: '0.5em', y: 0, duration: 0.9 }, '<0.2'
    );
    tl.fromTo('#il-enter', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, '<0.5');
    tl.call(() => setShowEnter(true));

    return () => tlRef.current?.kill();
  }, []);

  const skip = () => {
    tlRef.current?.kill();
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.5, onComplete: onComplete });
  };

  const toggleMute = () => {
    const n = !mutedState;
    setMuted(n);
    setMutedState(n);
  };

  return (
    <div
      id="intro-overlay"
      ref={overlayRef}
      className={shaking ? 'screen-shake' : ''}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#000', overflow: 'hidden' }}
    >
      {/* canvas */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }} />

      {/* flash overlay */}
      <div id="if-flash" style={{ position: 'absolute', inset: 0, opacity: 0, zIndex: 2, background: '#c0392b', pointerEvents: 'none', mixBlendMode: 'screen' }} />

      {/* white burst */}
      <div id="if-wflash" style={{
        position: 'absolute', inset: 0, opacity: 0, zIndex: 4, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, #fff 0%, rgba(255,255,255,0.5) 40%, transparent 70%)',
      }} />

      {/* central orb */}
      <div id="if-orb" style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%) scale(0)',
        width: 160, height: 160, borderRadius: '50%', opacity: 0,
        background: 'radial-gradient(ellipse, rgba(212,175,55,0.85) 0%, rgba(212,175,55,0.2) 50%, transparent 70%)',
        filter: 'blur(16px)', pointerEvents: 'none', zIndex: 3,
      }} />

      {/* ── Hero Slides — only ONE visible at a time via activeIdx ── */}
      {INTRO_HEROES.map((hero, i) => {
        const fromLeft = i % 2 === 0;
        const isActive = activeIdx === i;
        return (
          <div key={hero.id} style={{
            position: 'absolute', inset: 0, zIndex: 10,
            display: isActive ? 'flex' : 'none',   // <-- KEY FIX: hidden when not active
            alignItems: 'center',
            justifyContent: fromLeft ? 'flex-start' : 'flex-end',
            padding: '0 clamp(30px, 7vw, 120px)',
            gap: 'clamp(20px, 4vw, 60px)',
          }}>
            {fromLeft ? (
              <>
                {/* Image left */}
                <div id={`ih-img-${i}`} style={{ opacity: 0, flexShrink: 0, width: 'clamp(180px, 28vw, 380px)', position: 'relative' }}>
                  <img src={hero.img} alt={hero.name} style={{
                    width: '100%', height: 'auto', maxHeight: '72vh',
                    objectFit: 'cover', objectPosition: 'center top', borderRadius: 12,
                    filter: `drop-shadow(0 0 40px ${hero.color}) drop-shadow(0 0 80px ${hero.color}60)`,
                  }} />
                </div>
                {/* Text right */}
                <div style={{ maxWidth: 500 }}>
                  <p style={{ fontSize: '0.7rem', letterSpacing: '0.45em', color: hero.accent, marginBottom: 8, fontFamily: "'Rajdhani',sans-serif", opacity: 0.7 }}>
                    ORIGINAL AVENGER
                  </p>
                  <div id={`ih-name-${i}`} style={{
                    fontFamily: "'Bebas Neue',cursive", fontSize: 'clamp(3rem, 8vw, 7rem)',
                    lineHeight: 1, letterSpacing: '0.06em', color: hero.color, opacity: 0,
                    textShadow: `0 0 40px ${hero.color}, 0 0 80px ${hero.color}60`,
                  }}>{hero.name}</div>
                  <div id={`ih-line-${i}`} style={{
                    height: 3, marginTop: 10, marginBottom: 14, borderRadius: 2, opacity: 0,
                    background: `linear-gradient(90deg, ${hero.color}, ${hero.accent}, transparent)`,
                    boxShadow: `0 0 10px ${hero.color}`,
                  }} />
                  <div id={`ih-quote-${i}`} style={{
                    fontFamily: "'Bebas Neue',cursive", fontSize: 'clamp(0.9rem, 2.2vw, 1.5rem)',
                    letterSpacing: '0.25em', color: 'rgba(255,255,255,0.5)', opacity: 0,
                  }}>"{hero.quote}"</div>
                </div>
              </>
            ) : (
              <>
                {/* Text left (mirrored) */}
                <div style={{ maxWidth: 500, textAlign: 'right' }}>
                  <p style={{ fontSize: '0.7rem', letterSpacing: '0.45em', color: hero.accent, marginBottom: 8, fontFamily: "'Rajdhani',sans-serif", opacity: 0.7 }}>
                    AVENGER
                  </p>
                  <div id={`ih-name-${i}`} style={{
                    fontFamily: "'Bebas Neue',cursive", fontSize: 'clamp(3rem, 8vw, 7rem)',
                    lineHeight: 1, letterSpacing: '0.06em', color: hero.color, opacity: 0,
                    textShadow: `0 0 40px ${hero.color}, 0 0 80px ${hero.color}60`,
                  }}>{hero.name}</div>
                  <div id={`ih-line-${i}`} style={{
                    height: 3, marginTop: 10, marginBottom: 14, borderRadius: 2, opacity: 0,
                    background: `linear-gradient(270deg, ${hero.color}, ${hero.accent}, transparent)`,
                    boxShadow: `0 0 10px ${hero.color}`,
                  }} />
                  <div id={`ih-quote-${i}`} style={{
                    fontFamily: "'Bebas Neue',cursive", fontSize: 'clamp(0.9rem, 2.2vw, 1.5rem)',
                    letterSpacing: '0.25em', color: 'rgba(255,255,255,0.5)', opacity: 0,
                  }}>"{hero.quote}"</div>
                </div>
                {/* Image right */}
                <div id={`ih-img-${i}`} style={{ opacity: 0, flexShrink: 0, width: 'clamp(180px, 28vw, 380px)', position: 'relative' }}>
                  <img src={hero.img} alt={hero.name} style={{
                    width: '100%', height: 'auto', maxHeight: '72vh',
                    objectFit: 'cover', objectPosition: 'center top', borderRadius: 12,
                    filter: `drop-shadow(0 0 40px ${hero.color}) drop-shadow(0 0 80px ${hero.color}60)`,
                  }} />
                </div>
              </>
            )}
          </div>
        );
      })}

      {/* ── Logo scene ──────────────────────────────────────── */}
      {showLogo && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 20,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center',
        }}>
          {/* AVENGERS letters */}
          <div style={{ display: 'flex', perspective: 800 }}>
            {'AVENGERS'.split('').map((ch, i) => (
              <span key={i} className="il-letter" style={{
                fontFamily: "'Bebas Neue',cursive",
                fontSize: 'clamp(4rem, 13vw, 10rem)',
                letterSpacing: '0.06em', display: 'inline-block', opacity: 0,
                background: 'linear-gradient(180deg,#fff9e0 0%,#d4af37 45%,#b8860b 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                filter: 'drop-shadow(0 0 18px rgba(212,175,55,0.7))',
              }}>{ch}</span>
            ))}
          </div>

          <div id="il-line" style={{
            width: 'clamp(160px,38vw,480px)', height: 2, marginTop: 6, marginBottom: 18,
            background: 'linear-gradient(90deg,transparent,#d4af37,#fff,#d4af37,transparent)',
            boxShadow: '0 0 16px #d4af37, 0 0 40px rgba(212,175,55,0.3)',
            transformOrigin: 'center', scaleX: 0,
          }} />

          <div id="il-sub" style={{
            fontFamily: "'Bebas Neue',cursive",
            fontSize: 'clamp(1rem, 3.5vw, 2.5rem)',
            letterSpacing: '0.5em', color: 'rgba(212,175,55,0.72)', opacity: 0,
            textShadow: '0 0 24px rgba(212,175,55,0.4)',
          }}>ASSEMBLE</div>

          {/* Hero avatar row */}
          <div style={{ display: 'flex', gap: 'clamp(8px,2vw,18px)', margin: '28px 0 32px' }}>
            {INTRO_HEROES.map(h => (
              <div key={h.id} style={{
                width: 'clamp(44px,5.5vw,66px)', height: 'clamp(44px,5.5vw,66px)',
                borderRadius: '50%', overflow: 'hidden',
                border: `2px solid ${h.color}90`,
                boxShadow: `0 0 14px ${h.color}60`,
              }}>
                <img src={h.img} alt={h.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
              </div>
            ))}
          </div>

          <div id="il-enter" style={{ opacity: 0 }}>
            <button className="enter-btn" onClick={onComplete} style={{ cursor: 'pointer' }}>
              <span>ENTER THE EXPERIENCE</span>
            </button>
          </div>
        </div>
      )}

      {/* HUD */}
      <div style={{ position: 'absolute', top: 20, right: 22, zIndex: 100, display: 'flex', gap: 10 }}>
        <button className="skip-btn" onClick={toggleMute} style={{ cursor: 'pointer' }}>{mutedState ? '🔇 UNMUTE' : '🔊 MUTE'}</button>
        <button className="skip-btn" onClick={skip}       style={{ cursor: 'pointer' }}>SKIP ›</button>
      </div>

      {/* Progress dots */}
      {activeIdx >= 0 && (
        <div style={{ position: 'absolute', bottom: 26, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 100 }}>
          {INTRO_HEROES.map((h, i) => (
            <div key={h.id} style={{
              width: i === activeIdx ? 26 : 8, height: 8, borderRadius: 4,
              background: i === activeIdx ? h.color : 'rgba(255,255,255,0.18)',
              boxShadow: i === activeIdx ? `0 0 10px ${h.color}` : 'none',
              transition: 'all 0.35s ease',
            }} />
          ))}
        </div>
      )}
    </div>
  );
}
