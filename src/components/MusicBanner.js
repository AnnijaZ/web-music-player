import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faStepBackward, faStepForward, faStar, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import "./Banner.css";

const MusicBanner = ({ currentSong, isPlaying, onPlayPause, onNext, onPrevious, onFavoriteToggle, audioRef, handleSeek }) => {
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [totalDuration, setTotalDuration] = useState("0:00");
  const [volume, setVolume] = useState(50); // Initial volume set to 50%
  const [showVolumeControl, setShowVolumeControl] = useState(false); // State to track visibility of volume control

  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      if (audio.duration && isPlaying) {
        const percentage = (audio.currentTime / audio.duration) * 100;
        setProgress(percentage);
        setCurrentTime(formatTime(audio.currentTime));
        setTotalDuration(formatTime(audio.duration));
      }
    };

    const interval = setInterval(updateProgress, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup
  }, [isPlaying]);

  // Format time function to convert seconds to mm:ss format
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${formattedSeconds}`;
  };

  // Function to handle volume change
  const handleVolumeChange = (event) => {
    const newVolume = event.target.value;
    audioRef.current.volume = newVolume / 100;
    setVolume(newVolume);
  };

  // Function to toggle visibility of volume control
  const toggleVolumeControl = () => {
    setShowVolumeControl(!showVolumeControl);
  };

  // Function to handle skipping to the start of the song
  const handleSkipToStart = () => {
    audioRef.current.currentTime = 0;
  };

  return (
    <div className="music-banner">
      {currentSong && (
        <div className="song-info">
          <h3>{currentSong.song_title}</h3>
          <p>{currentSong.artist}</p>
        </div>
      )}
      <div className="controls">
        <button onClick={handleSkipToStart}>
          <FontAwesomeIcon icon={faStepBackward} />
        </button>
        <button onClick={onPlayPause}>
          <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
        </button>
        <button onClick={onNext}>
          <FontAwesomeIcon icon={faStepForward} />
        </button>
        <button onClick={onFavoriteToggle}>
          <FontAwesomeIcon icon={faStar} className='favorite' />
        </button>
      </div>
      <span>{currentTime}</span>
      <div className="progress-bar">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
        />
      </div>
      <span>{totalDuration}</span>
      <div className="volume-control">
        <button onClick={toggleVolumeControl}>
          <FontAwesomeIcon icon={faVolumeUp} />
        </button>
        {showVolumeControl && (
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
          />
        )}
      </div>
    </div>
  );
};

export default MusicBanner;
