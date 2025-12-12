import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

interface BackgroundMusicProps {
  autoPlay?: boolean;
}

export const BackgroundMusic: React.FC<BackgroundMusicProps> = ({ autoPlay = false }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Using local background music file
  const musicUrl = '/bg_music.mp3';

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // Set to 30% volume for background
      audioRef.current.loop = true;
      
      if (autoPlay) {
        // Try to play, but handle autoplay restrictions
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(() => {
              // Autoplay was prevented, user will need to click
              setIsPlaying(false);
            });
        }
      }
    }
  }, [autoPlay]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <audio ref={audioRef} src={musicUrl} />
      
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="flex gap-2"
      >
        <motion.button
          onClick={togglePlay}
          className="p-4 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all border-2 border-primary-purple"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title={isPlaying ? 'Pause music' : 'Play background music'}
        >
          {isPlaying ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              🎵
            </motion.div>
          ) : (
            <span className="text-2xl">🎵</span>
          )}
        </motion.button>

        {isPlaying && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={toggleMute}
            className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all border-2 border-primary-pink"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-gray-600" />
            ) : (
              <Volume2 className="w-5 h-5 text-gray-600" />
            )}
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};
