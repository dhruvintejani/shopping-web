import { memo } from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export const Logo = memo(function Logo({ className = '', variant = 'light' }: LogoProps) {
  const textColor = variant === 'light' ? '#ffffff' : '#1a1a2e';
  const accentColor = '#f97316';

  return (
    <svg
      viewBox="0 0 120 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Shoply logo"
    >
      {/* Shopping bag icon */}
      <path
        d="M8 10C8 7.79086 9.79086 6 12 6H20C22.2091 6 24 7.79086 24 10V24C24 26.2091 22.2091 28 20 28H12C9.79086 28 8 26.2091 8 24V10Z"
        fill={accentColor}
      />
      <path
        d="M12 10V8C12 5.79086 13.7909 4 16 4C18.2091 4 20 5.79086 20 8V10"
        stroke={textColor}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="14" cy="18" r="1.5" fill={textColor} />
      <circle cx="18" cy="18" r="1.5" fill={textColor} />
      
      {/* Text "Shoply" */}
      <text
        x="30"
        y="22"
        fill={textColor}
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="18"
        fontWeight="700"
        letterSpacing="-0.5"
      >
        Shoply
      </text>
    </svg>
  );
});
