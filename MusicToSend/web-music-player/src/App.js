import React, { useState, useRef, useEffect } from 'react'; // Importē nepieciešamos React komponentus un āķus
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Importē router komponentus no react-router-dom
import { Button, Modal } from "react-bootstrap"; // Importē komponentus no react-bootstrap
import Header from './components/Header'; // Importē Header komponentu
import MusicBanner from './components/MusicBanner'; // Importē MusicBanner komponentu
import Playlist from './components/Playlist'; // Importē Playlist komponentu
import Home from './components/Home'; // Importē Home komponentu
import MusicUploader from './components/Upload'; // Importē MusicUploader komponentu
import LoginForm from './components/Login/Login'; // Importē LoginForm komponentu
import './App.css'; // Importē CSS failu
import Recents from './components/Recents'; // Importē Recents komponentu
import About from './components/About/About'; // Importē About komponentu
import axios from 'axios'; // Importē axios bibliotēku
import Notification from './components/Notification'; // Importē Notification komponentu
import Favourites from './components/Favourites'; // Importē Favourites komponentu
import UploadedSongs from './components/UploadedSongs/UploadedSongs'; // Importē UploadedSongs komponentu
import UserNotifications from './components/UserNotifications/UserNotifications'; // Importē UserNotifications komponentu
import SharedSongs from './components/SharedSongs'; // Importē SharedSongs komponentu

axios.defaults.withCredentials = true; // Uzstāda axios konfigurāciju lai iekļautu credentials

