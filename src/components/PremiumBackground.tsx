"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function PremiumBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame: number;
    let particles: { x: number; y: number; size: number; speedX: number; speedY: number; opacity: number; hue: number }[] = [];
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const createParticle = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: Math.random() * 0.5 - 0.25,
      speedY: Math.random() * 0.5 - 0.25,
      opacity: Math.random() * 0.5 + 0.1,
      hue: 45,
    });

    particles = Array.from({ length: 100 }, createParticle);

    const updateParticles = () => {
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });
    };

    const drawParticles = () => {
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${p.opacity})`;
        ctx.fill();
      });
    };

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.03)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      updateParticles();
      drawParticles();
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: 100 }, createParticle);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        style={{ mixBlendMode: "screen" }}
      />
      <div className="fixed inset-0 w-full h-full pointer-events-none z-[1]">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-gradient-radial from-[#D4AF37]/20 to-transparent rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-gradient-radial from-[#D4AF37]/10 to-transparent rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] right-[20%] w-[400px] h-[400px] bg-gradient-radial from-[#D4AF37]/5 to-transparent rounded-full blur-[100px]"
        />
      </div>
    </>
  );
}