import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MagneticProps {
  children: React.ReactElement;
  range?: number; // Distance ratio (higher means more magnetic pull)
}

export const Magnetic = ({ children, range = 0.35 }: MagneticProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    // Calculate center coordinates of the element
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Distance from mouse to center
    const x = clientX - centerX;
    const y = clientY - centerY;
    
    // Magnetize! Pull towards the cursor by the range ratio
    setPosition({ x: x * range, y: y * range });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ 
        type: 'spring', 
        stiffness: 150, 
        damping: 15, 
        mass: 0.1 
      }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
};
export default Magnetic;
