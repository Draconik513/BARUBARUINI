import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

export default function BirthdayParticles() {
  const canvasRef = useRef(null);
  const bgCanvasRef = useRef(null);
  const navigate = useNavigate();

  // Responsive font size calculation
  function responsiveFontSize(base, min, max) {
    const vw = window.innerWidth;
    const scale = vw / 1440;
    return Math.max(min, Math.min(max, Math.floor(base * scale)));
  }

  const texts = [
    { text: "3", font: `700 ${responsiveFontSize(200, 100, 240)}px sans-serif`, color: "#ffffff" },
    { text: "2", font: `700 ${responsiveFontSize(200, 100, 240)}px sans-serif`, color: "#ffffff" },
    { text: "1", font: `700 ${responsiveFontSize(200, 100, 240)}px sans-serif`, color: "#ffffff" },
    { text: "HAPPY", font: `700 ${responsiveFontSize(140, 70, 180)}px sans-serif`, color: "#ffffff" },
    { text: "GIRLFRIEND", font: `700 ${responsiveFontSize(140, 60, 180)}px sans-serif`, color: "#ffffff" },
    { text: "EBY💗", font: `700 ${responsiveFontSize(140, 70, 180)}px sans-serif`, color: "#ffffff" },
    { text: "SEMANGAT\n KERJANYA", font: `700 ${responsiveFontSize(140, 70, 180)}px sans-serif`, color: "#ffffff" },
  ];

  function hexToRgb(hex) {
    hex = hex.replace("#", "");
    if (hex.length === 3) {
      hex = hex.split("").map(c => c + c).join("");
    }
    const bigint = parseInt(hex, 16);
    return `${(bigint >> 16) & 255}, ${(bigint >> 8) & 255}, ${bigint & 255}`;
  }

  // Background matrix effect
  useEffect(() => {
    const canvas = bgCanvasRef.current;
    const ctx = canvas.getContext("2d");
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const fontSize = Math.max(18, Math.floor(Math.min(w, h) / 40));
    const colorA = "#ff8dc0ff";
    const colorB = "#fd1589ff";
    ctx.textBaseline = "top";
    ctx.font = `bold ${fontSize}px monospace`;

    let columns = Math.floor(w / fontSize) || 1;
    let drops = Array(columns).fill(-10);

    function draw() {
      ctx.fillStyle = "rgba(0,0,0,0.12)";
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < columns; i++) {
        const charIdx = Math.floor(Math.random() * "HAPPYGIRLFRIEND".length);
        const ch = "HAPPYGIRLFRIEND"[charIdx];
        const yIndex = drops[i];
        const y = yIndex * fontSize;

        const color = Math.floor(yIndex) % 2 === 0 ? colorA : colorB;
        ctx.fillStyle = color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = color;
        ctx.fillText(ch, i * fontSize, y);
        ctx.shadowBlur = 0;
        ctx.fillText(ch, i * fontSize, y);
        ctx.fillText(ch, i * fontSize + 0.5, y + 0.5);

        if (Math.random() > 0.975 || y > h + 10) {
          drops[i] = -2;
        }
        drops[i]++;
      }
    }

    const intervalId = setInterval(draw, 33);

    function handleResize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      ctx.font = `bold ${fontSize}px monospace`;
      columns = Math.floor(w / fontSize) || 1;
      drops = Array(columns).fill(-10);
    }

    window.addEventListener("resize", handleResize);
    return () => {
      clearInterval(intervalId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const off = document.createElement("canvas");
    const offCtx = off.getContext("2d");
    function setOffSize() {
      off.width = canvas.width;
      off.height = canvas.height;
    }
    setOffSize();

    function getTargetPositions(offCtx, offCanvas, textObj, step = 6) {
      offCtx.clearRect(0, 0, offCanvas.width, offCanvas.height);
      offCtx.fillStyle = "rgba(0,0,0,0)";
      offCtx.fillRect(0, 0, offCanvas.width, offCanvas.height);

      offCtx.font = textObj.font;
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.fillStyle = "#fff";

      if (textObj.text.includes("\n")) {
        const lines = textObj.text.split("\n");
        const sizeMatch = textObj.font.match(/(\d+)px/);
        const lineHeight = sizeMatch ? parseInt(sizeMatch[1]) + 10 : 140;
        const startY = offCanvas.height / 2 - ((lines.length - 1) * lineHeight) / 2;
        lines.forEach((line, i) => {
          offCtx.fillText(line, offCanvas.width / 2, startY + i * lineHeight);
        });
      } else {
        offCtx.fillText(textObj.text, offCanvas.width / 2, offCanvas.height / 2);
      }

      const imageData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
      const positions = [];
      for (let y = 0; y < offCanvas.height; y += step) {
        for (let x = 0; x < offCanvas.width; x += step) {
          const idx = (y * offCanvas.width + x) * 4;
          if (imageData.data[idx + 3] > 150) {
            positions.push({ x, y, color: textObj.color || "#ffffff" });
          }
        }
      }
      return positions;
    }

    setOffSize();
    const allTargets = texts.map(t => getTargetPositions(offCtx, off, t, 6));
    const maxLen = Math.max(...allTargets.map(arr => arr.length), 50);

    const particles = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    for (let i = 0; i < maxLen; i++) {
      particles.push({
        x: centerX + (Math.random() - 0.5) * 80,
        y: centerY + (Math.random() - 0.5) * 80,
        size: 2 + Math.random() * 1.5,
        opacity: 1,
        color: "#ffffff",
        targetX: centerX,
        targetY: centerY,
      });
    }

    let rafId = null;
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        const rgb = hexToRgb(p.color);
        ctx.fillStyle = `rgba(${rgb}, ${p.opacity})`;
        ctx.fill();
      }
      rafId = requestAnimationFrame(render);
    }
    render();

    function transitionToIndex(idx) {
      const targets = allTargets[idx];
      const tlen = targets.length;

      particles.forEach(p => {
        gsap.killTweensOf(p);
        gsap.to(p, {
          x: p.x + (Math.random() - 0.5) * 120,
          y: p.y + (Math.random() - 0.5) * 120,
          opacity: 0.35,
          duration: 0.45,
          ease: "power2.out",
        });
      });

      setTimeout(() => {
        for (let i = 0; i < particles.length; i++) {
          if (tlen > 0) {
            const t = targets[i % tlen];
            particles[i].targetX = t.x;
            particles[i].targetY = t.y;
            particles[i].color = t.color || texts[idx].color || "#ffffff";
          } else {
            particles[i].targetX = centerX + (Math.random() - 0.5) * 40;
            particles[i].targetY = centerY + (Math.random() - 0.5) * 40;
            particles[i].color = texts[idx].color || "#ffffff";
          }
          gsap.killTweensOf(particles[i]);
          gsap.to(particles[i], {
            x: particles[i].targetX,
            y: particles[i].targetY,
            opacity: 1,
            duration: 0.9,
            ease: "power2.inOut",
          });
        }
      }, 480);
    }

    let current = 0;
    transitionToIndex(0);
    const stageInterval = setInterval(() => {
      current++;
      if (current < texts.length) {
        transitionToIndex(current);
      } else {
        clearInterval(stageInterval);
        gsap.delayedCall(1.5, () => {
          gsap.killTweensOf(particles);
          window.location.href = "/stars";
        });
      }
    }, 2000);

    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(stageInterval);
      gsap.killTweensOf(particles);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [navigate]);

  return (
    <div className="w-full h-screen relative bg-black">
      <canvas ref={bgCanvasRef} className="absolute inset-0 z-0"></canvas>
      <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none"></canvas>
    </div>
  );
}