import React, { useState, useRef, useEffect } from 'react'; // Importē nepieciešamās bibliotēkas
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Importē maršrutēšanas komponentus
import { Button, Modal } from "react-bootstrap"; // Importē pogu un modālo logu no Bootstrap
import Header from './components/Header'; // Importē Header komponentu
import MusicBanner from './components/MusicBanner'; // Importē MusicBanner komponentu
import Playlist from './components/Playlist'; // Importē Playlist komponentu
import Home from './components/Home'; // Importē Home komponentu
import MusicUploader from './components/Upload'; // Importē MusicUploader komponentu
import LoginForm from './components/Login/Login'; // Importē LoginForm komponentu
import './App.css'; // Importē stilu lapu
import Recents from './components/Recents'; // Importē Recents komponentu
import About from './components/About/About'; // Importē About komponentu
import axios from 'axios'; // Importē axios bibliotēku
import Notification from './components/Notification'; // Importē Notification komponentu
import Favourites from './components/Favourites'; // Importē Favourites komponentu
import UploadedSongs from './components/UploadedSongs/UploadedSongs'; // Importē UploadedSongs komponentu
import UserNotifications from './components/UserNotifications/UserNotifications'; // Importē UserNotifications komponentu
import SharedSongs from './components/SharedSongs'; // Importē SharedSongs komponentu

axios.defaults.withCredentials = true; // Iestata axios noklusējuma parametrus, lai iekļautu sīkfailus

