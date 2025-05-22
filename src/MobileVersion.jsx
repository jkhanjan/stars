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
  const [isResetting, setIsResetting] = useState(false);
  const animationDuration = 1.5;
  const resetDelay = 200;
  const scrollContainerRef = useRef(null);
  const timeoutRef = useRef(null);
  const [reachedPoints, setReachedPoints] = useState([0]); 

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (isResetting) return;
    
    setIsAnimating(true);
    
    timeoutRef.current = setTimeout(() => {
      if (activeSegment < points.length - 1) {
        setReachedPoints(prev => [...prev, activeSegment + 1]);
        setActiveSegment(prev => prev + 1);
      } else {
        setIsResetting(true);
        
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo({
            left: 1,
            behavior: 'smooth'
          });
        }
        
        setTimeout(() => {
          setActiveSegment(-1);
          setReachedPoints([0]);
          setIsResetting(false);
        }, resetDelay);
      }
    }, animationDuration * 1000);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [activeSegment, isResetting]);

  const fullDashedPath = [];
  for (let i = 0; i < points.length - 1; i++) {
    fullDashedPath.push(createPathSegment(points[i], points[i + 1]));
  }

  const paths = [];
  for (let i = 0; i < activeSegment + 1 && i < points.length - 1; i++) {
    paths.push({
      id: `path-${i}`,
      d: createPathSegment(points[i], points[i + 1]),
      animate: i === activeSegment && !isResetting
    });
  }

  useEffect(() => {
    if (!isResetting && scrollContainerRef.current && activeSegment > 0) {
      const scrollTo = Math.max(0, points[activeSegment].x - 100);
      scrollContainerRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  }, [activeSegment, isResetting]);

  return (
    <div
      ref={scrollContainerRef}
      className="overflow-x-auto whitespace-nowrap w-full h-fit"
      style={{
        scrollBehavior: "smooth",
        overflowX: "auto",
        whiteSpace: "nowrap",
        width: "100%"
      }}
    >
      <svg width="1000" height="200" style={{ background: "#fff" }}>
        {fullDashedPath.map((path, i) => (
          <path
            key={`dashed-${i}`}
            d={path}
            stroke="#E5E7EB"
            strokeWidth="3"
            strokeDasharray="5,5"
            fill="transparent"
          />
        ))}

        {paths.map((path, i) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="#1E63E7"
            strokeWidth="3"
            fill="transparent"
            initial={{ pathLength: path.animate ? 0 : 1 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: path.animate ? animationDuration : 0 }}
          />
        ))}

        {points.map((p, i) => (
          <motion.g key={`point-${i}`}>
            <motion.circle
              cx={p.x}
              cy={p.y}
              r="42"
              fill="#F5F5F5"
              initial={{ scale: 1 }}
              animate={{ 
                scale: i === activeSegment && !isResetting ? [1, 1.1, 1] : 1 
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
              initial={{ fill: "#6A9DFE", scale: 1 }}
              animate={{ 
                fill: reachedPoints.includes(i) ? "#1E63E7" : "#6A9DFE",
                scale: i === activeSegment && !isResetting ? [1, 1.2, 1] : 1 
              }}
              transition={{ 
                duration: 0.3,
                ease: "easeInOut"
              }}
            />

            <motion.foreignObject
              x={p.x - 75}
              y={p.y + 60}
              width="150"
              height="70" 
              initial={{ opacity: 0.5 }}
              animate={{ opacity: reachedPoints.includes(i) || i === activeSegment ? 1 : 0.5 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{ 
                textAlign: "center", 
                fontSize: "15px", 
                color: "black", 
                wordWrap: "break-word",
                whiteSpace: "normal", 
                fontWeight: "normal",
                lineHeight: "1.2",
                padding: "0 5px"
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

