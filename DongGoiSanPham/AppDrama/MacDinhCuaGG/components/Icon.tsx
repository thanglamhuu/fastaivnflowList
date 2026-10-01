import React from 'react';
interface IconProps {
  name: string;
  size?: number;
  className?: string;
  invert?: boolean;
}
export const Icon: React.FC<IconProps> = ({ name, size = 20, className = "", invert = true }) => {
  // Map internal icon names to the specific requested SVG path format
  // Mapping 'auto_awesome' to 'spark' as requested by the user
  const iconName = name === 'auto_awesome' ? 'spark' : name;
  const src = `https://fonts.gstatic.com/s/i/short-term/release/googlesymbols/${iconName}/default/24px.svg`;
  // Check if a specific opacity is already provided in the className to avoid double-application
  const hasOpacity = className.includes('opacity-');
  return (
    <img 
      src={src} 
      alt={name}
      className={`select-none pointer-events-none inline-block ${!hasOpacity ? 'opacity-60' : ''} ${className}`}
      style={{ 
        width: `${size}px`,
        height: `${size}px`,
        // Icons are black by default; invert them for dark mode unless specified (e.g. for light surfaces)
        filter: invert ? 'invert(1)' : 'none' 
      }}
    />
  );
};