"use client";
import { useEffect, useRef } from "react";

// Fixed, full-viewport animated starfield: twinkling stars, drifting gold dust,
// and occasional shooting stars — tuned to be unmistakably in motion, not just
// a subtle shimmer. Pure canvas, no images/video, negligible main-thread cost.
export default function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    let width, height, dpr;
    let stars = [], motes = [], shooters = [];
    let t = 0, lastShooter = 0;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function seed() {
      const density = Math.max(160, Math.floor((width * height) / 7000));
      stars = Array.from({ length: density }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.6 + 0.4,
        phase: Math.random() * Math.PI * 2,
        speed: 1.0 + Math.random() * 2.2,
        baseAlpha: 0.4 + Math.random() * 0.6,
      }));
      motes = Array.from({ length: 40 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2.2 + 0.8,
        driftY: 0.35 + Math.random() * 0.55,
        driftX: (Math.random() - 0.5) * 0.25,
        alpha: 0.25 + Math.random() * 0.35,
      }));
    }

    function spawnShooter() {
      const startX = Math.random() * width * 0.7;
      const startY = Math.random() * height * 0.5;
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
      const speed = 9 + Math.random() * 6;
      shooters.push({
        x: startX, y: startY,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        life: 0, maxLife: 40 + Math.random() * 20,
      });
    }

    function draw() {
      t += 0.016;
      ctx.clearRect(0, 0, width, height);

      for (const s of stars) {
        const twinkle = 0.5 + 0.5 * Math.sin(t * s.speed + s.phase);
        ctx.globalAlpha = s.baseAlpha * (0.15 + 0.85 * twinkle);
        ctx.fillStyle = "#fdf9f0";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const m of motes) {
        m.y -= m.driftY;
        m.x += m.driftX;
        if (m.y < -10) { m.y = height + 10; m.x = Math.random() * width; }
        if (m.x < -10) m.x = width + 10;
        if (m.x > width + 10) m.x = -10;
        ctx.globalAlpha = m.alpha;
        ctx.fillStyle = "#f0c374";
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (t - lastShooter > 3.5 && Math.random() < 0.02) {
        spawnShooter();
        lastShooter = t;
      }
      for (let i = shooters.length - 1; i >= 0; i--) {
        const sh = shooters[i];
        sh.x += sh.vx; sh.y += sh.vy; sh.life++;
        const fade = 1 - sh.life / sh.maxLife;
        if (fade <= 0) { shooters.splice(i, 1); continue; }
        ctx.strokeStyle = `rgba(253,249,240,${fade * 0.85})`;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(sh.x - sh.vx * 4, sh.y - sh.vy * 4);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="starfield-layer" aria-hidden="true">
      <div className="starfield-glow starfield-glow-a" />
      <div className="starfield-glow starfield-glow-b" />
      <canvas ref={canvasRef} />
    </div>
  );
}
