import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Prize } from '@/data/mockData';

interface SpinWheelProps {
  spinning: boolean;
  targetIndex: number;
  onFinished: () => void;
  prizes: Prize[];
}

const SpinWheel = ({ spinning, targetIndex, onFinished, prizes }: SpinWheelProps) => {
  const hasTriggered = useRef(false);
  const SEGMENT_COUNT = prizes.length;
  const SEGMENT_ANGLE = 360 / SEGMENT_COUNT;

  useEffect(() => {
    if (spinning) hasTriggered.current = false;
  }, [spinning]);

  const targetRotation = 360 * 6 + (360 - targetIndex * SEGMENT_ANGLE - SEGMENT_ANGLE / 2);

  return (
    <div className="relative w-[300px] h-[300px] md:w-[460px] md:h-[460px] flex items-center justify-center select-none">
      {/* Glow effect when spinning */}
      <motion.div
        animate={spinning ? { opacity: [0.3, 0.7, 0.3], scale: [1, 1.08, 1] } : { opacity: 0, scale: 1 }}
        transition={spinning ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.5 }}
        className="absolute inset-[-20px] md:inset-[-30px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(201,151,44,0.35) 0%, rgba(16,111,151,0.2) 50%, transparent 70%)',
          filter: 'blur(18px)',
        }}
      />

      {/* Outer gold ring */}
      <div className="absolute inset-0 rounded-full border-[10px] md:border-[14px] border-secondary shadow-2xl z-10 pointer-events-none" />

      {/* Pointer triangle */}
      <div className="absolute -top-3 md:-top-4 left-1/2 -translate-x-1/2 z-30">
        <div
          className="w-7 h-9 md:w-9 md:h-11 bg-secondary"
          style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}
        />
      </div>

      {/* Wheel */}
      <motion.div
        animate={spinning ? { rotate: targetRotation } : { rotate: 0 }}
        transition={spinning ? { duration: 4.5, ease: [0.15, 0, 0.15, 1] } : { duration: 0 }}
        onAnimationComplete={() => {
          if (spinning && !hasTriggered.current) {
            hasTriggered.current = true;
            onFinished();
          }
        }}
        className="w-full h-full rounded-full relative overflow-hidden border-4 border-primary"
        style={{ transformOrigin: 'center center' }}
      >
        <svg viewBox="0 0 500 500" className="w-full h-full">
          <defs>
            {prizes.map((_, i) => {
              const midAngle = i * SEGMENT_ANGLE - 90 + SEGMENT_ANGLE / 2;
              const midRad = (midAngle * Math.PI) / 180;
              // Path from outer edge toward center
              const outerR = 230;
              const innerR = 60;
              const ox = 250 + outerR * Math.cos(midRad);
              const oy = 250 + outerR * Math.sin(midRad);
              const ix = 250 + innerR * Math.cos(midRad);
              const iy = 250 + innerR * Math.sin(midRad);
              return (
                <path
                  key={`tp-${i}`}
                  id={`textPath-${i}`}
                  d={`M${ox},${oy} L${ix},${iy}`}
                />
              );
            })}
          </defs>

          {prizes.map((prize, i) => {
            const startAngle = i * SEGMENT_ANGLE - 90;
            const endAngle = startAngle + SEGMENT_ANGLE;
            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;
            const x1 = 250 + 250 * Math.cos(startRad);
            const y1 = 250 + 250 * Math.sin(startRad);
            const x2 = 250 + 250 * Math.cos(endRad);
            const y2 = 250 + 250 * Math.sin(endRad);
            const largeArc = SEGMENT_ANGLE > 180 ? 1 : 0;
            const path = `M250,250 L${x1},${y1} A250,250 0 ${largeArc},1 ${x2},${y2} Z`;

            const isEven = i % 2 === 0;
            const fill = isEven ? '#106f97' : '#ffffff';
            const textColor = isEven ? '#ffffff' : '#106f97';

            return (
              <g key={prize.id}>
                <path d={path} fill={fill} stroke="#106f97" strokeWidth="1" />
                <text
                  fill={textColor}
                  fontSize="11"
                  fontWeight="700"
                  style={{ fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '-0.01em' }}
                >
                  <textPath
                    href={`#textPath-${i}`}
                    startOffset="10%"
                  >
                    {prize.name}
                  </textPath>
                </text>
              </g>
            );
          })}
        </svg>
      </motion.div>

      {/* Center pin */}
      <div className="absolute z-20 w-10 h-10 md:w-14 md:h-14 bg-background rounded-full border-4 border-secondary flex items-center justify-center shadow-lg">
        <div className="w-2 h-2 md:w-3 md:h-3 bg-primary rounded-full" />
      </div>
    </div>
  );
};

export default SpinWheel;
