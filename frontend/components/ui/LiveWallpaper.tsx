'use client';
import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  pulseSpeed: number;
  pulse: number;
}

interface SmokeOrb {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
}

export default function LiveWallpaper() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId: number;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      radius: 220,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Dynamic Dust & Drifting Embers Particles
    const particleCount = 80;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -Math.random() * 0.8 - 0.2, // Drifting upwards
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.4 + 0.1,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        pulse: Math.random() * Math.PI,
      });
    }

    // Moving Smoke / Fog Orbs
    const smokeOrbs: SmokeOrb[] = [
      { x: width * 0.2, y: height * 0.3, radius: 350, vx: 0.3, vy: 0.2, alpha: 0.15 },
      { x: width * 0.8, y: height * 0.7, radius: 450, vx: -0.2, vy: -0.3, alpha: 0.18 },
      { x: width * 0.5, y: height * 0.5, radius: 500, vx: 0.1, vy: -0.2, alpha: 0.12 },
    ];

    let time = 0;

    const render = () => {
      time += 0.02;

      // Smooth mouse movement
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      // Pure black canvas clear
      ctx.fillStyle = '#030304';
      ctx.fillRect(0, 0, width, height);

      // Render Moving Fluid Smoke Orbs for background texture
      smokeOrbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x < -100 || orb.x > width + 100) orb.vx *= -1;
        if (orb.y < -100 || orb.y > height + 100) orb.vy *= -1;

        const smokeGrad = ctx.createRadialGradient(
          orb.x,
          orb.y,
          10,
          orb.x,
          orb.y,
          orb.radius
        );
        smokeGrad.addColorStop(0, `rgba(50, 55, 65, ${orb.alpha})`);
        smokeGrad.addColorStop(0.5, `rgba(20, 22, 28, ${orb.alpha * 0.5})`);
        smokeGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = smokeGrad;
        ctx.fillRect(0, 0, width, height);
      });

      // Mouse interactive spotlight ambient glow
      const mouseGrad = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        10,
        mouse.x,
        mouse.y,
        mouse.radius
      );
      mouseGrad.addColorStop(0, 'rgba(100, 110, 130, 0.25)');
      mouseGrad.addColorStop(0.6, 'rgba(30, 35, 45, 0.1)');
      mouseGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = mouseGrad;
      ctx.fillRect(0, 0, width, height);

      // Interactive Grid Dots (illuminates smoothly around mouse movement)
      const gridSpacing = 45;
      for (let x = gridSpacing; x < width; x += gridSpacing) {
        for (let y = gridSpacing; y < height; y += gridSpacing) {
          const distMouse = Math.hypot(x - mouse.x, y - mouse.y);
          if (distMouse < mouse.radius * 1.5) {
            const factor = 1 - distMouse / (mouse.radius * 1.5);
            const wave = Math.sin(time + x * 0.01 + y * 0.01) * 1.5;
            const dotSize = 1 + factor * 2;
            const alpha = factor * 0.4;

            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.arc(x, y + wave, dotSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Render Drifting Ember Dust Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx + Math.sin(time + p.y * 0.01) * 0.3;
        p.y += p.vy;

        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        p.pulse += p.pulseSpeed;
        const currentAlpha = p.alpha + Math.sin(p.pulse) * 0.12;

        ctx.fillStyle = `rgba(230, 235, 245, ${Math.max(0.05, currentAlpha)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Vignette effect overlay
      const vignetteGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.max(width, height) * 0.3,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.75
      );
      vignetteGrad.addColorStop(0, 'rgba(0,0,0,0)');
      vignetteGrad.addColorStop(1, 'rgba(0,0,0,0.85)');
      ctx.fillStyle = vignetteGrad;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