function App() { // Definē App komponentu
  const [currentSong, setCurrentSong] = useState(null); // Definē currentSong stāvokli
  const [isPlaying, setIsPlaying] = useState(false); // Definē isPlaying stāvokli
  const audioRef = useRef(new Audio()); // Izveido atsauci uz Audio objektu
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Definē isLoggedIn stāvokli
  const [userId, setUserId] = useState(null); // Definē userId stāvokli
  const [songs, setSongs] = useState([]); // Definē songs stāvokli
  const [filteredSongs, setFilteredSongs] = useState([]); // Definē filteredSongs stāvokli
  const [showModal, setShowModal] = useState(false); // Definē showModal stāvokli
  const [playlists, setPlaylists] = useState([]); // Definē playlists stāvokli
  const [notification, setNotification] = useState(null); // Definē notification stāvokli
  const [currentSongId, setCurrentSongId] = useState(null); // Definē currentSongId stāvokli
  const [playlistSongs, setPlaylistSongs] = useState([]); // Definē playlistSongs stāvokli
  const [filteredPlaylistSongs, setFilteredPlaylistSongs] = useState([]); // Definē filteredPlaylistSongs stāvokli
  const [favoriteSongs, setFavoriteSongs] = useState([]); // Definē favoriteSongs stāvokli
  const [filteredFavoriteSongs, setFilteredFavoriteSongs] = useState([]); // Definē filteredFavoriteSongs stāvokli
  const [recentSongs, setRecentSongs] = useState([]); // Definē recentSongs stāvokli
  const [filteredRecentSongs, setFilteredRecentSongs] = useState([]); // Definē filteredRecentSongs stāvokli
  const [currentPlaylist, setCurrentPlaylist] = useState(null); // Definē currentPlaylist stāvokli
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(null); // Definē currentPlaylistIndex stāvokli

  const checkSession = async () => { // Definē checkSession funkciju, kas pārbauda lietotāja sesiju
    try {
      const response = await fetch('http://localhost/backend/checkSession.php', { // Izsauc checkSession.php failu
        credentials: 'include'
      });
      const data = await response.json(); // Saņem atbildi JSON formātā
      setIsLoggedIn(data.isLoggedIn); // Uzstāda isLoggedIn stāvokli
      if (data.isLoggedIn) {
        setUserId(data.userId); // Uzstāda userId stāvokli
      }
    } catch (error) {
      console.error('Error fetching session data:', error); // Izvada kļūdu konsolē
    }
  };
  
  useEffect(() => { // Izsauc checkSession funkciju komponenta ielādēšanas brīdī
    checkSession();
  }, []);

  const fetchData = async () => { // Definē fetchData funkciju, kas iegūst datus no servera
    try {
      const response = await fetch('http://localhost/backend/getData.php', { // Izsauc getData.php failu
        credentials: 'include'
      });
      const data = await response.json(); // Saņem atbildi JSON formātā
      setSongs(data); // Uzstāda songs stāvokli
      setFilteredSongs(data); // Uzstāda filteredSongs stāvokli
    } catch (error) {
      displayNotification('Error fetching data:', error); // Izvada kļūdu
    }
  };

  useEffect(() => { // Izsauc fetchData funkciju komponenta ielādēšanas brīdī
    fetchData();
  }, []);

  const handleSearch = (searchTerm) => { // Definē handleSearch funkciju, kas apstrādā meklēšanas terminu
    if (searchTerm.trim() === "") {
        setFilteredSongs(songs); // Ja meklēšanas termins ir tukšs, uzstāda sākotnējo dziesmu sarakstu
        setFilteredPlaylistSongs(playlistSongs); // Uzstāda sākotnējo atskaņošanas sarakstu dziesmu sarakstu
        setFilteredFavoriteSongs(favoriteSongs); // Uzstāda sākotnējo iecienīto dziesmu sarakstu
        setFilteredRecentSongs(recentSongs); // Uzstāda sākotnējo nesen atskaņoto dziesmu sarakstu
    } else {
        setFilteredSongs(songs.filter(song => // Filtrē dziesmas, pamatojoties uz meklēšanas terminu
            song.song_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            song.artist.toLowerCase().includes(searchTerm.toLowerCase())
        ));

        setFilteredPlaylistSongs(playlistSongs.filter(song => // Filtrē atskaņošanas saraksta dziesmas, pamatojoties uz meklēšanas terminu
            song.song_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            song.artist.toLowerCase().includes(searchTerm.toLowerCase())
        ));

        setFilteredFavoriteSongs(favoriteSongs.filter(song => // Filtrē iecienītās dziesmas, pamatojoties uz meklēšanas terminu
            song.song_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            song.artist.toLowerCase().includes(searchTerm.toLowerCase())
        ));

        setFilteredRecentSongs(recentSongs.filter(song => // Filtrē nesen atskaņotās dziesmas, pamatojoties uz meklēšanas terminu
            song.song_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            song.artist.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    }
  };
  
  const handleLogin = async (loginSuccess) => { // Definē handleLogin funkciju, kas apstrādā pieteikšanās panākumus
    setIsLoggedIn(loginSuccess); // Uzstāda isLoggedIn stāvokli
    fetchData(); // Izsauc fetchData funkciju
    if (loginSuccess) {
      await checkSession(); // Pārbauda sesiju
      fetchRecentSongs(); // Iegūst nesen atskaņotās dziesmas
    }
  };

  const fetchPlaylists = () => { // Definē fetchPlaylists funkciju, kas iegūst atskaņošanas sarakstus
    fetch('http://localhost/backend/getPlaylists.php', {
      credentials: 'include'
    })
    .then(response => response.json()) // Saņem atbildi JSON formātā
    .then(data => setPlaylists(data)) // Uzstāda playlists stāvokli
    .catch(error => displayNotification('Error fetching playlists:', error)); // Izvada kļūdu
  };

  const fetchPlaylistSongs = (playlistId) => { // Definē fetchPlaylistSongs funkciju, kas iegūst atskaņošanas saraksta dziesmas
    fetch(`http://localhost/backend/getPlaylistSongs.php?playlistId=${playlistId}`, {
      credentials: 'include'
    })
    .then(response => response.json()) // Saņem atbildi JSON formātā
    .then(data => {
      setPlaylistSongs(data); // Uzstāda playlistSongs stāvokli
      setFilteredPlaylistSongs(data); // Uzstāda filteredPlaylistSongs stāvokli
    })
    .catch(error => displayNotification('Error fetching playlist songs:', error)); // Izvada kļūdu
  };

  const fetchFavoriteSongs = async () => { // Definē fetchFavoriteSongs funkciju, kas iegūst iecienītās dziesmas
    try {
      const response = await fetch('http://localhost/backend/getFavourites.php', {
        credentials: 'include'
      });
      const data = await response.json(); // Saņem atbildi JSON formātā
      setFavoriteSongs(data); // Uzstāda favoriteSongs stāvokli
      setFilteredFavoriteSongs(data); // Uzstāda filteredFavoriteSongs stāvokli
    } catch (error) {
      displayNotification('Error fetching favorite songs:', error); // Izvada kļūdu
    }
  };

  const fetchRecentSongs = async () => { // Definē fetchRecentSongs funkciju, kas iegūst nesen atskaņotās dziesmas
    try {
      const response = await fetch('http://localhost/backend/getRecentlyPlayed.php', {
        credentials: 'include'
      });
      const data = await response.json(); // Saņem atbildi JSON formātā
      setRecentSongs(data); // Uzstāda recentSongs stāvokli
      setFilteredRecentSongs(data); // Uzstāda filteredRecentSongs stāvokli
    } catch (error) {
      console.error('Error fetching recent songs:', error); // Izvada kļūdu
    }
  };
  
  useEffect(() => { // Izsauc fetchRecentSongs funkciju, kad lietotājs ir ielogojies
    if (isLoggedIn) {
      fetchRecentSongs();
    }
  }, [isLoggedIn]);
  

  const handleLogout = async () => { // Definē handleLogout funkciju, kas apstrādā iziešanu no sistēmas
    try {
      const response = await fetch('http://localhost/backend/logout.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json(); // Saņem atbildi JSON formātā
      if (data.success) {
        displayNotification("Logout successful"); // Izvada paziņojumu par veiksmīgu iziešanu
        setIsLoggedIn(false); // Uzstāda isLoggedIn stāvokli
      } else {
        displayNotification('Logout failed', data.message); // Izvada kļūdu
      }
    } catch (error) {
      displayNotification('Error during logout:', error); // Izvada kļūdu
    }
  };

  if (!isLoggedIn) { // Ja lietotājs nav ielogojies
    return <LoginForm onLogin={handleLogin} />; // Parāda pieteikšanās formu
  }

  const addToRecentSongs = async (song) => { // Definē addToRecentSongs funkciju, kas pievieno dziesmu nesen atskaņotajām
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
      console.error('Error logging recently played song:', error); // Izvada kļūdu
    }
  };

  const handlePlayback = (song, playlist = null, index = null) => { // Definē handlePlayback funkciju, kas apstrādā dziesmas atskaņošanu
    if (!song) {
      displayNotification("No song to play."); // Izvada paziņojumu, ja nav dziesmas ko atskaņot
      return;
    }
    const audio = audioRef.current; // Izveido audio objektu
    audio.src = `http://localhost/backend/${song.file_path}`; // Uzstāda audio avotu
    audio.play(); // Atskaņo dziesmu
    setCurrentSong(song); // Uzstāda currentSong stāvokli
    setIsPlaying(true); // Uzstāda isPlaying stāvokli
    setCurrentPlaylist(playlist); // Uzstāda currentPlaylist stāvokli
    setCurrentPlaylistIndex(index); // Uzstāda currentPlaylistIndex stāvokli
    addToRecentSongs(song); // Pievieno dziesmu nesen atskaņotajām
  };
  

  const handlePlayPause = () => { // Definē handlePlayPause funkciju, kas apstrādā dziesmas atskaņošanu/pauzēšanu
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause(); // Pauzē dziesmu
    } else {
      audio.play(); // Atskaņo dziesmu
      if (currentSong) {
        addToRecentSongs(currentSong); // Pievieno dziesmu nesen atskaņotajām
      }
    }
    setIsPlaying(prevState => !prevState); // Apmaina isPlaying stāvokli
  };

  const handleNext = () => { // Definē handleNext funkciju, kas apstrādā nākamās dziesmas atskaņošanu
    if (currentPlaylist && currentPlaylistIndex !== null) {
      const nextIndex = (currentPlaylistIndex + 1) % currentPlaylist.length;
      handlePlayback(currentPlaylist[nextIndex], currentPlaylist, nextIndex);
    } else if (currentSong) {
      const currentIndex = filteredSongs.findIndex(song => song.song_id === currentSong.song_id);
      const nextIndex = (currentIndex + 1) % filteredSongs.length;
      handlePlayback(filteredSongs[nextIndex]);
    }
  };

  const handlePrevious = () => { // Definē handlePrevious funkciju, kas apstrādā iepriekšējās dziesmas atskaņošanu
    if (currentPlaylist && currentPlaylistIndex !== null) {
      const prevIndex = (currentPlaylistIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
      handlePlayback(currentPlaylist[prevIndex], currentPlaylist, prevIndex);
    } else if (currentSong) {
      const currentIndex = filteredSongs.findIndex(song => song.song_id === currentSong.song_id);
      const prevIndex = (currentIndex - 1 + filteredSongs.length) % filteredSongs.length;
      handlePlayback(filteredSongs[prevIndex]);
    }
  };

  const handleFavoriteToggle = async (isFavorite) => { // Definē handleFavoriteToggle funkciju, kas apstrādā dziesmas pievienošanu/noņemšanu no favorītiem
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
        const data = await response.json(); // Saņem atbildi JSON formātā
        displayNotification(data.message); // Izvada paziņojumu
  
        fetchData();  // Atjauno datus, lai atspoguļotu favorīta statusa izmaiņas
        fetchFavoriteSongs(); // Atjauno favorītu dziesmu sarakstu
      } catch (error) {
        displayNotification('Error adding/removing song from favorites:', error); // Izvada kļūdu
      }
    } else {
      displayNotification('No current song to add/remove from favorites'); // Izvada paziņojumu
    }
  };
  
  

  const displayNotification = (message) => { // Definē displayNotification funkciju, kas parāda paziņojumu
    setNotification(message); // Uzstāda notification stāvokli
    setTimeout(() => {
      setNotification(null); // Noņem paziņojumu pēc 5 sekundēm
    }, 5000);
  };

  const addToPlaylist = (playlistId) => { // Definē addToPlaylist funkciju, kas pievieno dziesmu atskaņošanas sarakstam
    if (currentSongId) {
      fetch('http://localhost/backend/addSongPlaylist.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ songId: currentSongId, playlistId }),
        credentials: 'include'
      })
      .then(response => response.json()) // Saņem atbildi JSON formātā
      .then(data => {
        displayNotification(data.message); // Izvada paziņojumu
        if (data.message === 'Song added to playlist successfully') {
          fetchData(); // Atjauno datus
        }
        setShowModal(false); // Aizver modālo logu
      })
      .catch(error => displayNotification('Error adding song to playlist:', error)); // Izvada kļūdu
    } else {
      displayNotification('Current song ID is null'); // Izvada paziņojumu
    }
  };
  

  const handleSeek = (event) => { // Definē handleSeek funkciju, kas apstrādā dziesmas slīdņa pārvietošanu
    const newPosition = event.target.value; // Saņem jauno pozīciju
    const audio = audioRef.current;
    if (!isNaN(audio.duration) && isFinite(audio.duration)) {
      const newTime = (newPosition / 100) * audio.duration; // Aprēķina jauno laiku
      audio.currentTime = newTime; // Uzstāda jauno laiku
    }
  };

  return ( // Renderē komponentu
    <div>
      <Header handleLogout={handleLogout} handleSearch={handleSearch} /> // Renderē Header komponentu
      <Routes>
        <Route path="/" element={<Home setCurrentSongId={setCurrentSongId} handlePlayback={handlePlayback} songs={filteredSongs} addToPlaylist={addToPlaylist} setShowModal={setShowModal} playlists={playlists} fetchPlaylists={fetchPlaylists} recentSongs={recentSongs} fetchData={fetchData}/>} />
        <Route path="/playlist" element={<Playlist handlePlayback={handlePlayback} fetchPlaylistSongs={fetchPlaylistSongs} playlistSongs={filteredPlaylistSongs} playlists={playlists} fetchPlaylists={fetchPlaylists} userId={userId}/>} />
        <Route path="/home" element={<Home setCurrentSongId={setCurrentSongId} handlePlayback={handlePlayback} currentSong={currentSong} recentSongs={recentSongs} songs={filteredSongs} addToPlaylist={addToPlaylist} setShowModal={setShowModal} playlists={playlists} fetchPlaylists={fetchPlaylists} fetchData={fetchData}/>} />
        <Route path="/upload" element={<MusicUploader />} />
        <Route path="/uploaded-songs" element={<UploadedSongs songs={filteredSongs} handlePlayback={handlePlayback} setCurrentSongId={setCurrentSongId} setShowModal={setShowModal} fetchPlaylists={fetchPlaylists}/>} />
        <Route path="/recents" element={<Recents currentSong={currentSong} recentSongs={filteredRecentSongs} addToPlaylist={addToPlaylist} handlePlayback={handlePlayback} setShowModal={setShowModal} playlists={playlists} setCurrentSongId={setCurrentSongId}  fetchPlaylists={fetchPlaylists}/>} />
        <Route path="/favourites" element={<Favourites setCurrentSongId={setCurrentSongId} handlePlayback={handlePlayback} setShowModal={setShowModal} playlists={playlists} addToPlaylist={addToPlaylist} fetchFavoriteSongs={fetchFavoriteSongs} favoriteSongs={filteredFavoriteSongs}  fetchPlaylists={fetchPlaylists}/>} />
        <Route path="/about" element={<About />} />
        <Route path="/shared-songs" element={<SharedSongs setShowModal={setShowModal} handlePlayback={handlePlayback} setCurrentSongId={setCurrentSongId} playlists={playlists} addToPlaylist={addToPlaylist} userId={userId}/>} />
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
      <Modal show={showModal} onHide={() => setShowModal(false)}> // Renderē modālo logu
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
