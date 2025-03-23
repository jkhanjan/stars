import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const points = [
  { x: 50, y: 70, label: "Own the road (not just survive it)" },
  { x: 250, y: 70, label: "Road safety is non-negotiable." },
  { x: 450, y: 70, label: "Bad habits? We fix them before they start" },
  { x: 650, y: 70, label: "No theory overload" },
  { x: 850, y: 70, label: "Your first car? Consider it handled" },
];

const createPathSegment = (p1, p2) => {
  const midX = (p1.x + p2.x) / 2;
  const midY = (p1.y + p2.y) / 2;
  const dir = 1; 
  const offset = 30;
  const dx = p2.x - p1.x, dy = p2.y - p1.y;
  const length = Math.sqrt(dx * dx + dy * dy);

  return `M ${p1.x} ${p1.y} 
  S ${midX + dir * offset * (-dy / length)}, ${midY + dir * offset * (dx / length)} ${midX}, ${midY}
  S ${midX - dir * offset * (-dy / length)}, ${midY - dir * offset * (dx / length)} ${p2.x}, ${p2.y}`;
};

const MobileVersion = () => {
  const [activeSegment, setActiveSegment] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationDuration = 1.5;
  const scrollContainerRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (activeSegment < points.length - 2) {
      setIsAnimating(true);
  
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        setActiveSegment(prev => prev + 1);
      }, animationDuration * 1000 + 300);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [activeSegment]);

  const paths = [];
  for (let i = 0; i < activeSegment + 1 && i < points.length - 1; i++) {
    paths.push({
      id: `path-${i}`,
      d: createPathSegment(points[i], points[i + 1]),
      animate: i === activeSegment
    });
  }

  useEffect(() => {
    if (scrollContainerRef.current && activeSegment > 0) {
      const scrollTo = Math.max(0, points[activeSegment].x - 100);
      scrollContainerRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  }, [activeSegment]);

  return (
    <div
      ref={scrollContainerRef}
      className="overflow-x-auto whitespace-nowrap w-full"
      style={{
        scrollBehavior: "smooth",
        overflowX: "auto",
        whiteSpace: "nowrap",
        width: "100%"
      }}
    >
      <svg width="1000" height="200" style={{ background: "#fff" }}>
        {paths.map((path, i) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="red"
            strokeWidth="3"
            fill="transparent"
            initial={{ pathLength: path.animate ? 0 : 1 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: path.animate ? animationDuration : 0 }}
          />
        ))}

        {points.map((p, i) => (
          <motion.g key={`point-${i}`}>
            {/* Background circle */}
            <motion.circle
              cx={p.x}
              cy={p.y}
              r="42"
              fill="rgba(255, 219, 172, 1.0)"
              animate={{ 
                scale: i === activeSegment || i === activeSegment + 1 ? [0.9, 1.1, 1] : 1 
              }}
              transition={{ 
                duration: 0.5,
                ease: "easeInOut"
              }}
            />
            <motion.circle
              cx={p.x}
              cy={p.y}
              r="24"
              initial={{ fill: "rgba(255, 255, 255, 0.2)" }}
              animate={{ 
                fill: i <= activeSegment + 1 ? "rgb(33, 109, 254)" : "rgba(255, 255, 255, 0.2)",
                scale: i === activeSegment || i === activeSegment + 1 ? [0.9, 1.1, 1] : 1.4 
              }}
              transition={{ 
                duration: 0.5,
                ease: "easeInOut"
              }}
            />

            <motion.foreignObject
              x={p.x - 70}
              y={p.y + 60}
              width="150"
              height="50"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: i <= activeSegment + 1 ? 1 : 0.5 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{ 
                textAlign: "center", 
                fontSize: "17px", 
                color: "black", 
                wordWrap: "break-word",
                fontWeight: "normal"
              }}>
                {p.label}
              </div>
            </motion.foreignObject>
          </motion.g>
        ))}
      </svg>
    </div>
  );
};

export default MobileVersion;