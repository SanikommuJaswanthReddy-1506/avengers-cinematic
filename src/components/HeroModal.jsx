import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function HeroModal({ hero, onClose }) {
  const overlayRef = useRef(null);
  const panelRef   = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    tl.fromTo(panelRef.current,
      { opacity: 0, y: 55, scale: 0.93 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.4)' }, '<0.08'
    );

    const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleClose = () => {
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(panelRef.current,   { opacity: 0, y: 35, scale: 0.94, duration: 0.3, ease: 'power2.in' });
    tl.to(overlayRef.current, { opacity: 0, duration: 0.2 }, '<0.08');
  };

  return (
    <div
      ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) handleClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(0,0,0,0.88)',
        backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: 0, padding: '20px',
      }}
    >
      <div
        ref={panelRef}
        style={{
          position: 'relative',
          width: '100%', maxWidth: 880,
          maxHeight: '90vh', overflowY: 'auto',
          borderRadius: 20,
          background: hero.bgGradient,
          border: `1px solid ${hero.color}50`,
          boxShadow: `0 0 80px ${hero.color}30, 0 40px 100px rgba(0,0,0,0.8)`,
          opacity: 0,
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
        }}
      >
        {/* ── Left: Portrait ──────────────────────────────── */}
        <div style={{
          position: 'relative', overflow: 'hidden',
          borderRadius: '20px 0 0 20px',
          minHeight: 480,
        }}>
          <img
            src={hero.image}
            alt={hero.name}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center top',
              display: 'block',
            }}
          />
          {/* Side gradient */}
          <div style={{
            position: 'absolute', top: 0, right: 0, bottom: 0, width: 80,
            background: `linear-gradient(to right, transparent, ${hero.bgGradient.match(/#[0-9a-fA-F]{6}/g)?.[0] || '#000'})`,
          }} />
          {/* Bottom gradient */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 100,
            background: `linear-gradient(to top, ${hero.bgGradient.match(/#[0-9a-fA-F]{6}/g)?.[0] || '#000'} 0%, transparent 100%)`,
          }} />
          {/* Color rim */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '20px 0 0 20px',
            boxShadow: `inset 0 0 30px ${hero.color}25`,
            pointerEvents: 'none',
          }} />
        </div>

        {/* ── Right: Info ─────────────────────────────────── */}
        <div style={{ padding: '36px 32px 36px 28px', display: 'flex', flexDirection: 'column', gap: 0 }}>
          {/* Top accent line */}
          <div style={{
            height: 3, width: '100%', marginBottom: 24,
            background: `linear-gradient(90deg, ${hero.color}, ${hero.secondColor}, transparent)`,
            boxShadow: `0 0 12px ${hero.color}`,
            borderRadius: 2,
          }} />

          {/* Name block */}
          <div style={{ marginBottom: 6 }}>
            <p style={{
              fontSize: '0.7rem', letterSpacing: '0.4em',
              color: 'rgba(255,255,255,0.38)',
              textTransform: 'uppercase',
              fontFamily: "'Rajdhani', sans-serif",
              marginBottom: 4,
            }}>
              {hero.team}
            </p>
            <h2 style={{
              fontFamily: "'Bebas Neue', cursive",
              fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
              letterSpacing: '0.1em', lineHeight: 1,
              color: hero.color,
              textShadow: `0 0 30px ${hero.color}70`,
            }}>
              {hero.name}
            </h2>
            <p style={{
              fontSize: '0.8rem', letterSpacing: '0.25em',
              color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase',
              fontFamily: "'Rajdhani', sans-serif",
              marginTop: 2,
            }}>
              {hero.alias}
            </p>
          </div>

          {/* Quote */}
          <p style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: '1rem', letterSpacing: '0.2em',
            color: `${hero.color}bb`,
            marginBottom: 16, marginTop: 12,
          }}>
            "{hero.tagline}"
          </p>

          {/* Divider */}
          <div style={{
            height: 1, marginBottom: 16,
            background: `linear-gradient(90deg, ${hero.color}40, transparent)`,
          }} />

          {/* Description */}
          <p style={{
            color: 'rgba(232,232,240,0.72)',
            lineHeight: 1.75, fontSize: '0.95rem',
            fontFamily: "'Rajdhani', sans-serif",
            marginBottom: 22,
            flexGrow: 1,
          }}>
            {hero.description}
          </p>

          {/* Powers */}
          <div>
            <p style={{
              fontSize: '0.7rem', letterSpacing: '0.35em',
              color: 'rgba(255,255,255,0.3)',
              marginBottom: 10,
              fontFamily: "'Bebas Neue', cursive",
            }}>
              ABILITIES & POWERS
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {hero.powers.map(p => (
                <span key={p} style={{
                  padding: '5px 14px', borderRadius: 24,
                  background: `${hero.color}18`,
                  border: `1px solid ${hero.color}45`,
                  color: hero.color,
                  fontSize: '0.78rem', letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 600,
                }}>
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Close */}
          <button
            onClick={handleClose}
            style={{
              marginTop: 28, alignSelf: 'flex-start',
              padding: '8px 24px',
              border: `1px solid ${hero.color}50`,
              background: `${hero.color}15`,
              color: hero.color,
              borderRadius: 8,
              fontSize: '0.8rem', letterSpacing: '0.2em',
              fontFamily: "'Bebas Neue', cursive",
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = `${hero.color}35`; }}
            onMouseLeave={e => { e.currentTarget.style.background = `${hero.color}15`; }}
          >
            CLOSE ✕
          </button>
        </div>

        {/* Floating close X */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute', top: 14, right: 14,
            width: 34, height: 34, borderRadius: '50%',
            border: `1px solid ${hero.color}50`,
            background: `${hero.color}15`,
            color: hero.color, fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s ease', zIndex: 5,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = `${hero.color}35`; }}
          onMouseLeave={e => { e.currentTarget.style.background = `${hero.color}15`; }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
