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
  const audioRef = useRef(new Audio()); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [notification, setNotification] = useState(null);
  const [currentSongId, setCurrentSongId] = useState(null);
  const [playlistSongs, setPlaylistSongs] = useState([]);
  const [filteredPlaylistSongs, setFilteredPlaylistSongs] = useState([]);
  const [favoriteSongs, setFavoriteSongs] = useState([]);
  const [filteredFavoriteSongs, setFilteredFavoriteSongs] = useState([]);
  const [recentSongs, setRecentSongs] = useState([]);
  const [filteredRecentSongs, setFilteredRecentSongs] = useState([]);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(null);

  // Function to check session
  const checkSession = async () => {
    try {
      const response = await fetch('http://localhost/backend/checkSession.php', {
        credentials: 'include'  // Ensures cookies are included
      });
      const data = await response.json();
      // console.log(data); // This will log the session data received from PHP
      setIsLoggedIn(data.isLoggedIn);
      if (data.isLoggedIn) {
        // console.log("User is logged in, user ID:", data.userId);
      } else {
        // console.log("User is not logged in");
      }
    } catch (error) {
      // console.error('Error fetching session data:', error);
    }
  };
  
  // Call checkSession on component mount
  useEffect(() => {
    checkSession();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost/backend/getData.php', {
      credentials: 'include'
      });
      const data = await response.json();
      setSongs(data);
      setFilteredSongs(data);
    } catch (error) {
      displayNotification('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle search across all categories
  const handleSearch = (searchTerm) => {
    if (searchTerm.trim() === "") {
        setFilteredSongs(songs);
        setFilteredPlaylistSongs(playlistSongs);
        setFilteredFavoriteSongs(favoriteSongs);
        setFilteredRecentSongs(recentSongs);
    } else {
        // Apply filters based on the search term
        setFilteredSongs(songs.filter(song =>
            song.song_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            song.artist.toLowerCase().includes(searchTerm.toLowerCase())
        ));

        setFilteredPlaylistSongs(playlistSongs.filter(song =>
            song.song_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            song.artist.toLowerCase().includes(searchTerm.toLowerCase())
        ));

        setFilteredFavoriteSongs(favoriteSongs.filter(song =>
            song.song_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            song.artist.toLowerCase().includes(searchTerm.toLowerCase())
        ));

        setFilteredRecentSongs(recentSongs.filter(song =>
            song.song_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            song.artist.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    }
  };
  
  // Login handling
  const handleLogin = async (loginSuccess) => {
    setIsLoggedIn(loginSuccess);
    fetchData()
    if (loginSuccess) {
      await checkSession();  // Recheck session after login
    }
  };

  const fetchPlaylists = () => {
    fetch('http://localhost/backend/getPlaylists.php', {
      credentials: 'include'  // Ensures cookies are included
    })
    .then(response => response.json())
    .then(data => setPlaylists(data))
    .catch(error => displayNotification('Error fetching playlists:', error));
  };

  const fetchPlaylistSongs = (playlistId) => {
    fetch(`http://localhost/backend/getPlaylistSongs.php?playlistId=${playlistId}`, {
      credentials: 'include'  // Ensures cookies are included
    })
    .then(response => response.json())
    .then(data => {
      // console.log("Fetched Playlist Songs:", data);
      setPlaylistSongs(data); // Set primary state
      setFilteredPlaylistSongs(data); // Set filtered state simultaneously
    })
    .catch(error => displayNotification('Error fetching playlist songs:', error));
  };
  

  const fetchFavoriteSongs = async () => {
    try {
      const response = await fetch('http://localhost/backend/getFavourites.php', {
        credentials: 'include'  // Ensures cookies are included
      });
      const data = await response.json();
      // console.log("Fetched Favorite Songs:", data);  // Log fetched data
      setFavoriteSongs(data);
      setFilteredFavoriteSongs(data);
    } catch (error) {
      displayNotification('Error fetching favorite songs:', error);
    }
  };
  

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost/backend/logout.php', {
        method: 'POST',
        credentials: 'include',  // Ensures cookies, including session cookies, are sent
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        displayNotification("Logout successful");
        setIsLoggedIn(false); // Update the login state
      } else {
        displayNotification('Logout failed', data.message);
      }
    } catch (error) {
      displayNotification('Error during logout:', error);
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
        return [song, ...prevSongs.filter(prevSong => prevSong.song_id !== song.song_id)];
      } else {
        // Add the new song to the recents, and keep only the last 5 entries
        return [song, ...prevSongs];
      }
    });
    setFilteredRecentSongs(prevSongs => {
      // Check if the current song is already in the recents list to avoid duplicates
      const exists = prevSongs.find(prevSong => prevSong.song_id === song.song_id);
      if (exists) {
        // Move the existing song to the top without adding it again
        return [song, ...prevSongs.filter(prevSong => prevSong.song_id !== song.song_id)];
      } else {
        // Add the new song to the recents, and keep only the last 5 entries
        return [song, ...prevSongs];
      }
    });
  };

  const handlePlayback = (song, playlist = null, index = null) => {
    if (!song) {
      displayNotification("No song to play.");
      return;
    }
    const audio = audioRef.current;
    audio.src = `http://localhost/backend/${song.file_path}`;
    audio.play();
    setCurrentSong(song);
    setIsPlaying(true);
    setCurrentPlaylist(playlist);
    setCurrentPlaylistIndex(index);
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

  const handleNext = () => {
    if (currentPlaylist && currentPlaylistIndex !== null) {
      const nextIndex = (currentPlaylistIndex + 1) % currentPlaylist.length;
      handlePlayback(currentPlaylist[nextIndex], currentPlaylist, nextIndex);
    } else if (currentSong) {
      const currentIndex = filteredSongs.findIndex(song => song.song_id === currentSong.song_id);
      const nextIndex = (currentIndex + 1) % filteredSongs.length;
      handlePlayback(filteredSongs[nextIndex]);
    }
  };

  const handlePrevious = () => {
    if (currentPlaylist && currentPlaylistIndex !== null) {
      const prevIndex = (currentPlaylistIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
      handlePlayback(currentPlaylist[prevIndex], currentPlaylist, prevIndex);
    } else if (currentSong) {
      const currentIndex = filteredSongs.findIndex(song => song.song_id === currentSong.song_id);
      const prevIndex = (currentIndex - 1 + filteredSongs.length) % filteredSongs.length;
      handlePlayback(filteredSongs[prevIndex]);
    }
  };

  // Function to handle adding/removing song from favorites
const handleFavoriteToggle = async (isFavorite) => {
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
        credentials: 'include'  // Ensures cookies are included
      });
      const data = await response.json();
      displayNotification(data.message); // Log the response message

      setCurrentSong(prevSong => ({
        ...prevSong,
        is_favorite: isFavorite ? 0 : 1  // Toggle the favorite status
      }));

      fetchData();
    } catch (error) {
      displayNotification('Error adding/removing song from favorites:', error);
    }
  } else {
    displayNotification('No current song to add/remove from favorites');
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
      credentials: 'include'  // Ensures cookies are included
    })
    .then(response => response.json())
    .then(data => {
      displayNotification(data.message);
      fetchData(); // Re-fetch songs after adding to playlist
      setShowModal(false);
    })
    .catch(error => displayNotification('Error adding song to playlist:', error));
  } else {
    displayNotification('Current song ID is null');
  }
};

