import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import MusicBanner from './components/MusicBanner';
import Playlist from './components/Playlist';
import Home from './components/Home';
import MusicUploader from './components/Upload';
import LoginForm from './components/Login/Login';
import './App.css';
import axios from 'axios';

axios.defaults.withCredentials = true;

function App() {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio()); // Create a ref for the Audio object
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('http://localhost/backend/checkSession.php');
        const data = await response.json();
        setIsLoggedIn(data.isLoggedIn);
        console.log(data)
      } catch (error) {
        console.error('Error:', error);
      }
    };

    checkSession();
  }, []);

  // Function to handle login
  const handleLogin = (isSet) => {
    // Perform login logic here
    // For example, check if PHP session is initiated
    // If session is initiated, set isLoggedIn to true
    setIsLoggedIn(isSet);
  };


  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost/backend/logout.php');
      const data = await response.json();
      if (data.success) {
        setIsLoggedIn(false); // Set isLoggedIn state to false
        console.log("Logout successful")
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  // Conditional rendering based on login status
  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const handlePlayback = (song) => {
    console.log(song);
    const audio = audioRef.current;
    audio.src = `http://localhost/backend/${song.file_path}`;
    audio.play();
    setCurrentSong(song);
    setIsPlaying(true);
  };
  
  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(prevState => !prevState);
  };

  const handleSeek = (event) => {
    const newPosition = event.target.value;
    const audio = audioRef.current;
    if (!isNaN(audio.duration) && isFinite(audio.duration)) {
      const newTime = (newPosition / 100) * audio.duration;
      audio.currentTime = newTime;
    } else {
      // Handle the case where audio duration is not a finite number
      console.error("Audio duration is not a finite number.");
    }
  };

  return (
    <div>
      <Header handleLogout = {handleLogout}/>
      <Routes>
        <Route path="/playlist" element={<Playlist handlePlayback={handlePlayback} />} />
        <Route path="/home" element={<Home handlePlayback={handlePlayback} />} />
        <Route path="/upload" element={<MusicUploader />} />
      </Routes>
      <MusicBanner
        currentSong={currentSong}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        audioRef={audioRef}
        handleSeek={handleSeek}
      />
    </div>
  );
}

export default App;




// import React, { useState } from 'react';
// import './index.css';

// const MusicPlayer = () => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [progress, setProgress] = useState(0);

//   const handlePlayPause = () => {
//     setIsPlaying(!isPlaying);
//   };

//   const handlePrevious = () => {
//     // Your logic for playing the previous song
//   };

//   const handleNext = () => {
//     // Your logic for playing the next song
//   };

//   const handleProgress = (e) => {
//     const newProgress = e.target.value;
//     setProgress(newProgress);
//   };

//   return (
//     <div className="music-player">
//       <div className="logo">
//         <img src="logo.png" alt="logo" />
//         <span>The Weeknd • Starboy • 2016</span>
//       </div>
//       <div className="controls">
//         <div className="song-info">
//           <div className="song-name">Hard On Yourself</div>
//           <div className="artist-name">Charlie Puth & blackbear</div>
//         </div>
//         <div className="buttons">
//           <button onClick={handlePrevious}>Previous</button>
//           <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
//           <button onClick={handleNext}>Next</button>
//         </div>
//       </div>
//       <div className="progress-bar">
//         <input type="range" min="0" max="100" value={progress} onChange={handleProgress} />
//       </div>
//       <div className="song-duration">1:25</div>
//       <div className="singer-info">
//         <span className="singer-name">Charlie Puth & blackbear</span>
//         <span className="song-title">Hard On Yourself</span>
//       </div>
//     </div>
//   );
// };

// export default MusicPlayer;