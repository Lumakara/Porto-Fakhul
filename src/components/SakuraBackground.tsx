import { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  r: number; // radius / size
  d: number; // density / weight (controls fall speed)
  a: number; // sway / oscillation angle
  step: number; // sway speed
  rotation: number;
  rotationSpeed: number;
  color: string;
  opacity: number;
}

export const SakuraBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    
    const isMobile = width < 768;

    // Dynamic petal count based on screen width (fewer on mobile to save battery)
const maxPetals = width < 768 ? 15 : 40;
    const petals: Petal[] = [];

    const colors = [
      'rgba(255, 183, 197, ', // Light Sakura Pink
      'rgba(255, 117, 151, ', // Vivid Neon Pink
      'rgba(244, 143, 177, ', // Rose Pink
      'rgba(225, 190, 231, ', // Soft Lavender Purple
    ];

    // Helper to generate a new petal
    const createPetal = (isInitial = false): Petal => {
const size = Math.random() * 6 + 3;
      return {
        x: Math.random() * width,
        // If initial, scatter across the screen; otherwise, spawn just above the top border
        y: isInitial ? Math.random() * height : -20,
        r: size,
        d: Math.random() * 0.6 + 0.3, // Fall speed factor
        a: Math.random() * 2 * Math.PI, // Initial sway phase
        step: Math.random() * 0.02 + 0.01, // Sway frequency
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() * 0.8 + 0.2) * (Math.random() > 0.5 ? 1 : -1),
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.4,
      };
    };

    // Initialize particles
    for (let i = 0; i < maxPetals; i++) {
      petals.push(createPetal(true));
    }

    // Handle screen resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Track mouse coordinates
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };
if (!isMobile) {
  window.addEventListener('mousemove', handleMouseMove);
}

    // Render loop
const animate = () => {
  if (isPaused) {
    animationId = requestAnimationFrame(animate);
    return;
  }
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse coordinates tracking (damping/easing)
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      // Draw and update each petal
      petals.forEach((p, idx) => {
        // Draw Petal shape using canvas bezier curves for premium visual organic look
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);

        ctx.beginPath();
        // A classic sakura petal shape made with dual bezier curves
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-p.r * 1.5, -p.r * 0.5, -p.r * 1.5, p.r * 1.5, 0, p.r * 2);
        ctx.bezierCurveTo(p.r * 1.5, p.r * 1.5, p.r * 1.5, -p.r * 0.5, 0, 0);

        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.shadowColor = 'rgba(255, 117, 151, 0.4)';
        ctx.shadowBlur = 1;
        ctx.fill();
        ctx.restore();

        // Update Physics
        p.y += (Math.cos(p.a) + 1.2 + p.d) * 0.8; // Drifts downward naturally
        p.x += Math.sin(p.a) * 0.4; // Sways sideways
        p.a += p.step;
        p.rotation += p.rotationSpeed;

        // Interactive mouse repel
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const repelRadius = 140; // Pixels surrounding mouse that pushes petals

if (!isMobile && distance < repelRadius) {
  const force = (repelRadius - distance) / repelRadius;
  const angle = Math.atan2(dy, dx);

  p.x += Math.cos(angle) * force * 4;
  p.y += Math.sin(angle) * force * 4;
}

        // Recycle petals that drift out of bounds
        if (p.y > height + 20 || p.x > width + 20 || p.x < -20) {
          petals[idx] = createPetal(false);
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();
return () => {
  window.removeEventListener('resize', handleResize);
  if (!isMobile) {
    window.removeEventListener('mousemove', handleMouseMove);
  }
  document.removeEventListener(
    'visibilitychange',
    handleVisibilityChange
  );
  cancelAnimationFrame(animationId);
};
let isPaused = false;

const handleVisibilityChange = () => {
  isPaused = document.hidden;
};

document.addEventListener(
  'visibilitychange',
  handleVisibilityChange
);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[1]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
