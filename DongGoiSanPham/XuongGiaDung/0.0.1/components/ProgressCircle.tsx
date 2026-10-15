import React from 'react';
interface Props {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}
export const ProgressCircle: React.FC<Props> = ({ progress, size = 60, strokeWidth = 4, color = "#000" }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(0,0,0,0.05)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 0.3s ease' }}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-[11px] font-black text-black tracking-tighter">
        {Math.round(progress)}%
      </span>
    </div>
  );
};