import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { HeroSounds } from './SoundManager';

export default function HeroCard({ hero, onClick, index }) {
  const cardRef  = useRef(null);
  const imgRef   = useRef(null);
  const shineRef = useRef(null);

  useEffect(() => {
    // Staggered entrance handled by parent via ScrollTrigger
    // Idle subtle float
    gsap.to(cardRef.current, {
      y: -8, duration: 2.5 + (index % 3) * 0.4,
      ease: 'sine.inOut', yoyo: true, repeat: -1,
      delay: index * 0.18,
    });
  }, [index]);

  /* ── Mouse 3D tilt + light reflection ─────────────────── */
  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width  / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);

    gsap.to(cardRef.current, {
      rotateY: dx * 10,
      rotateX: -dy * 8,
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 900,
      overwrite: 'auto',
    });

    // Shine follow
    if (shineRef.current) {
      const px = ((e.clientX - rect.left) / rect.width)  * 100;
      const py = ((e.clientY - rect.top)  / rect.height) * 100;
      shineRef.current.style.background =
        `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.14) 0%, transparent 60%)`;
    }
    // Image parallax
    if (imgRef.current) {
      gsap.to(imgRef.current, {
        x: dx * -8, y: dy * -8,
        duration: 0.4, ease: 'power2.out', overwrite: 'auto',
      });
    }
  };

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      scale: 1.04, duration: 0.35,
      ease: 'back.out(1.5)', overwrite: 'auto',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      scale: 1, rotateY: 0, rotateX: 0,
      duration: 0.5, ease: 'power2.out', overwrite: 'auto',
    });
    gsap.to(imgRef.current, { x: 0, y: 0, duration: 0.5, ease: 'power2.out' });
    if (shineRef.current) shineRef.current.style.background = 'transparent';
  };

  const handleClick = () => {
    HeroSounds[hero.id]?.();
    gsap.timeline()
      .to(cardRef.current, { scale: 0.96, duration: 0.1, ease: 'power2.in' })
      .to(cardRef.current, { scale: 1.04, duration: 0.2, ease: 'back.out(2)' })
      .to(cardRef.current, { scale: 1, duration: 0.25, ease: 'power2.out' });
    onClick(hero);
  };

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        borderRadius: 16,
        overflow: 'hidden',
        cursor: 'pointer',
        transformStyle: 'preserve-3d',
        background: 'rgba(8,8,16,0.75)',
        border: `1px solid ${hero.color}35`,
        backdropFilter: 'blur(10px)',
        transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
        willChange: 'transform',
      }}
      className="hero-card"
      onMouseOver={e => {
        e.currentTarget.style.borderColor = `${hero.color}80`;
        e.currentTarget.style.boxShadow   = `0 0 30px ${hero.color}40, 0 20px 60px rgba(0,0,0,0.6)`;
      }}
      onMouseOut={e => {
        e.currentTarget.style.borderColor = `${hero.color}35`;
        e.currentTarget.style.boxShadow   = 'none';
      }}
    >
      {/* Top accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, transparent, ${hero.color}, ${hero.secondColor}, transparent)`,
        boxShadow: `0 0 10px ${hero.color}`,
        zIndex: 3,
      }} />

      {/* Light-reflection shine layer */}
      <div ref={shineRef} style={{
        position: 'absolute', inset: 0, zIndex: 2,
        borderRadius: 16, pointerEvents: 'none',
        background: 'transparent',
        transition: 'background 0.1s ease',
      }} />

      {/* ── Hero Image ─────────────────────────────────────── */}
      <div style={{ position: 'relative', height: 260, overflow: 'hidden' }}>
        <img
          ref={imgRef}
          src={hero.image}
          alt={hero.name}
          loading="lazy"
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            display: 'block',
            transition: 'filter 0.4s ease',
          }}
          onError={e => { e.target.style.display = 'none'; }}
        />
        {/* Gradient overlay on image */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%',
          background: `linear-gradient(to top, rgba(8,8,16,1) 0%, rgba(8,8,16,0.5) 60%, transparent 100%)`,
          zIndex: 1,
        }} />
        {/* Hero color vignette */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at center top, ${hero.color}12 0%, transparent 70%)`,
          zIndex: 1,
        }} />

        {/* Team badge */}
        <div style={{
          position: 'absolute', top: 12, right: 12, zIndex: 2,
          padding: '3px 10px', borderRadius: 20,
          background: `${hero.color}25`,
          border: `1px solid ${hero.color}60`,
          fontSize: '0.65rem', letterSpacing: '0.15em',
          color: hero.color,
          fontFamily: "'Rajdhani', sans-serif",
          fontWeight: 600,
          textTransform: 'uppercase',
        }}>
          {hero.team}
        </div>
      </div>

      {/* ── Card Body ──────────────────────────────────────── */}
      <div style={{ padding: '16px 20px 22px', position: 'relative', zIndex: 1 }}>
        <h3 style={{
          fontFamily: "'Bebas Neue', cursive",
          fontSize: '1.7rem', letterSpacing: '0.12em',
          color: hero.color,
          textShadow: `0 0 15px ${hero.color}70`,
          marginBottom: 2, lineHeight: 1,
        }}>
          {hero.name}
        </h3>
        <p style={{
          fontSize: '0.75rem', letterSpacing: '0.2em',
          color: 'rgba(255,255,255,0.38)',
          textTransform: 'uppercase',
          fontFamily: "'Rajdhani', sans-serif",
          marginBottom: 10,
        }}>
          {hero.alias}
        </p>

        {/* Powers */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
          {hero.powers.slice(0, 3).map(p => (
            <span key={p} style={{
              padding: '2px 9px', borderRadius: 20, fontSize: '0.65rem',
              letterSpacing: '0.08em',
              background: `${hero.color}15`,
              border: `1px solid ${hero.color}35`,
              color: hero.color,
              textTransform: 'uppercase',
              fontFamily: "'Rajdhani', sans-serif", fontWeight: 600,
            }}>
              {p}
            </span>
          ))}
        </div>

        {/* Tagline */}
        <p style={{
          fontSize: '0.82rem', fontStyle: 'italic',
          color: 'rgba(232,232,240,0.5)', lineHeight: 1.4,
          borderLeft: `2px solid ${hero.color}60`,
          paddingLeft: 10, marginBottom: 14,
          fontFamily: "'Rajdhani', sans-serif",
        }}>
          "{hero.tagline}"
        </p>

        {/* View profile row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{
            fontSize: '0.7rem', letterSpacing: '0.25em',
            color: hero.color, opacity: 0.8,
            fontFamily: "'Bebas Neue', cursive",
            textTransform: 'uppercase',
          }}>
            View Profile
          </span>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: `${hero.color}20`,
            border: `1px solid ${hero.color}60`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: hero.color, fontSize: '0.8rem',
          }}>
            →
          </div>
        </div>
      </div>
    </div>
  );
}
