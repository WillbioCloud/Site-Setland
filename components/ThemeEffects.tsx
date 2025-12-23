// willbiocloud/site-setland/Site-Setland-.../components/ThemeEffects.tsx

import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export const ThemeEffects: React.FC = () => {
  const { currentTheme, isChristmasMode } = useTheme(); // Pega a flag de Natal
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];     // Partículas do tema (Fogo, Nodes, Gelo)
    let snowParticles: any[] = []; // Partículas EXTRAS de Natal (Neve)

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const initParticles = () => {
      particles = [];
      snowParticles = [];

      // 1. INICIALIZA O TEMA BASE (Sua lógica original)
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
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2,
                speedY: -Math.random() * 0.5, // Sobe (brasas)
                speedX: Math.random() * 1 - 0.5,
                opacity: Math.random() * 0.4 + 0.1
            });
        } else if (currentTheme === 'futuristic') {
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

      // 2. INICIALIZA A CAMADA DE NATAL (Se ativo)
      if (isChristmasMode) {
        // Se já for Glacial, adicionamos menos neve extra para não poluir, 
        // mas adicionamos partículas coloridas (luzes)
        const snowCount = currentTheme === 'glacial' ? 40 : 80; 

        for (let i = 0; i < snowCount; i++) {
            snowParticles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 3 + 1,
                speedY: Math.random() * 2 + 1,   // Cai (neve)
                speedX: Math.random() * 1 - 0.5, // Vento
                opacity: Math.random() * 0.6 + 0.2,
                // 15% de chance de ser uma "luzinha de natal" (vermelho/verde)
                isFestive: Math.random() > 0.85 
            });
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // --- DESENHA TEMA BASE ---
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
        ctx.fillStyle = '#fbbf24'; // Dourado
        particles.forEach(p => {
            ctx.beginPath();
            ctx.globalAlpha = p.opacity;
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
            p.y += p.speedY;
            p.x += p.speedX;
            if(Math.random() > 0.95) p.opacity = Math.random() * 0.4 + 0.1;
            if (p.y < 0) p.y = canvas.height;
            if (p.x > canvas.width) p.x = 0;
            if (p.x < 0) p.x = canvas.width;
        });
      } else if (currentTheme === 'futuristic') {
        ctx.fillStyle = '#06b6d4'; // Ciano
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.1)';
        // Linhas de conexão
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

      // --- DESENHA A CAMADA DE NATAL (OVERLAY) ---
      if (isChristmasMode) {
          snowParticles.forEach(p => {
              ctx.beginPath();
              ctx.globalAlpha = p.opacity;
              
              if (p.isFestive) {
                  // Luzinhas suaves (Vermelho Natal ou Verde Pinheiro)
                  ctx.fillStyle = Math.random() > 0.5 ? '#fca5a5' : '#86efac'; 
              } else {
                  // Neve branca pura
                  ctx.fillStyle = '#ffffff';
              }

              ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
              ctx.fill();
              
              // Movimento da neve (sempre cai)
              p.y += p.speedY;
              // Movimento lateral (senoide) para parecer folha caindo
              p.x += Math.sin(p.y * 0.01) * 0.5 + p.speedX;
              
              if (p.y > canvas.height) {
                  p.y = -5;
                  p.x = Math.random() * canvas.width;
              }
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
  }, [currentTheme, isChristmasMode]); // Atualiza se mudar o tema OU virar Natal

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