import React, { useEffect, useRef, useState } from 'react';
import './DashedPathAnimation.css';

const DashedPathAnimation = () => {
  const canvasRef = useRef(null);
  const [isImagesLoaded, setIsImagesLoaded] = useState(false);
  const [pointsWithImages, setPointsWithImages] = useState([]);
  const [activePoints, setActivePoints] = useState([]);
  
  const initialPoints = [
    { x: 50, y: 50, text: "Point 1", imageSrc: "./Seatbelt.png" },
    { x: 300, y: 50, text: "Point 2", imageSrc: "./Seatbelt.png" },
    { x: 550, y: 50, text: "Point 3", imageSrc: "./Seatbelt.png" },
    { x: 430, y: 250, text: "Point 4", imageSrc: "./Seatbelt.png" },
    { x: 150, y: 250, text: "Point 5", imageSrc: "./Seatbelt.png" }
  ];
  
  const animationRef = useRef();
  const progressRef = useRef(0);
  const lastTimeRef = useRef(0);
  const pointActivationTimesRef = useRef({});

  // Improved settings for animation
  const dashLength = 18;
  const gapLength = 12;
  const dashPattern = [dashLength, gapLength];
  
  const animationSpeed = 0.12; 
  const pointScaleDuration = 0.8; 
  const maxPointScale = 1.25;
  
  // Improved curve settings
  const curveIntensity = 0.4; // Reduced intensity for smoother curves
  const curveAsymmetry = 0.1; // Less asymmetry for more balanced curves

  useEffect(() => {
    const loadImages = async () => {
      try {
        const loadedPoints = await Promise.all(
          initialPoints.map(async (point) => {
            if (point.imageSrc) {
              try {
                const img = new Image();
                img.src = point.imageSrc;
                await new Promise((resolve, reject) => {
                  img.onload = () => resolve();
                  img.onerror = () => {
                    console.error(`Could not load image: ${point.imageSrc}`);
                    reject();
                  };
                });
                
                return { ...point, image: img };
              } catch (error) {
                console.error(`Failed to load image: ${point.imageSrc}`, error);
                return point; 
              }
            }
            return point;
          })
        );
        
        setPointsWithImages(loadedPoints);
        setIsImagesLoaded(true);
      } catch (error) {
        console.error("Error loading images:", error);
        setPointsWithImages(initialPoints);
        setIsImagesLoaded(true);
      }
    };

    loadImages();
  }, []);

  useEffect(() => {
    if (!isImagesLoaded) return;
    
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas ref is null");
      return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error("Could not get 2D context from canvas");
      return;
    }
    
    const draw = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;
    
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const closedLoopPoints = [...pointsWithImages, pointsWithImages[0]];
      
      const pathSegments = calculatePathSegments(closedLoopPoints);
      const totalLength = pathSegments.totalLength;
      const progressPosition = totalLength * progressRef.current;
      
      let cumulativeLength = 0;
      const newActivePoints = [];
      const currentActivationTimes = {...pointActivationTimesRef.current};
      
      for (let i = 0; i < closedLoopPoints.length - 1; i++) {
        const segment = pathSegments.segments[i];
        
        if (progressPosition >= cumulativeLength && !currentActivationTimes[i]) {
          currentActivationTimes[i] = timestamp;
        }
        
        if (currentActivationTimes[i]) {
          const timeSinceActivation = (timestamp - currentActivationTimes[i]) / 1000;
          if (timeSinceActivation < pointScaleDuration) {
            const progress = easeOutElastic(Math.min(timeSinceActivation / pointScaleDuration, 1));
            const scale = 1 + (maxPointScale - 1) * (1 - progress);
            
            newActivePoints.push({
              index: i,
              scale: scale
            });
          }
        }
        
        cumulativeLength += segment.length;
      }
      
      setActivePoints(newActivePoints);
      pointActivationTimesRef.current = currentActivationTimes;
      

      drawDashedPath(ctx, closedLoopPoints, dashPattern, false);
      
      drawAnimatedDashedPath(ctx, closedLoopPoints, dashPattern, progressRef.current);
    
      // Draw points with animation
      pointsWithImages.forEach((point, index) => {
        const activePoint = newActivePoints.find(ap => ap.index === index);
        const scale = activePoint ? activePoint.scale : 1;
        
        ctx.save();
        ctx.translate(point.x, point.y);
        ctx.scale(scale, scale);
        ctx.translate(-point.x, -point.y);
        
        // Draw outer circle (background)
        ctx.beginPath();
        ctx.arc(point.x, point.y, 38, 0, Math.PI * 2);
        ctx.fillStyle = '#f7edda';
        ctx.fill();
    
        // Draw smaller foreground circle
        ctx.beginPath();
        ctx.arc(point.x, point.y, 25, 0, Math.PI * 2);
        
        // Change color based on activation state
        if (currentActivationTimes[index]) {
          const timeSinceActivation = (timestamp - currentActivationTimes[index]) / 1000;
          if (timeSinceActivation < pointScaleDuration) {
            ctx.fillStyle = '#4285f4'; 
          } else {
            ctx.fillStyle = '#4285f4';
          }
        } else {
          
          ctx.fillStyle = '#92b5f3';
        }
        
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
    
        if (point.image) {
          try {
            ctx.drawImage(point.image, point.x - 15, point.y - 15, 30, 30);
          } catch (err) {
            console.error("Error drawing image:", err);
          }
        }
        
        ctx.restore();
    
        ctx.fillStyle = "black";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.fillText(point.text, point.x, point.y + 55);
      });
    
      progressRef.current += deltaTime * animationSpeed;
      if (progressRef.current > 1) {
        progressRef.current = 1; 
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        return;
      }
    
      animationRef.current = requestAnimationFrame(draw);
    };
    
    const drawDashedPath = (ctx, points, pattern, isAnimated) => {
      if (points.length < 2) return;
      
      for (let i = 0; i < points.length - 1; i++) {
        const startPoint = points[i];
        const endPoint = points[i + 1];
        const segment = calculatePathSegments([startPoint, endPoint]);
        
        const dx = endPoint.x - startPoint.x;
        const dy = endPoint.y - startPoint.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const cp1 = {
          x: startPoint.x + dx * 0.35 - dy * curveIntensity,
          y: startPoint.y + dy * 0.35 + dx * curveIntensity
        };
        
        const cp2 = {
          x: startPoint.x + dx * 0.65 + dy * curveIntensity,
          y: startPoint.y + dy * 0.65 - dx * curveIntensity
        };
        
        ctx.beginPath();
        ctx.setLineDash(pattern);
        ctx.strokeStyle = isAnimated ? '#B1E3FF' : '#e0e0e0';
        ctx.lineWidth = 3;
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, endPoint.x, endPoint.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    };
    
    const drawAnimatedDashedPath = (ctx, points, pattern, progress) => {
      if (points.length < 2) return;
      
      const pathSegments = calculatePathSegments(points);
      const totalLength = pathSegments.totalLength;
      const progressPosition = totalLength * progress;
      
      let currentPosition = 0;
      
      for (let segmentIdx = 0; segmentIdx < pathSegments.segments.length; segmentIdx++) {
        const segment = pathSegments.segments[segmentIdx];
        const startPoint = points[segmentIdx];
        const endPoint = points[segmentIdx + 1];
        const segmentLength = segment.length;
        
        if (currentPosition > progressPosition) break;
        
        if (currentPosition + segmentLength < progressPosition) {
          ctx.beginPath();
          ctx.setLineDash(pattern);
          ctx.strokeStyle = '#B1E3FF';
          ctx.lineWidth = 3;
          ctx.moveTo(startPoint.x, startPoint.y);
          ctx.bezierCurveTo(segment.cp1.x, segment.cp1.y, segment.cp2.x, segment.cp2.y, endPoint.x, endPoint.y);
          ctx.stroke();
          ctx.setLineDash([]);
          
          currentPosition += segmentLength;
          continue;
        }
        
        const segmentProgress = (progressPosition - currentPosition) / segmentLength;
        
        const pointOnCurve = getBezierPoint(
          startPoint, 
          segment.cp1, 
          segment.cp2, 
          endPoint, 
          segmentProgress
        );
        
        ctx.beginPath();
        ctx.setLineDash(pattern);
        ctx.strokeStyle = '#B1E3FF';
        ctx.lineWidth = 3;
        ctx.moveTo(startPoint.x, startPoint.y);
        
        const t = segmentProgress;
        const p0 = startPoint;
        const p1 = segment.cp1;
        const p2 = segment.cp2;
        const p3 = endPoint;
        
        const steps = 20;
        const stepT = t / steps;
        
        let prevX = p0.x;
        let prevY = p0.y;
        
        for (let i = 1; i <= steps; i++) {
          const stepProgress = stepT * i;
          const point = getBezierPoint(p0, p1, p2, p3, stepProgress);
          ctx.lineTo(point.x, point.y);
          prevX = point.x;
          prevY = point.y;
        }
        
        ctx.stroke();
        ctx.setLineDash([]);
        
        break;
      }
    };
    
    const calculatePathSegments = (points) => {
      const segments = [];
      let totalLength = 0;
      
      for (let i = 0; i < points.length - 1; i++) {
        const startPoint = points[i];
        const endPoint = points[i + 1];
        const dx = endPoint.x - startPoint.x;
        const dy = endPoint.y - startPoint.y;
        
        const cp1 = {
          x: startPoint.x + dx * 0.35 - dy * curveIntensity,
          y: startPoint.y + dy * 0.35 + dx * curveIntensity
        };
        
        const cp2 = {
          x: startPoint.x + dx * 0.65 + dy * curveIntensity,
          y: startPoint.y + dy * 0.65 - dx * curveIntensity
        };
        
        const length = approximateBezierLength(startPoint, cp1, cp2, endPoint, 30);
        segments.push({ length, startPoint, endPoint, cp1, cp2 });
        totalLength += length;
      }
      
      return { segments, totalLength };
    };
    
    const approximateBezierLength = (p0, p1, p2, p3, steps = 30) => {
      let length = 0;
      let prevX = p0.x;
      let prevY = p0.y;
      
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const point = getBezierPoint(p0, p1, p2, p3, t);
        length += Math.sqrt(Math.pow(point.x - prevX, 2) + Math.pow(point.y - prevY, 2));
        prevX = point.x;
        prevY = point.y;
      }
      
      return length;
    };
    
    const getBezierPoint = (p0, p1, p2, p3, t) => {
      const mt = 1 - t;
      return {
        x: mt*mt*mt*p0.x + 3*mt*mt*t*p1.x + 3*mt*t*t*p2.x + t*t*t*p3.x,
        y: mt*mt*mt*p0.y + 3*mt*mt*t*p1.y + 3*mt*t*t*p2.y + t*t*t*p3.y
      };
    };

    const easeOutElastic = (x) => {
      const c4 = (2 * Math.PI) / 3;
      
      return x === 0
        ? 0
        : x === 1
        ? 1
        : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
    };
    
    animationRef.current = requestAnimationFrame(draw);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isImagesLoaded, pointsWithImages]);
  
  return (
    <div className="animation-container">
      <canvas 
        ref={canvasRef} 
        width={700} 
        height={400}
        style={{ 
          background: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          display: 'block'
        }}
      />
      {!isImagesLoaded && 
        <div style={{
          textAlign: 'center',
          padding: '20px',
          color: '#666'
        }}>
          Loading animation...
        </div>
      }
    </div>
  );
};

export default DashedPathAnimation;