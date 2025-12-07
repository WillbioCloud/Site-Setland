import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export const ThemeEffects: React.FC = () => {
  const { currentTheme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Initialize particles based on theme
    const initParticles = () => {
      particles = [];
      const particleCount = currentTheme === 'glacial' ? 100 : currentTheme === 'medieval' ? 40 : 60;
      
      for (let i = 0; i < particleCount; i++) {
        if (currentTheme === 'glacial') {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2 + 1,
                speedY: Math.random() * 1 + 0.5,
                speedX: Math.random() * 0.5 - 0.25,
                opacity: Math.random() * 0.5 + 0.3
            });
        } else if (currentTheme === 'medieval') {
            // Dust/Embers
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2,
                speedY: -Math.random() * 0.5, // Float up slightly
                speedX: Math.random() * 1 - 0.5,
                opacity: Math.random() * 0.4 + 0.1
            });
        } else if (currentTheme === 'futuristic') {
             // Digital nodes
             particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                opacity: Math.random() * 0.5 + 0.5
            });
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (currentTheme === 'glacial') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        particles.forEach(p => {
            ctx.beginPath();
            ctx.globalAlpha = p.opacity;
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
            p.y += p.speedY;
            p.x += p.speedX;
            if (p.y > canvas.height) p.y = 0;
            if (p.x > canvas.width) p.x = 0;
            if (p.x < 0) p.x = canvas.width;
        });
      } else if (currentTheme === 'medieval') {
        ctx.fillStyle = '#fbbf24'; // Gold dust
        particles.forEach(p => {
            ctx.beginPath();
            ctx.globalAlpha = p.opacity;
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
            p.y += p.speedY;
            p.x += p.speedX;
            // Flicker effect
            if(Math.random() > 0.95) p.opacity = Math.random() * 0.4 + 0.1;
            
            if (p.y < 0) p.y = canvas.height;
            if (p.x > canvas.width) p.x = 0;
            if (p.x < 0) p.x = canvas.width;
        });
      } else if (currentTheme === 'futuristic') {
        ctx.fillStyle = '#06b6d4'; // Cyan
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.1)';
        
        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        particles.forEach(p => {
            ctx.beginPath();
            ctx.globalAlpha = p.opacity;
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        });
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    if (currentTheme !== 'default') {
      initParticles();
      draw();
    } else {
        ctx.clearRect(0,0,canvas.width, canvas.height);
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentTheme]);

  if (currentTheme === 'default') return null;

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-10"
      style={{ 
        opacity: currentTheme === 'futuristic' ? 0.4 : 0.6 
      }}
    />
  );
};