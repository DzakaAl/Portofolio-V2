import React, { useEffect, useRef } from 'react';

export default function LiveWallpaper() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Mouse tracking for dynamic interactive effect
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      radius: 200,
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Particle nodes definition
    const particleCount = Math.floor(Math.min(width, 1400) / 14);
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2.2 + 0.8,
        alpha: Math.random() * 0.5 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulseFactor: Math.random() * Math.PI,
      });
    }

    // Grid dots matrix initialization
    const gridSpacing = 45;

    let time = 0;

    const render = () => {
      time += 0.015;

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Dark background gradient
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle background radial dark ambient glow
      const grad = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        10,
        mouse.x,
        mouse.y,
        500
      );
      grad.addColorStop(0, 'rgba(60, 60, 70, 0.25)');
      grad.addColorStop(0.5, 'rgba(20, 20, 25, 0.1)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Render Matrix Dot Grid (monochrome gray dot matrix with wave animation)
      for (let x = 20; x < width; x += gridSpacing) {
        for (let y = 20; y < height; y += gridSpacing) {
          const distMouse = Math.hypot(x - mouse.x, y - mouse.y);
          const wave = Math.sin(time + (x * 0.01 + y * 0.01)) * 1.5;
          let dotSize = 1;
          let alpha = 0.08;

          if (distMouse < mouse.radius) {
            const factor = 1 - distMouse / mouse.radius;
            dotSize += factor * 2;
            alpha += factor * 0.3;
          }

          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.beginPath();
          ctx.arc(x, y + wave, dotSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Update and render particles with interactive connections
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        p.pulseFactor += p.pulseSpeed;
        const currentAlpha = p.alpha + Math.sin(p.pulseFactor) * 0.15;

        // Draw particle
        ctx.fillStyle = `rgba(220, 225, 230, ${Math.max(0.05, currentAlpha)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles with subtle grey line mesh
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            const lineAlpha = (1 - dist / 100) * 0.12;
            ctx.strokeStyle = `rgba(200, 200, 210, ${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Vignette effect overlay
      const vignetteGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.max(width, height) * 0.35,
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
