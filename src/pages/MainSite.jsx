import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HEROES } from '../data/heroes';
import HeroCard from '../components/HeroCard';
import HeroModal from '../components/HeroModal';
import ParticleBackground from '../components/ParticleBackground';
import { getMuted, setMuted } from '../components/SoundManager';

gsap.registerPlugin(ScrollTrigger);

export default function MainSite() {
  const [selectedHero, setSelectedHero] = useState(null);
  const [muted, setMutedState] = useState(getMuted());
  const heroGridRef = useRef(null);
  const headerRef = useRef(null);
  const sectionRefs = useRef([]);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
  };

  useEffect(() => {
    // Header entrance
    gsap.fromTo(headerRef.current,
      { opacity: 0, y: -40 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 }
    );

    // Hero cards stagger on scroll
    const cards = heroGridRef.current?.querySelectorAll('.hero-card');
    if (cards) {
      gsap.fromTo(cards,
        { opacity: 0, y: 80, scale: 0.9 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: heroGridRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );
    }

    // Section reveals
    sectionRefs.current.forEach((el) => {
      if (!el) return;
      gsap.fromTo(el,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        }
      );
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <>
      <ParticleBackground />

      {/* Floating mute button */}
      <button
        onClick={toggleMute}
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 500,
          padding: '10px 18px',
          background: 'rgba(10,10,20,0.7)',
          border: '1px solid rgba(212,175,55,0.3)',
          color: 'rgba(212,175,55,0.8)',
          borderRadius: 30,
          backdropFilter: 'blur(8px)',
          cursor: 'none',
          fontSize: '0.85rem',
          letterSpacing: '0.1em',
          fontFamily: "'Rajdhani', sans-serif",
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.8)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'; }}
      >
        {muted ? '🔇 UNMUTE' : '🔊 SOUND'}
      </button>

      {/* ─── NAVBAR ────────────────────────────────────── */}
      <nav
        ref={headerRef}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          zIndex: 200, opacity: 0,
          padding: '0 40px',
          height: 70,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(5,5,8,0.7)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(212,175,55,0.12)',
        }}
      >
        <div className="font-cinematic shimmer-text" style={{ fontSize: '1.8rem', letterSpacing: '0.2em' }}>
          AVENGERS
        </div>
        <div style={{ display: 'flex', gap: 32 }}>
          {['HEROES', 'ABOUT', 'ASSEMBLE'].map(link => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              style={{
                color: 'rgba(232,232,240,0.55)',
                textDecoration: 'none',
                fontSize: '0.85rem',
                letterSpacing: '0.25em',
                fontFamily: "'Bebas Neue', cursive",
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#d4af37'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(232,232,240,0.55)'; }}
            >
              {link}
            </a>
          ))}
        </div>
      </nav>

      {/* ─── HERO BANNER ───────────────────────────────── */}
      <section
        id="heroes"
        className="section-full"
        style={{
          paddingTop: 140, paddingBottom: 100,
          paddingLeft: 'clamp(20px, 6vw, 80px)',
          paddingRight: 'clamp(20px, 6vw, 80px)',
        }}
      >
        {/* Banner heading */}
        <div
          ref={el => sectionRefs.current[0] = el}
          style={{ textAlign: 'center', marginBottom: 70 }}
        >
          <p style={{
            fontSize: '0.8rem', letterSpacing: '0.5em',
            color: 'rgba(212,175,55,0.6)',
            textTransform: 'uppercase',
            fontFamily: "'Rajdhani', sans-serif",
            marginBottom: 12,
          }}>
            EARTH'S MIGHTIEST HEROES
          </p>
          <h1 className="font-cinematic shimmer-text" style={{
            fontSize: 'clamp(3rem, 9vw, 7rem)',
            letterSpacing: '0.15em',
            lineHeight: 1,
            marginBottom: 20,
          }}>
            CHOOSE YOUR HERO
          </h1>
          <div style={{
            width: 120, height: 2, margin: '0 auto',
            background: 'linear-gradient(90deg, transparent, #d4af37, transparent)',
            boxShadow: '0 0 12px #d4af37',
          }} />
        </div>

        {/* Hero grid */}
        <div
          ref={heroGridRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 28,
            maxWidth: 1300,
            margin: '0 auto',
          }}
        >
          {HEROES.map(hero => (
            <HeroCard key={hero.id} hero={hero} onClick={setSelectedHero} />
          ))}
        </div>
      </section>

      {/* ─── ABOUT SECTION ─────────────────────────────── */}
      <section
        id="about"
        className="section-full"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '100px clamp(20px, 8vw, 120px)',
        }}
      >
        <div
          ref={el => sectionRefs.current[1] = el}
          style={{
            maxWidth: 900,
            textAlign: 'center',
            background: 'rgba(10,10,20,0.55)',
            backdropFilter: 'blur(14px)',
            border: '1px solid rgba(212,175,55,0.12)',
            borderRadius: 24,
            padding: 'clamp(40px, 7vw, 80px)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Corner accents */}
          {[0,1,2,3].map(i => (
            <div key={i} style={{
              position: 'absolute',
              top: i < 2 ? 0 : 'auto', bottom: i >= 2 ? 0 : 'auto',
              left: i % 2 === 0 ? 0 : 'auto', right: i % 2 === 1 ? 0 : 'auto',
              width: 30, height: 30,
              borderTop: i < 2 ? '2px solid rgba(212,175,55,0.4)' : 'none',
              borderBottom: i >= 2 ? '2px solid rgba(212,175,55,0.4)' : 'none',
              borderLeft: i % 2 === 0 ? '2px solid rgba(212,175,55,0.4)' : 'none',
              borderRight: i % 2 === 1 ? '2px solid rgba(212,175,55,0.4)' : 'none',
            }} />
          ))}

          <p style={{ fontSize: '0.75rem', letterSpacing: '0.5em', color: 'rgba(212,175,55,0.5)', marginBottom: 16 }}>
            THE INITIATIVE
          </p>
          <h2 className="font-cinematic" style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            letterSpacing: '0.1em',
            color: '#e8e8f0',
            marginBottom: 28,
            lineHeight: 1.1,
          }}>
            THERE WAS AN IDEA...
          </h2>
          <p className="font-body" style={{
            color: 'rgba(232,232,240,0.65)',
            lineHeight: 1.9,
            fontSize: 'clamp(1rem, 2vw, 1.15rem)',
            marginBottom: 32,
          }}>
            Nick Fury's "Avengers Initiative" brought together a remarkable group of people,
            to see if they could become something more. To see if they could work together
            when we needed them to, to fight the battles we never could.
          </p>

          <div style={{ display: 'flex', gap: 40, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: 'HEROES', value: '6+' },
              { label: 'BATTLES WON', value: '∞' },
              { label: 'UNIVERSE', value: 'MCU' },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div className="font-cinematic" style={{
                  fontSize: '3rem', color: '#d4af37',
                  textShadow: '0 0 20px rgba(212,175,55,0.5)',
                }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.35em', color: 'rgba(255,255,255,0.35)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ASSEMBLE CTA ───────────────────────────────── */}
      <section
        id="assemble"
        ref={el => sectionRefs.current[2] = el}
        style={{
          minHeight: '60vh',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center',
          padding: '80px 20px',
          position: 'relative', zIndex: 10,
        }}
      >
        <div style={{
          fontSize: 'clamp(4rem, 15vw, 12rem)',
          fontFamily: "'Bebas Neue', cursive",
          letterSpacing: '0.3em',
          background: 'linear-gradient(180deg, rgba(212,175,55,1) 0%, rgba(212,175,55,0.2) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1,
          filter: 'drop-shadow(0 0 40px rgba(212,175,55,0.3))',
        }}>
          ASSEMBLE
        </div>
        <p className="font-body" style={{
          color: 'rgba(232,232,240,0.4)',
          letterSpacing: '0.3em',
          fontSize: '0.85rem',
          marginTop: 24,
          textTransform: 'uppercase',
        }}>
          Avengers — Because even heroes need a team.
        </p>

        {/* Avenger icons row */}
        <div style={{ display: 'flex', gap: 24, marginTop: 48, fontSize: '2.5rem' }}>
          {HEROES.map(h => (
            <div
              key={h.id}
              onClick={() => setSelectedHero(h)}
              style={{
                cursor: 'none',
                filter: `drop-shadow(0 0 10px ${h.color})`,
                transition: 'transform 0.3s ease, filter 0.3s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.3) translateY(-8px)'; e.currentTarget.style.filter = `drop-shadow(0 0 20px ${h.color})`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1) translateY(0)'; e.currentTarget.style.filter = `drop-shadow(0 0 10px ${h.color})`; }}
            >
              {h.iconEmoji}
            </div>
          ))}
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────── */}
      <footer style={{
        textAlign: 'center', padding: '32px 20px',
        borderTop: '1px solid rgba(212,175,55,0.1)',
        position: 'relative', zIndex: 10,
      }}>
        <div className="font-cinematic shimmer-text" style={{ fontSize: '1.5rem', letterSpacing: '0.4em', marginBottom: 8 }}>
          AVENGERS
        </div>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', letterSpacing: '0.2em' }}>
          © 2024 · Earth's Mightiest Heroes · Marvel Universe
        </p>
      </footer>

      {/* Hero Modal */}
      {selectedHero && (
        <HeroModal hero={selectedHero} onClose={() => setSelectedHero(null)} />
      )}
    </>
  );
}
