import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2 } from "lucide-react";

interface AudioPlayerProps {
  audioUrl: string;
  autoPlay?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  autoPlay = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Reset player state when audio URL changes
  useEffect(() => {
    if (audioRef.current) {
      // Stop current playback
      audioRef.current.pause();
      audioRef.current.currentTime = 0;

      // Reset states
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);

      // Load new audio
      audioRef.current.load();

      // Auto-play new audio if enabled
      if (autoPlay) {
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play();
            setIsPlaying(true);
          }
        }, 100);
      }
    }
  }, [audioUrl, autoPlay]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  return (
    <div className="audio-player bg-gradient-to-br from-cream-50 to-cream-100 rounded-xl shadow-page p-6 md:p-8 border-2 border-earth-300">
      <audio
        key={audioUrl} // Force re-render when URL changes
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-lavender-100 rounded-lg">
            <Volume2 className="w-6 h-6 text-lavender-600" />
          </div>
          <span className="text-lg font-semibold text-earth-800 font-display">
            Listen to Your Story
          </span>
        </div>

        <button
          onClick={togglePlay}
          className="storybook-button bg-gradient-to-r from-lavender-400 to-lavender-500 hover:from-lavender-500 hover:to-lavender-600 text-white flex items-center gap-2"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
          <span className="font-display font-semibold">
            {isPlaying ? "Pause" : "Play"}
          </span>
        </button>
      </div>

      <div className="bg-earth-200 rounded-full h-3 overflow-hidden shadow-inner">
        <div
          className="bg-gradient-to-r from-lavender-400 to-lavender-500 h-3 rounded-full transition-all duration-300 shadow-sm"
          style={{
            width: duration > 0 ? `${(currentTime / duration) * 100}%` : "0%",
          }}
        />
      </div>
    </div>
  );
};
