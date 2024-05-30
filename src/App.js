import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Button, Modal } from "react-bootstrap";
import Header from './components/Header';
import MusicBanner from './components/MusicBanner';
import Playlist from './components/Playlist';
import Home from './components/Home';
import MusicUploader from './components/Upload';
import LoginForm from './components/Login/Login';
import './App.css';
import Recents from './components/Recents';
import About from './components/About/About';
import axios from 'axios';
import Notification from './components/Notification';
import Favourites from './components/Favourites';
import UploadedSongs from './components/UploadedSongs/UploadedSongs';

axios.defaults.withCredentials = true;

function App() {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio()); // Create a ref for the Audio object
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const [songs, setSongs] = useState([]); // Add state for songs
  const [filteredSongs, setFilteredSongs] = useState([]); // Add state for filtered songs
  const [recentSongs, setRecentSongs] = useState([]); // Add state for recent songs
  const [showModal, setShowModal] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [notification, setNotification] = useState(null);
  const [currentSongId, setCurrentSongId] = useState(null); // Move currentSongId state to App component

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


  useEffect(() => {
    const checkSession = async () => {
      // Check session logic
    };

    checkSession();
  }, []);

  // Function to fetch data from the backend
const fetchData = async () => {
  try {
    const response = await fetch('http://localhost/backend/getData.php');
    const data = await response.json();
    setSongs(data);
    setFilteredSongs(data); // Initialize filteredSongs with all songs initially
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

useEffect(() => {
  fetchData();
}, []);


  // useEffect(() => {
  //   fetch('http://localhost/backend/getData.php')
  //     .then(response => response.json())
  //     .then(data => {
  //       setSongs(data);
  //       setFilteredSongs(data); // Initialize filteredSongs with all songs initially
  //     })
  //     .catch(error => console.error('Error fetching data:', error));
  // }, []);

  const handleSearch = (searchTerm) => {
    // Filter songs based on search term
    const filtered = songs.filter(song => 
      song.song_title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      song.artist.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSongs(filtered); // Update filtered songs
  };

  // Function to handle login
  const handleLogin = (isSet) => {
    // Perform login logic here
    // For example, check if PHP session is initiated
    // If session is initiated, set isLoggedIn to true
    setIsLoggedIn(isSet);
  };

  const fetchPlaylists = () => {
    fetch('http://localhost/backend/getPlaylists.php')
      .then(response => response.json())
      .then(data => setPlaylists(data))
      .catch(error => console.error('Error fetching playlists:', error));
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

  const addToRecentSongs = (song) => {
    setRecentSongs(prevSongs => {
      // Check if the current song is already in the recents list to avoid duplicates
      const exists = prevSongs.find(prevSong => prevSong.song_id === song.song_id);
      if (exists) {
        // Move the existing song to the top without adding it again
        return [song, ...prevSongs.filter(prevSong => prevSong.song_id !== song.song_id)].slice(0, 5);
      } else {
        // Add the new song to the recents, and keep only the last 5 entries
        return [song, ...prevSongs].slice(0, 5);
      }
    });
  };

  const handlePlayback = (song) => {
    console.log(song)
    const audio = audioRef.current;
    audio.src = `http://localhost/backend/${song.file_path}`;
    audio.play();
    setCurrentSong(song);
    setIsPlaying(true);
    addToRecentSongs(song); // Add the currently played song to recent songs
  };
  
  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
      if (currentSong) {
        addToRecentSongs(currentSong); // Add the currently played song to recent songs when it starts playing
      }
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

  // Function to handle adding/removing song from favorites
const handleFavoriteToggle = async (isFavorite) => {
  console.log(isFavorite)
  console.log(currentSong.song_id)
  if (currentSong) {
    try {
      // Assuming you have a state to track whether the song is a favorite
      // const isFavorite = currentSong.favorite === 1; // Assuming 1 indicates true, and 0 indicates false
      const response = await fetch('http://localhost/backend/addToFavorites.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ songId: currentSong.song_id, isFavorite }),
      });
      const data = await response.json();
      console.log(data.message); // Log the response message

      fetchData();
    } catch (error) {
      console.error('Error adding/removing song from favorites:', error);
    }
  } else {
    console.error('No current song to add/remove from favorites');
  }
};

const displayNotification = (message) => {
  setNotification(message);
  setTimeout(() => {
    setNotification(null);
  }, 5000);
};

 // Function to handle adding song to playlist
 const addToPlaylist = (playlistId) => {
  // Check if currentSongId is valid
  if (currentSongId) {
      fetch('http://localhost/backend/addSongPlaylist.php', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ songId: currentSongId, playlistId }),
      })
          .then(response => response.json())
          .then(data => {
              displayNotification(data.message)
              // Close the modal after adding the song
              setShowModal(false);
          })
          .catch(error => console.error('Error adding song to playlist:', error));
  } else {
      console.error('Current song ID is null');
  }
};

  return (
    <div>
      <Header handleLogout = {handleLogout} handleSearch = {handleSearch}/>
      <Routes>
        <Route path="/" element={<Home setCurrentSongId={setCurrentSongId} handlePlayback={handlePlayback} songs={filteredSongs.length > 0 ? filteredSongs : songs} addToPlaylist={addToPlaylist} 
         setShowModal={setShowModal} playlists={playlists} fetchPlaylists={fetchPlaylists} />} />
        <Route path="/playlist" element={<Playlist handlePlayback={handlePlayback} />} />
        <Route path="/home" element={<Home setCurrentSongId={setCurrentSongId} handlePlayback={handlePlayback} currentSong={currentSong} recentSongs={recentSongs} songs={filteredSongs.length > 0 ? filteredSongs : songs} 
        addToPlaylist={addToPlaylist} setShowModal={setShowModal} playlists={playlists} fetchPlaylists={fetchPlaylists} />} />
        <Route path="/upload" element={<MusicUploader />} />
        <Route path="/uploaded-songs" element={<UploadedSongs songs={filteredSongs.length > 0 ? filteredSongs : songs} handlePlayback={handlePlayback} setCurrentSongId={setCurrentSongId} fetchPlaylists={fetchPlaylists} setShowModal={setShowModal} />} />
        <Route path="/recents" element={<Recents currentSong={currentSong} recentSongs={recentSongs} addToPlaylist={addToPlaylist} 
        handlePlayback={handlePlayback} setShowModal={setShowModal} playlists={playlists} fetchPlaylists={fetchPlaylists} setCurrentSongId={setCurrentSongId} />} />
        <Route path="/favourites" element={<Favourites setCurrentSongId={setCurrentSongId} handlePlayback={handlePlayback} setShowModal={setShowModal} playlists={playlists} addToPlaylist={addToPlaylist} fetchPlaylists={fetchPlaylists}/>} />
        <Route path="/about" element={<About/>} />
      </Routes>
      <MusicBanner
        currentSong={currentSong}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        audioRef={audioRef}
        handleSeek={handleSeek}
        onFavoriteToggle={handleFavoriteToggle}
      />
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add to Playlist</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            {playlists.map(playlist => (
              <li key={playlist.playlist_id}>
                <Button onClick={() => addToPlaylist(playlist.playlist_id)}>
                  {playlist.playlist_name}
                </Button>
              </li>
            ))}
          </ul>
        </Modal.Body>
      </Modal>  
      {notification && <Notification message={notification} onClose={() => setNotification(null)} />} 
    </div>
  );
}

export default App;