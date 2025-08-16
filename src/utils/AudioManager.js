// src/utils/AudioManager.js
let audioInstance = null;
let isPlaying = false;

export const initAudio = () => {
  if (!audioInstance) {
    audioInstance = new Audio(require('../assets/birthday-song.mp3'));
    audioInstance.loop = true;
    audioInstance.volume = 0.5;
  }
  return audioInstance;
};

export const playAudio = () => {
  if (audioInstance && !isPlaying) {
    audioInstance.play()
      .then(() => isPlaying = true)
      .catch(e => console.log("Autoplay blocked:", e));
  }
};

export const pauseAudio = () => {
  if (audioInstance) {
    audioInstance.pause();
    isPlaying = false;
  }
};