function App() {
  const [currentSong, setCurrentSong] = useState(null); // Definē stāvokļa mainīgo pašreizējai dziesmai
  const [isPlaying, setIsPlaying] = useState(false); // Definē stāvokļa mainīgo, lai norādītu, vai dziesma tiek atskaņota
  const audioRef = useRef(new Audio()); // Izveido atsauci uz Audio objektu
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Definē stāvokļa mainīgo, lai norādītu, vai lietotājs ir pieteicies
  const [userId, setUserId] = useState(null); // Definē stāvokļa mainīgo lietotāja ID
  const [songs, setSongs] = useState([]); // Definē stāvokļa mainīgo dziesmu sarakstam
  const [filteredSongs, setFilteredSongs] = useState([]); // Definē stāvokļa mainīgo filtrētajām dziesmām
  const [showModal, setShowModal] = useState(false); // Definē stāvokļa mainīgo modālajam logam
  const [playlists, setPlaylists] = useState([]); // Definē stāvokļa mainīgo atskaņošanas sarakstiem
  const [notification, setNotification] = useState(null); // Definē stāvokļa mainīgo paziņojumam
  const [currentSongId, setCurrentSongId] = useState(null); // Definē stāvokļa mainīgo pašreizējās dziesmas ID
  const [playlistSongs, setPlaylistSongs] = useState([]); // Definē stāvokļa mainīgo atskaņošanas saraksta dziesmām
  const [filteredPlaylistSongs, setFilteredPlaylistSongs] = useState([]); // Definē stāvokļa mainīgo filtrētajām atskaņošanas saraksta dziesmām
  const [favoriteSongs, setFavoriteSongs] = useState([]); // Definē stāvokļa mainīgo iecienītajām dziesmām
  const [filteredFavoriteSongs, setFilteredFavoriteSongs] = useState([]); // Definē stāvokļa mainīgo filtrētajām iecienītajām dziesmām
  const [recentSongs, setRecentSongs] = useState([]); // Definē stāvokļa mainīgo nesen atskaņotajām dziesmām
  const [filteredRecentSongs, setFilteredRecentSongs] = useState([]); // Definē stāvokļa mainīgo filtrētajām nesen atskaņotajām dziesmām
  const [currentPlaylist, setCurrentPlaylist] = useState(null); // Definē stāvokļa mainīgo pašreizējam atskaņošanas sarakstam
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(null); // Definē stāvokļa mainīgo pašreizējam atskaņošanas saraksta indeksam

  const displayNotification = (message) => {
    setNotification(message); // Iestata paziņojumu
    setTimeout(() => {
      setNotification(null); // Pēc 5 sekundēm noņem paziņojumu
    }, 5000);
  };

  const checkSession = async () => {
    try {
      const response = await fetch('http://localhost/backend/checkSession.php', {
        credentials: 'include'
      });
      const data = await response.json();
      setIsLoggedIn(data.isLoggedIn); // Iestata, vai lietotājs ir pieteicies
      if (data.isLoggedIn) {
        setUserId(data.userId); // Iestata lietotāja ID
      }
    } catch (error) {
      console.error('Error fetching session data:', error);
    }
  };

  useEffect(() => {
    checkSession(); // Pārbauda sesiju, kad komponents ir ielādēts
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost/backend/getData.php', {
        credentials: 'include'
      });
      const data = await response.json();
      setSongs(data); // Iestata dziesmu sarakstu
      setFilteredSongs(data); // Iestata filtrēto dziesmu sarakstu
    } catch (error) {
      displayNotification('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData(); // Ielādē datus, kad komponents ir ielādēts
  }, []);

  const handleSearch = (searchTerm) => {
    if (searchTerm.trim() === "") {
      setFilteredSongs(songs); // Ja meklēšanas termins ir tukšs, iestata filtrētās dziesmas uz visām dziesmām
      setFilteredPlaylistSongs(playlistSongs); // Iestata filtrētās atskaņošanas saraksta dziesmas
      setFilteredFavoriteSongs(favoriteSongs); // Iestata filtrētās iecienītās dziesmas
      setFilteredRecentSongs(recentSongs); // Iestata filtrētās nesen atskaņotās dziesmas
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
    setIsLoggedIn(loginSuccess); // Iestata, vai lietotājs ir pieteicies
    fetchData(); // Ielādē datus
    if (loginSuccess) {
      await checkSession(); // Pārbauda sesiju
      fetchRecentSongs(); // Ielādē nesen atskaņotās dziesmas
    }
  };

  const fetchPlaylists = () => {
    fetch('http://localhost/backend/getPlaylists.php', {
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => setPlaylists(data)) // Iestata atskaņošanas sarakstu datus
      .catch(error => displayNotification('Error fetching playlists:', error));
  };

  const fetchPlaylistSongs = (playlistId) => {
    fetch(`http://localhost/backend/getPlaylistSongs.php?playlistId=${playlistId}`, {
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {
        setPlaylistSongs(data); // Iestata atskaņošanas saraksta dziesmas
        setFilteredPlaylistSongs(data); // Iestata filtrētās atskaņošanas saraksta dziesmas
      })
      .catch(error => displayNotification('Error fetching playlist songs:', error));
  };

  const fetchFavoriteSongs = async () => {
    try {
      const response = await fetch('http://localhost/backend/getFavourites.php', {
        credentials: 'include'
      });
      const data = await response.json();
      setFavoriteSongs(data); // Iestata iecienītās dziesmas
      setFilteredFavoriteSongs(data); // Iestata filtrētās iecienītās dziesmas
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
      setRecentSongs(data); // Iestata nesen atskaņotās dziesmas
      setFilteredRecentSongs(data); // Iestata filtrētās nesen atskaņotās dziesmas
    } catch (error) {
      console.error('Error fetching recent songs:', error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchRecentSongs(); // Ielādē nesen atskaņotās dziesmas, ja lietotājs ir pieteicies
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
        setIsLoggedIn(false); // Iestata, ka lietotājs nav pieteicies
      } else {
        displayNotification('Logout failed', data.message);
      }
    } catch (error) {
      displayNotification('Error during logout:', error);
    }
  };

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />; // Ja lietotājs nav pieteicies, parāda pieteikšanās formu
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
    setCurrentSong(song); // Iestata pašreizējo dziesmu
    setIsPlaying(true); // Iestata, ka dziesma tiek atskaņota
    setCurrentPlaylist(playlist); // Iestata pašreizējo atskaņošanas sarakstu
    setCurrentPlaylistIndex(index); // Iestata pašreizējo atskaņošanas saraksta indeksu
    addToRecentSongs(song); // Pievieno dziesmu nesen atskaņoto dziesmu sarakstam
  };

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause(); // Pārtrauc dziesmas atskaņošanu
    } else {
      audio.play(); // Atskaņo dziesmu
      if (currentSong) {
        addToRecentSongs(currentSong); // Pievieno pašreizējo dziesmu nesen atskaņoto dziesmu sarakstam
      }
    }
    setIsPlaying(prevState => !prevState); // Maina atskaņošanas stāvokli
  };

  const handleNext = () => {
    if (currentPlaylist && currentPlaylistIndex !== null) {
      const nextIndex = (currentPlaylistIndex + 1) % currentPlaylist.length;
      handlePlayback(currentPlaylist[nextIndex], currentPlaylist, nextIndex); // Atskaņo nākamo dziesmu atskaņošanas sarakstā
    } else if (currentSong) {
      const currentIndex = filteredSongs.findIndex(song => song.song_id === currentSong.song_id);
      const nextIndex = (currentIndex + 1) % filteredSongs.length;
      handlePlayback(filteredSongs[nextIndex]); // Atskaņo nākamo dziesmu filtrēto dziesmu sarakstā
    }
  };

  const handlePrevious = () => {
    if (currentPlaylist && currentPlaylistIndex !== null) {
      const prevIndex = (currentPlaylistIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
      handlePlayback(currentPlaylist[prevIndex], currentPlaylist, prevIndex); // Atskaņo iepriekšējo dziesmu atskaņošanas sarakstā
    } else if (currentSong) {
      const currentIndex = filteredSongs.findIndex(song => song.song_id === currentSong.song_id);
      const prevIndex = (currentIndex - 1 + filteredSongs.length) % filteredSongs.length;
      handlePlayback(filteredSongs[prevIndex]); // Atskaņo iepriekšējo dziesmu filtrēto dziesmu sarakstā
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

        fetchData(); // Atjauno datus, lai atspoguļotu izmaiņas iecienītajās dziesmās
        fetchFavoriteSongs(); // Ielādē iecienītās dziesmas
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
            fetchData(); // Atjauno datus
          }
          setShowModal(false); // Aizver modālo logu
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
      audio.currentTime = newTime; // Iestata jaunu dziesmas atskaņošanas pozīciju
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
