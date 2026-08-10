import React, { useEffect, useRef } from 'react';

export default function CyberBannerCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = 650);
    let height = (canvas.height = 120);

    let frame = 0;

    const render = () => {
      frame++;
      ctx.fillStyle = '#0a0a0c';
      ctx.fillRect(0, 0, width, height);

      // Background ASCII / Matrix Code grid texture
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.font = '8px monospace';

      const chars = '0101010101CODE_MEETS_IMAGINATION_EXTIZ_STUDIO_2026_CYBER_MATRIX_ASCII_010101';
      for (let y = 12; y < height; y += 10) {
        for (let x = 6; x < width; x += 12) {
          const charIndex = Math.floor((x * 0.05 + y * 0.1 + frame * 0.1) % chars.length);
          const char = chars[charIndex];
          ctx.fillText(char, x, y);
        }
      }

      // Draw subtle dark gradient overlay
      const grad = ctx.createLinearGradient(0, 0, width, 0);
      grad.addColorStop(0, 'rgba(10, 10, 12, 0.9)');
      grad.addColorStop(0.2, 'rgba(10, 10, 12, 0.4)');
      grad.addColorStop(0.5, 'rgba(10, 10, 12, 0.2)');
      grad.addColorStop(0.8, 'rgba(10, 10, 12, 0.4)');
      grad.addColorStop(1, 'rgba(10, 10, 12, 0.9)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Left Cyber Eye Graphic (Glowing Purple/Cyan Pupil)
      const eye1X = 220;
      const eye1Y = 60;

      // Outer Eye contour shape
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(eye1X, eye1Y, 45, 25, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Pupil iris with animated glow
      const pupilOffset = Math.sin(frame * 0.05) * 4;
      const eyeGlow = ctx.createRadialGradient(
        eye1X + pupilOffset,
        eye1Y,
        2,
        eye1X + pupilOffset,
        eye1Y,
        18
      );
      eyeGlow.addColorStop(0, 'rgba(220, 120, 255, 0.9)');
      eyeGlow.addColorStop(0.4, 'rgba(140, 80, 240, 0.7)');
      eyeGlow.addColorStop(0.8, 'rgba(40, 200, 240, 0.4)');
      eyeGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = eyeGlow;
      ctx.beginPath();
      ctx.arc(eye1X + pupilOffset, eye1Y, 16, 0, Math.PI * 2);
      ctx.fill();

      // Iris Center dot
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(eye1X + pupilOffset, eye1Y, 4, 0, Math.PI * 2);
      ctx.fill();

      // Right Cyber Eye Contour
      const eye2X = 430;
      const eye2Y = 60;

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.beginPath();
      ctx.ellipse(eye2X, eye2Y, 45, 25, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Right pupil iris
      const eye2Glow = ctx.createRadialGradient(
        eye2X + pupilOffset,
        eye2Y,
        2,
        eye2X + pupilOffset,
        eye2Y,
        18
      );
      eye2Glow.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      eye2Glow.addColorStop(0.5, 'rgba(180, 180, 200, 0.5)');
      eye2Glow.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = eye2Glow;
      ctx.beginPath();
      ctx.arc(eye2X + pupilOffset, eye2Y, 15, 0, Math.PI * 2);
      ctx.fill();

      // Scanline animation moving vertically
      const scanlineY = (frame * 1.5) % height;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(0, scanlineY, width, 2);

      // Border outline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative my-4 inline-block w-full max-w-[650px] overflow-hidden rounded-md border border-white/20 shadow-2xl shadow-white/5">
      <canvas
        ref={canvasRef}
        className="w-full h-[80px] sm:h-[110px] md:h-[120px] object-cover block"
      />
      {/* Glitch CRT grid texture overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />
    </div>
  );
}
