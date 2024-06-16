import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faStepBackward, faStepForward, faStar as faStarFilled, faVolumeUp, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons'; // Importē tukšo zvaigznes ikonu
import axios from 'axios';
import "./Banner.css";
import ShareSong from './ShareSong';

const MusicBanner = ({ currentSong, isPlaying, onPlayPause, onNext, onPrevious, onFavoriteToggle, audioRef, handleSeek }) => {
  const [progress, setProgress] = useState(0); // Sākotnējā progresija 0%
  const [currentTime, setCurrentTime] = useState("0:00"); // Sākotnējais pašreizējais laiks 0:00
  const [totalDuration, setTotalDuration] = useState("0:00"); // Sākotnējais kopējais ilgums 0:00
  const [volume, setVolume] = useState(50); // Sākotnējais skaļums iestatīts uz 50%
  const [showVolumeControl, setShowVolumeControl] = useState(false); // Stāvoklis, lai izsekotu skaļuma kontroles redzamību
  const [showShareModal, setShowShareModal] = useState(false); // Stāvoklis, lai izsekotu dalīšanās modalā redzamību
  const [isFavorite, setIsFavorite] = useState(false); // Stāvoklis, lai izsekotu vai dziesma ir favorīts

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (currentSong) {
        try {
          const response = await axios.post('http://localhost/backend/checkFavoriteStatus.php', {
            songId: currentSong.song_id
          }, {
            withCredentials: true
          });
          setIsFavorite(response.data.isFavorite); // Iestatīt favorīta statusu no atbildes
        } catch (error) {
          console.error('Error checking favorite status:', error);
        }
      }
    };

    checkFavoriteStatus(); // Pārbaudīt favorīta statusu
  }, [currentSong]);

  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      if (currentSong && audio.duration && isPlaying) {
        const percentage = (audio.currentTime / audio.duration) * 100;
        setProgress(percentage); // Atjaunināt progresu
        setCurrentTime(formatTime(audio.currentTime)); // Atjaunināt pašreizējo laiku
        setTotalDuration(formatTime(audio.duration)); // Atjaunināt kopējo ilgumu
      }
    };

    const interval = setInterval(updateProgress, 1000); // Atjaunināt katru sekundi

    return () => clearInterval(interval); // Tīrīšana
  }, [isPlaying, currentSong, audioRef]); // Pievieno audioRef kā atkarību

  // Laika formāta funkcija, lai konvertētu sekundes uz mm:ss formātu
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${formattedSeconds}`;
  };

  // Funkcija, lai apstrādātu skaļuma maiņu
  const handleVolumeChange = (event) => {
    const newVolume = event.target.value;
    audioRef.current.volume = newVolume / 100;
    setVolume(newVolume);
  };

  // Funkcija, lai pārslēgtu skaļuma kontroles redzamību
  const toggleVolumeControl = () => {
    setShowVolumeControl(!showVolumeControl);
  };

  const handleFavoriteToggleClick = async () => {
    try {
      await onFavoriteToggle(isFavorite);
      setIsFavorite(!isFavorite); // Pārslēgt favorīta statusu
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
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
        <button onClick={onPrevious}>
          <FontAwesomeIcon icon={faStepBackward} />
        </button>
        <button onClick={onPlayPause}>
          <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
        </button>
        <button onClick={onNext}>
          <FontAwesomeIcon icon={faStepForward} />
        </button>
        <button onClick={handleFavoriteToggleClick}>
          <FontAwesomeIcon icon={isFavorite ? faStarFilled : faStarEmpty} className='favorite' />
        </button>
        <button onClick={() => setShowShareModal(true)}>
          <FontAwesomeIcon icon={faShareAlt} />
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
      {currentSong && (
        <ShareSong
          show={showShareModal}
          handleClose={() => setShowShareModal(false)}
          songId={currentSong.song_id}
        />
      )}
    </div>
  );
};

export default MusicBanner;
