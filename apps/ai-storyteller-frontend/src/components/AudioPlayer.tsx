import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
  autoPlay?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  audioUrl, 
  autoPlay = false 
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
    <div className="audio-player bg-white rounded-2xl shadow-lg p-6 border-4 border-primary-yellow">
      <audio
        key={audioUrl} // Force re-render when URL changes
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Volume2 className="w-6 h-6 text-primary-purple" />
          <span className="text-sm font-medium text-gray-700">Story Narration</span>
        </div>
        
        <button
          onClick={togglePlay}
          className="playful-button bg-gradient-to-r from-primary-purple to-primary-pink text-white"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          {isPlaying ? 'Pause Story' : 'Play Story'}
        </button>
      </div>

      <div className="bg-gray-200 rounded-full h-2 mb-2">
        <div 
          className="bg-gradient-to-r from-primary-purple to-primary-pink h-2 rounded-full transition-all duration-300"
          style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
        />
      </div>
    </div>
  );
};