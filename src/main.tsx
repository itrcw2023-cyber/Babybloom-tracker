import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Automated migration and legacy cache cleanup for BabyBloom Tracker
try {
  const legacyProfile = localStorage.getItem('cf_profile');
  if (legacyProfile) {
    // Purge all legacy "cf_*" keys
    const keysToRemove = ['cf_profile', 'cf_forum', 'cf_symptoms', 'cf_weights', 'cf_appointments', 'cf_photos', 'cf_reminders', 'cf_hospital_bag', 'cf_kicks', 'bb_show_community'];
    keysToRemove.forEach(k => localStorage.removeItem(k));
    
    // Delete legacy IndexedDB if exists
    if (typeof window !== 'undefined' && window.indexedDB) {
      window.indexedDB.deleteDatabase('CatherineFayeUpdatesDB');
    }
  }
} catch {
  // Safe storage catch
}

createRoot(document.getElementById('root')!).render(<App />);

// Register Service Worker with instant update check
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      // Check for worker updates on every page load
      registration.update().catch(() => {});
    }).catch((err) => {
      console.log('ServiceWorker registration note:', err);
    });
  });
}
