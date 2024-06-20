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
import UserNotifications from './components/UserNotifications/UserNotifications';
import SharedSongs from './components/SharedSongs/SharedSongs';

axios.defaults.withCredentials = true;

function App() {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
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

  const displayNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const checkSession = async () => {
    try {
      const response = await fetch('http://localhost/backend/checkSession.php', {
        credentials: 'include'
      });
      const data = await response.json();
      setIsLoggedIn(data.isLoggedIn);
      if (data.isLoggedIn) {
        setUserId(data.userId);
      }
    } catch (error) {
      console.error('Error fetching session data:', error);
    }
  };

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

  const handleSearch = (searchTerm) => {
    if (searchTerm.trim() === "") {
      setFilteredSongs(songs);
      setFilteredPlaylistSongs(playlistSongs);
      setFilteredFavoriteSongs(favoriteSongs);
      setFilteredRecentSongs(recentSongs);
    } else {
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

  const handleLogin = async (loginSuccess) => {
    setIsLoggedIn(loginSuccess);
    fetchData();
    if (loginSuccess) {
      await checkSession();
      fetchRecentSongs();
    }
  };

  const fetchPlaylists = () => {
    fetch('http://localhost/backend/getPlaylists.php', {
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => setPlaylists(data))
      .catch(error => displayNotification('Error fetching playlists:', error));
  };

  const fetchPlaylistSongs = (playlistId) => {
    fetch(`http://localhost/backend/getPlaylistSongs.php?playlistId=${playlistId}`, {
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {
        setPlaylistSongs(data);
        setFilteredPlaylistSongs(data);
      })
      .catch(error => displayNotification('Error fetching playlist songs:', error));
  };

  const fetchFavoriteSongs = async () => {
    try {
      const response = await fetch('http://localhost/backend/getFavourites.php', {
        credentials: 'include'
      });
      const data = await response.json();
      setFavoriteSongs(data);
      setFilteredFavoriteSongs(data);
    } catch (error) {
      displayNotification('Error fetching favorite songs:', error);
    }
  };

  const fetchRecentSongs = async () => {
    try {
      const response = await fetch('http://localhost/backend/getRecentlyPlayed.php', {
        credentials: 'include'
      });
      const data = await response.json();
      setRecentSongs(data);
      setFilteredRecentSongs(data);
    } catch (error) {
      console.error('Error fetching recent songs:', error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchRecentSongs();
    }
  }, [isLoggedIn]);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost/backend/logout.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        displayNotification("Logout successful");
        setIsLoggedIn(false);
        setUserId(null);
        setCurrentSong(null);
        setIsPlaying(false);
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } else {
        displayNotification('Logout failed', data.message);
      }
    } catch (error) {
      displayNotification('Error during logout:', error);
    }
  };

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const addToRecentSongs = async (song) => {
    try {
      await axios.post('http://localhost/backend/logRecentlyPlayed.php', {
        user_id: userId,
        song_id: song.song_id
      });

      setRecentSongs(prevSongs => {
        const exists = prevSongs.find(prevSong => prevSong.song_id === song.song_id);
        if (exists) {
          return [song, ...prevSongs.filter(prevSong => prevSong.song_id !== song.song_id)];
        } else {
          return [song, ...prevSongs.slice(0, 14)];
        }
      });
      setFilteredRecentSongs(prevSongs => {
        const exists = prevSongs.find(prevSong => prevSong.song_id === song.song_id);
        if (exists) {
          return [song, ...prevSongs.filter(prevSong => prevSong.song_id !== song.song_id)];
        } else {
          return [song, ...prevSongs.slice(0, 14)];
        }
      });
    } catch (error) {
      console.error('Error logging recently played song:', error);
    }
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
    addToRecentSongs(song);
  };

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
      if (currentSong) {
        addToRecentSongs(currentSong);
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

  const handleFavoriteToggle = async (isFavorite) => {
    if (currentSong) {
      try {
        const response = await fetch('http://localhost/backend/addToFavorites.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ songId: currentSong.song_id, isFavorite }),
          credentials: 'include'
        });
        const data = await response.json();
        displayNotification(data.message);

        fetchData();
        fetchFavoriteSongs();
      } catch (error) {
        displayNotification('Error adding/removing song from favorites:', error);
      }
    } else {
      displayNotification('No current song to add/remove from favorites');
    }
  };

  const addToPlaylist = (playlistId) => {
    if (currentSongId) {
      fetch('http://localhost/backend/addSongPlaylist.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ songId: currentSongId, playlistId }),
        credentials: 'include'
      })
        .then(response => response.json())
        .then(data => {
          displayNotification(data.message);
          if (data.message === 'Song added to playlist successfully') {
            fetchData();
          }
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
    }
  };

  return (
    <div>
      <Header handleLogout={handleLogout} handleSearch={handleSearch} />
      <Routes>
        <Route path="/" element={<Home setCurrentSongId={setCurrentSongId} handlePlayback={handlePlayback} songs={filteredSongs} addToPlaylist={addToPlaylist} setShowModal={setShowModal} playlists={playlists} fetchPlaylists={fetchPlaylists} recentSongs={recentSongs} fetchData={fetchData} />} />
        <Route path="/playlist" element={<Playlist handlePlayback={handlePlayback} fetchPlaylistSongs={fetchPlaylistSongs} playlistSongs={filteredPlaylistSongs} playlists={playlists} fetchPlaylists={fetchPlaylists} userId={userId} />} />
        <Route path="/home" element={<Home setCurrentSongId={setCurrentSongId} handlePlayback={handlePlayback} currentSong={currentSong} recentSongs={recentSongs} songs={filteredSongs} addToPlaylist={addToPlaylist} setShowModal={setShowModal} playlists={playlists} fetchPlaylists={fetchPlaylists} fetchData={fetchData} />} />
        <Route path="/upload" element={<MusicUploader />} />
        <Route path="/uploaded-songs" element={<UploadedSongs songs={filteredSongs} handlePlayback={handlePlayback} setCurrentSongId={setCurrentSongId} setShowModal={setShowModal} fetchPlaylists={fetchPlaylists} />} />
        <Route path="/recents" element={<Recents currentSong={currentSong} recentSongs={filteredRecentSongs} addToPlaylist={addToPlaylist} handlePlayback={handlePlayback} setShowModal={setShowModal} playlists={playlists} setCurrentSongId={setCurrentSongId} fetchPlaylists={fetchPlaylists} />} />
        <Route path="/favourites" element={<Favourites setCurrentSongId={setCurrentSongId} handlePlayback={handlePlayback} setShowModal={setShowModal} playlists={playlists} addToPlaylist={addToPlaylist} fetchFavoriteSongs={fetchFavoriteSongs} favoriteSongs={filteredFavoriteSongs} fetchPlaylists={fetchPlaylists} />} />
        <Route path="/about" element={<About />} />
        <Route path="/shared-songs" element={<SharedSongs setShowModal={setShowModal} handlePlayback={handlePlayback} setCurrentSongId={setCurrentSongId} playlists={playlists} addToPlaylist={addToPlaylist} userId={userId} />} />
        <Route path="/notifications" element={<UserNotifications />} />
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
