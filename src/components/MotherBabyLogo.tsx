import React from 'react';

interface MotherBabyLogoProps {
  className?: string;
  size?: number | string;
  variant?: 'badge' | 'icon' | 'emblem';
}

/**
 * Custom Mother & Baby Vector Logo & App Icon
 * Depicts a mother tenderly cradling and looking down at her sleeping baby in a warm maternal embrace.
 */
export const MotherBabyLogo: React.FC<MotherBabyLogoProps> = ({
  className = '',
  size = 40,
  variant = 'badge'
}) => {
  const pixelSize = typeof size === 'number' ? `${size}px` : size;

  if (variant === 'icon') {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: pixelSize, height: pixelSize }}
        className={`shrink-0 ${className}`}
      >
        <defs>
          <linearGradient id="mbGradPure" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="50%" stopColor="#e11d48" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>
        </defs>

        {/* Mother Head */}
        <circle cx="48" cy="26" r="13" fill="currentColor" />

        {/* Mother Hair Sweep */}
        <path
          d="M 38 23 C 36 34, 30 42, 23 54 C 20 60, 22 66, 26 68 C 29 70, 33 66, 36 60 C 40 52, 42 42, 42 34 Z"
          fill="currentColor"
          opacity="0.85"
        />

        {/* Mother Back & Body Arch */}
        <path
          d="M 39 36 C 30 48, 24 64, 25 78 C 26 86, 33 91, 44 91 C 58 91, 72 87, 81 78 C 86 73, 85 66, 80 62 C 75 58, 69 62, 63 67 C 54 74, 44 75, 39 69 C 36 65, 36 56, 43 45 C 47 39, 45 35, 39 36 Z"
          fill="currentColor"
        />

        {/* Mother Embracing Arm Cradling Baby */}
        <path
          d="M 45 46 C 53 43, 64 47, 72 53 C 78 57, 81 65, 78 72 C 75 79, 68 83, 61 83 C 54 83, 49 79, 47 73 C 45 67, 49 61, 55 60 C 60 59, 66 61, 68 66"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Swaddled Baby Head */}
        <circle cx="58" cy="52" r="8.5" fill="currentColor" />

        {/* Baby Peaceful Eye (sleeping) */}
        <path
          d="M 55 53 Q 57 55 59 53"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Little Heart Accent / Sparkle of Love */}
        <path
          d="M 69 22 C 69 19, 72 17, 75 17 C 77 17, 79 18, 80 20 C 81 18, 83 17, 85 17 C 88 17, 91 19, 91 22 C 91 26, 84 31, 80 34 C 76 31, 69 26, 69 22 Z"
          fill="#f43f5e"
        />
      </svg>
    );
  }

  // Default Badge Variant (Full App Icon Style with Gradient Background)
  return (
    <div
      style={{ width: pixelSize, height: pixelSize }}
      className={`relative rounded-2xl bg-gradient-to-br from-rose-500 via-rose-600 to-amber-500 p-1 flex items-center justify-center shadow-sm select-none overflow-hidden shrink-0 ${className}`}
    >
      {/* Subtle Inner Glow */}
      <div className="absolute inset-0 bg-white/15 rounded-2xl pointer-events-none" />

      {/* SVG Emblem */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-white drop-shadow-xs"
      >
        <defs>
          <linearGradient id="goldHeart" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>

        {/* Mother Head */}
        <circle cx="46" cy="27" r="12" fill="white" />

        {/* Mother Soft Hair Profile */}
        <path
          d="M 37 23 C 35 33, 29 42, 22 53 C 20 58, 22 63, 26 65 C 29 66, 33 63, 35 58 C 39 49, 41 40, 41 33 Z"
          fill="white"
          opacity="0.9"
        />

        {/* Mother Back & Caring Body Curve */}
        <path
          d="M 38 36 C 29 47, 23 62, 24 76 C 25 84, 32 89, 43 89 C 57 89, 71 85, 80 76 C 85 71, 84 64, 79 61 C 74 57, 68 61, 62 66 C 53 72, 44 73, 39 67 C 36 63, 36 55, 42 45 C 46 39, 44 35, 38 36 Z"
          fill="white"
        />

        {/* Cradling Arms / Swaddle */}
        <path
          d="M 44 46 C 52 43, 63 47, 71 53 C 77 57, 79 65, 76 71 C 73 77, 67 81, 60 81 C 53 81, 48 77, 46 71 C 44 65, 48 60, 54 59 C 59 58, 65 60, 67 65"
          stroke="white"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Sleeping Baby Head */}
        <circle cx="57" cy="52" r="8" fill="white" />

        {/* Baby Peaceful Sleeping Eye */}
        <path
          d="M 54.5 53.5 Q 56.5 55 58.5 53.5"
          stroke="#e11d48"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Golden Heart of Love */}
        <path
          d="M 68 21 C 68 18, 71 16, 74 16 C 76 16, 78 17, 79 19 C 80 17, 82 16, 84 16 C 87 16, 90 18, 90 21 C 90 25, 83 30, 79 33 C 75 30, 68 25, 68 21 Z"
          fill="url(#goldHeart)"
        />
      </svg>
    </div>
  );
};