const handleSeek = (event) => {
  const newPosition = event.target.value;
  const audio = audioRef.current;
  if (!isNaN(audio.duration) && isFinite(audio.duration)) {
    const newTime = (newPosition / 100) * audio.duration;
    audio.currentTime = newTime;
  } else {
    // Handle the case where audio duration is not a finite number
  }
};


return (
  <div>
    <Header handleLogout={handleLogout} handleSearch={handleSearch} />
    <Routes>
      <Route path="/" element={<Home setCurrentSongId={setCurrentSongId} handlePlayback={handlePlayback} songs={filteredSongs} addToPlaylist={addToPlaylist} setShowModal={setShowModal} playlists={playlists} fetchPlaylists={fetchPlaylists} recentSongs={recentSongs} />} />
      <Route path="/playlist" element={<Playlist handlePlayback={handlePlayback} fetchPlaylistSongs={fetchPlaylistSongs} playlistSongs={filteredPlaylistSongs} />} />
      <Route path="/home" element={<Home setCurrentSongId={setCurrentSongId} handlePlayback={handlePlayback} currentSong={currentSong} recentSongs={recentSongs} songs={filteredSongs} addToPlaylist={addToPlaylist} setShowModal={setShowModal} playlists={playlists} fetchPlaylists={fetchPlaylists} fetchData={fetchData}/>} />
      <Route path="/upload" element={<MusicUploader />} />
      <Route path="/uploaded-songs" element={<UploadedSongs songs={filteredSongs} handlePlayback={handlePlayback} setCurrentSongId={setCurrentSongId} fetchPlaylists={fetchPlaylists} setShowModal={setShowModal} />} />
      <Route path="/recents" element={<Recents currentSong={currentSong} recentSongs={filteredRecentSongs} addToPlaylist={addToPlaylist} handlePlayback={handlePlayback} setShowModal={setShowModal} playlists={playlists} fetchPlaylists={fetchPlaylists} setCurrentSongId={setCurrentSongId} />} />
      <Route path="/favourites" element={<Favourites setCurrentSongId={setCurrentSongId} handlePlayback={handlePlayback} setShowModal={setShowModal} playlists={playlists} addToPlaylist={addToPlaylist} fetchPlaylists={fetchPlaylists} fetchFavoriteSongs={fetchFavoriteSongs} favoriteSongs={filteredFavoriteSongs} />} />
      <Route path="/about" element={<About />} />
    </Routes>
    <MusicBanner 
      currentSong={currentSong} 
      isPlaying={isPlaying} 
      onPlayPause={handlePlayPause} 
      onNext={handleNext} 
      onPrevious={handlePrevious} 
      audioRef={audioRef} 
      handleSeek={handleSeek} 
      onFavoriteToggle={handleFavoriteToggle} 
    />
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Add to Playlist</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {playlists.length > 0 ? (
          <ul className="playlist-list">
            {playlists.map(playlist => (
              <li key={playlist.playlist_id}>
                <Button className="playlist-button" onClick={() => addToPlaylist(playlist.playlist_id)}>
                  {playlist.playlist_name}
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No playlists available.</p>
        )}
      </Modal.Body>
    </Modal>
    {notification && <Notification message={notification} onClose={() => setNotification(null)} />}
  </div>
);
}

export default App;
