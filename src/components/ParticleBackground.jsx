import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ParticleBackground.jsx
 * Three.js WebGL particle system — always running behind all content.
 * Responds to mouse movement with subtle parallax.
 * Accepts a `heroColor` prop to tint particles during hero reveals.
 */
export default function ParticleBackground({ heroColor = null }) {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const particlesRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef(null);
  const heroColorRef = useRef(heroColor);

  useEffect(() => {
    heroColorRef.current = heroColor;
  }, [heroColor]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ─── Scene setup ────────────────────────────────────────
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: mount,
      alpha: true,
      antialias: false,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    // ─── Particle geometry ────────────────────────────────────
    const PARTICLE_COUNT = 1400;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const alphas    = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14;
      alphas[i] = Math.random();
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // ─── Particle material ────────────────────────────────────
    const material = new THREE.PointsMaterial({
      size: 0.055,
      color: new THREE.Color('#d4af37'),
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;

    // ─── Central glow orb ────────────────────────────────────
    const glowGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const glowMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#d4af37'),
      transparent: true,
      opacity: 0.06,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glow);

    // ─── Animation loop ────────────────────────────────────────
    let t = 0;
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      t += 0.003;

      // Slow rotation
      particles.rotation.y = t * 0.05;
      particles.rotation.x = Math.sin(t * 0.03) * 0.1;

      // Parallax on mouse
      camera.position.x += (mouseRef.current.x * 0.8 - camera.position.x) * 0.05;
      camera.position.y += (-mouseRef.current.y * 0.8 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      // Hero color tinting
      if (heroColorRef.current) {
        const hc = new THREE.Color(heroColorRef.current);
        material.color.lerp(hc, 0.02);
      } else {
        material.color.lerp(new THREE.Color('#ffffff'), 0.01);
      }

      // Breathing opacity
      material.opacity = 0.55 + Math.sin(t * 2) * 0.1;

      renderer.render(scene, camera);
    };
    animate();

    // ─── Resize handler ───────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    // ─── Mouse handler ────────────────────────────────────────
    const onMouse = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouse);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouse);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={mountRef}
      id="particle-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
