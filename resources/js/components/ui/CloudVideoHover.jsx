import React, { useEffect, useRef } from 'react';
import spidermanVideo from '../../assets/spiderman.webm';

export default function CloudVideoHover({ isHovered, isLoading }) {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const isHoveredRef = useRef(isHovered);

  // Keep ref updated without re-triggering effect, ignore hover when loading
  useEffect(() => {
    isHoveredRef.current = isLoading ? false : isHovered;
  }, [isHovered, isLoading]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    // Force play video element continuously
    video.play().catch(() => {});

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      if (!canvas || !canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Persistent cloud blobs that float smoothly
    const cloudBlobs = [];
    const blobCount = 20;

    for (let i = 0; i < blobCount; i++) {
      cloudBlobs.push({
        offsetX: (Math.random() - 0.5) * 400,
        offsetY: (Math.random() - 0.5) * 200,
        radius: Math.random() * 120 + 130,
        pulseSpeed: Math.random() * 0.02 + 0.008,
        angle: Math.random() * Math.PI * 2,
      });
    }

    // Smooth interpolated mouse position
    const smoothMouse = { x: canvas.width / 2, y: canvas.height / 2 };
    let time = 0;
    let smoothOpacity = 0;

    const render = () => {
      time += 0.02;

      // Ensure video is playing continuously
      if (video.paused) {
        video.play().catch(() => {});
      }

      // Smooth mouse interpolation (lerp)
      smoothMouse.x += (mouseRef.current.x - smoothMouse.x) * 0.12;
      smoothMouse.y += (mouseRef.current.y - smoothMouse.y) * 0.12;

      // Smooth opacity interpolation for enter/leave
      const targetOpacity = isHoveredRef.current ? 1 : 0;
      smoothOpacity += (targetOpacity - smoothOpacity) * 0.08;

      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      if (smoothOpacity > 0.005) {
        ctx.save();
        ctx.globalAlpha = smoothOpacity;

        // Step 1: Render Organic Cloud Noise Mask
        for (let i = 0; i < cloudBlobs.length; i++) {
          const b = cloudBlobs[i];
          b.angle += b.pulseSpeed;

          const cx = smoothMouse.x + b.offsetX + Math.sin(time + b.angle) * 25;
          const cy = smoothMouse.y + b.offsetY + Math.cos(time * 0.8 + b.angle) * 20;
          const r = b.radius + Math.sin(b.angle * 2) * 25;

          const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
          grad.addColorStop(0, 'rgba(0, 0, 0, 1)');
          grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.95)');
          grad.addColorStop(0.8, 'rgba(0, 0, 0, 0.45)');
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.fill();
        }

        // Step 2: Composite crystal clear video inside cloud mask
        ctx.globalCompositeOperation = 'source-in';

        if (video.readyState >= 2) {
          const vWidth = video.videoWidth || 16;
          const vHeight = video.videoHeight || 9;
          const scale = Math.max(w / vWidth, h / vHeight);
          const drawW = vWidth * scale;
          const drawH = vHeight * scale;
          const drawX = (w - drawW) / 2;
          const drawY = (h - drawH) / 2;

          ctx.drawImage(video, drawX, drawY, drawW, drawH);
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        src={spidermanVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        crossOrigin="anonymous"
        aria-hidden="true"
        className="fixed top-0 left-0 w-1 h-1 opacity-[0.001] pointer-events-none -z-50"
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10 filter brightness-75 contrast-115 saturate-110 opacity-85"
      />
    </>
  );
}
