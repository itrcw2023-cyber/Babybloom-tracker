import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// High-resolution Vector SVG with gorgeous gradient, soft glow, and maternal heart emblem
const regularSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff1f2" />
      <stop offset="50%" stop-color="#fecdd3" />
      <stop offset="100%" stop-color="#f43f5e" />
    </linearGradient>
    <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#ffe4e6" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#881337" flood-opacity="0.25" />
    </filter>
  </defs>
  
  <!-- Rounded Base -->
  <rect width="512" height="512" rx="110" fill="url(#bgGrad)" />
  
  <!-- Subtle inner border -->
  <rect x="12" y="12" width="488" height="488" rx="98" fill="none" stroke="#ffffff" stroke-width="4" stroke-opacity="0.6" />

  <!-- Central Heart & Mother Emblem -->
  <g filter="url(#shadow)">
    <!-- Main Glow Shield -->
    <circle cx="256" cy="256" r="150" fill="#ffffff" fill-opacity="0.95" />
    
    <!-- Pregnant Mother & Baby Heart Art -->
    <path d="M256 160 C 230 120, 175 125, 155 165 C 130 215, 170 270, 256 340 C 342 270, 382 215, 357 165 C 337 125, 282 120, 256 160 Z" fill="url(#bgGrad)" />
    
    <!-- Little Baby Footprint / Sparkle -->
    <circle cx="256" cy="235" r="22" fill="#ffffff" />
    <path d="M256 215 L 261 228 L 274 233 L 261 238 L 256 251 L 251 238 L 238 233 L 251 228 Z" fill="#f43f5e" />
  </g>
</svg>
`;

// Maskable version with 20% safe zone padding around key elements
const maskableSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff1f2" />
      <stop offset="40%" stop-color="#fda4af" />
      <stop offset="100%" stop-color="#e11d48" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#881337" flood-opacity="0.2" />
    </filter>
  </defs>
  
  <!-- Full Background for Maskable Icon -->
  <rect width="512" height="512" fill="url(#bgGrad)" />
  
  <!-- Centered Safe Zone Graphics (within center 60%) -->
  <g filter="url(#shadow)">
    <circle cx="256" cy="256" r="115" fill="#ffffff" fill-opacity="0.96" />
    <path d="M256 182 C 236 150, 192 155, 178 186 C 158 226, 190 268, 256 322 C 322 268, 354 226, 334 186 C 320 155, 276 150, 256 182 Z" fill="url(#bgGrad)" />
    <circle cx="256" cy="242" r="18" fill="#ffffff" />
    <path d="M256 226 L 260 236 L 270 240 L 260 244 L 256 254 L 252 244 L 242 240 L 252 236 Z" fill="#e11d48" />
  </g>
</svg>
`;

async function generate() {
  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Regular 512x512
  await sharp(Buffer.from(regularSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  // 2. Regular 192x192
  await sharp(Buffer.from(regularSvg))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  // 3. Apple Touch Icon (180x180)
  await sharp(Buffer.from(regularSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // 4. Maskable 512x512
  await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));

  // 5. SVG icon
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), regularSvg.trim());

  console.log('✅ All PWA Icons generated successfully in /public!');
}

generate().catch(console.error);
