import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import BirthdayParticles from './pages/BirthdayParticles';
import StarryNight from './pages/StarryNight';
import FinalMessage from './components/FinalMessage';
import birthdaySong from './assets/birthday-song.mp3';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

// Global audio instance
let globalAudio = null;

export default function App() {
  const location = useLocation();
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showMusicButton, setShowMusicButton] = useState(false);

  // Initialize audio (runs only once)
  useEffect(() => {
    if (!globalAudio) {
      globalAudio = new Audio(birthdaySong);
      globalAudio.loop = true;
      globalAudio.volume = 0.5;
      
      // Try to play automatically (won't work on iOS)
      globalAudio.play()
        .then(() => setIsMusicPlaying(true))
        .catch(e => console.log("Autoplay blocked:", e));
    }

    // Show music button after delay
    const timer = setTimeout(() => setShowMusicButton(true),);
    return () => clearTimeout(timer);
  }, []);

  const toggleMusic = () => {
    if (isMusicPlaying) {
      globalAudio.pause();
    } else {
      // This will work on iOS because it's triggered by user gesture
      globalAudio.play()
        .then(() => setIsMusicPlaying(true))
        .catch(e => console.log("Play failed:", e));
    }
    setIsMusicPlaying(!isMusicPlaying);
  };

  return (
    <>
      {/* Music toggle button (shown on both pages) */}
      {showMusicButton && (
        <button 
          onClick={toggleMusic}
          className="fixed top-4 right-4 z-50 p-3 bg-black bg-opacity-50 rounded-full text-white focus:outline-none"
          aria-label={isMusicPlaying ? "Mute music" : "Play music"}
        >
          {isMusicPlaying ? <FaVolumeUp size={24} /> : <FaVolumeMute size={24} />}
        </button>
      )}

      <Routes location={location} key={location.key}>
        <Route path="/" element={<BirthdayParticles />} />
        <Route path="/stars" element={<StarryNight />} />
      </Routes>
      
      {location.pathname === "/stars" && <FinalMessage />}
    </>
  );
}