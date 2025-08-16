import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gift from "../assets/your-gif.mp4";

export default function StarryNight() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  // Handle refresh
  useEffect(() => {
    if (performance.navigation?.type === 1 || window.performance.getEntriesByType("navigation")[0]?.type === "reload") {
      window.location.href = "/";
    }

    // Block back navigation
    const handleBackButton = (e) => {
      e.preventDefault();
      window.history.forward();
    };
    
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', handleBackButton);
    
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, []);

  // Starry background effect
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function init() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const stars = [];
      const starCount = Math.min(200, Math.floor(window.innerWidth * window.innerHeight / 1000));
      
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * (window.innerWidth < 768 ? 1 : 1.5),
          alpha: Math.random(),
          alphaChange: 0.005 + Math.random() * 0.005
        });
      }
      
      return stars;
    }

    let stars = init();

    function drawStars() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        star.alpha += star.alphaChange;
        if (star.alpha <= 0 || star.alpha >= 1) {
          star.alphaChange = -star.alphaChange;
        }
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();
      });

      requestAnimationFrame(drawStars);
    }

    const animationId = requestAnimationFrame(drawStars);

    function handleResize() {
      stars = init();
    }

    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="h-full max-h-[80vh] w-auto max-w-[90vw] object-contain"
        >
          <source src={gift} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}