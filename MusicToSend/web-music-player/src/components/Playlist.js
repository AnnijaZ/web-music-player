import React, { useState, useRef, useEffect } from "react";
import { Popconfirm } from 'antd';
import { ListGroup, ListGroupItem, Button, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import '../App.css';  
import PlaylistModal from './PlaylistModal';
import Notification from "./Notification";
import PlaylistSongs from "./PlaylistSongs";

const Playlist = ({ handlePlayback, fetchPlaylistSongs, playlistSongs, playlists, fetchPlaylists, userId }) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [editPlaylistName, setEditPlaylistName] = useState('');
  const [playlistSelected, setPlaylistSelected] = useState(false);
  const contextMenuRef = useRef(null);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handlePlaylistClick = (event, playlistId) => {
    setPlaylistSelected(true);
    if (event.button === 0) {
      setSelectedPlaylist(playlistId);
      fetchPlaylistSongs(playlistId);
    }
  };

  const handlePlayButtonClick = (song, index) => {
    handlePlayback(song, playlistSongs, index);
  };  

  const handleCloseModal = () => {
    fetchPlaylists();
    setShowModal(false);
    setPlaylistSelected(false);
  };

  const displayNotification = (message) => {
    setNotification(message); // Iestata paziņojuma ziņojumu
    setTimeout(() => {
      setNotification(null); // Pēc 5 sekundēm paziņojumu noņem
    }, 5000);
};

const handleContextMenu = (event, playlistId) => {
    event.preventDefault(); // Novērš noklusējuma darbību (konteksta izvēlne)
    setContextMenuPosition({ x: event.clientX, y: event.clientY }); // Iestata konteksta izvēlnes pozīciju
    setSelectedPlaylist(playlistId); // Iestata izvēlēto atskaņošanas sarakstu
    setPlaylistSelected(false); // Atceļ izvēli atskaņošanas sarakstam
    setShowContextMenu(true); // Rāda konteksta izvēlni
};

const handleCloseContextMenu = () => {
    fetchPlaylists(); // Atjauno atskaņošanas sarakstu datus
    setShowContextMenu(false); // Aizver konteksta izvēlni
};

const handleEditPlaylist = () => {
    const selectedPlaylistData = playlists.find(playlist => playlist.playlist_id === selectedPlaylist); // Atrod izvēlēto atskaņošanas sarakstu

    if (selectedPlaylistData) {
      setEditPlaylistName(selectedPlaylistData.playlist_name); // Iestata rediģējamo atskaņošanas saraksta nosaukumu
      setShowContextMenu(false); // Aizver konteksta izvēlni
      setShowModal(true); // Rāda atskaņošanas saraksta modālo logu
    }
  
    handleCloseContextMenu(); // Aizver konteksta izvēlni
};

const handleDeletePlaylist = () => {
    fetch('http://localhost/backend/deletePlaylist.php', {
      method: 'DELETE', // Norāda dzēšanas metodi
      headers: {
        'Content-Type': 'application/json', // Norāda saturu kā JSON
      },
      body: JSON.stringify({ playlistId: selectedPlaylist }), // Nosūta atskaņošanas saraksta ID
      credentials: 'include'  // Iekļauj sīkdatnes pieprasījumā
    })
    .then(response => response.json())
    .then(data => {
      displayNotification(data.message); // Rāda paziņojumu ar atbildes ziņojumu
      fetchPlaylists(); // Atjauno atskaņošanas sarakstu datus
    })
    .catch(error => displayNotification('Error:', error)); // Rāda kļūdas paziņojumu
    handleCloseContextMenu(); // Aizver konteksta izvēlni
};

  const handleRemoveSongFromPlaylist = (songId, playlistId, userId) => {
    fetch('http://localhost/backend/removeSongFromPlaylist.php', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ songId, playlistId, userId }),
      credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
      displayNotification(data.message);
      fetchPlaylistSongs(playlistId); // Ensure we pass the playlistId here as well
    })
    .catch(error => displayNotification('Error:', error));
  };

  const handleBackButtonClick = () => {
    setSelectedPlaylist(null);
    setPlaylistSelected(false);
  };

  return (
    <>
      {(!selectedPlaylist || showContextMenu || showModal || !playlistSelected) && (
        <>
          <Button variant="primary" onClick={() => setShowModal(true)} className="add-playlist-button">
            <FontAwesomeIcon icon={faPlus} /> Add Playlist
          </Button>
          {playlists.length > 0 ? (
            <ListGroup className="playlist">
              {playlists.map((playlist) => (
                <ListGroupItem key={playlist.playlist_id} className="plistitem" onClick={(e) => handlePlaylistClick(e, playlist.playlist_id)} onContextMenu={(e) => handleContextMenu(e, playlist.playlist_id)}>
                  <img
                      src={playlist.playlist_cover ? `http://localhost/backend/${playlist.playlist_cover}` : 'http://localhost/backend/covers/noImage.jpg'}
                      alt={`${playlist.playlist_name} cover`}
                      className="playlist-image"
                    />
                  <div>{playlist.playlist_name}</div>
                </ListGroupItem>
              ))}
            </ListGroup>
          ) : (
            <div style={{ color: 'white', textAlign: 'center', marginTop: '20px' }}>No playlists to display</div>
          )}
          <PlaylistModal show={showModal} handleClose={handleCloseModal} displayNotification={displayNotification} editPlaylistName={editPlaylistName} playlistId={selectedPlaylist}/>
        </>
      )}
      {playlistSelected && !showContextMenu && !showModal && (
        <PlaylistSongs
          selectedPlaylist={selectedPlaylist}
          playlistSongs={playlistSongs}
          handlePlayButtonClick={handlePlayButtonClick}
          handleBackButtonClick={handleBackButtonClick}
          handleRemoveSongFromPlaylist={handleRemoveSongFromPlaylist}
          userId={userId}
        />
      )}
      {showContextMenu && (
        <Dropdown.Menu
          ref={contextMenuRef}
          show={showContextMenu}
          style={{ position: 'absolute', top: contextMenuPosition.y, left: contextMenuPosition.x }}
        >
          <Dropdown.Item onClick={handleEditPlaylist}>Edit</Dropdown.Item>
          <Dropdown.Item>
            <Popconfirm
              title="Are you sure you want to delete this playlist?"
              onConfirm={handleDeletePlaylist}
              okText="Yes"
              cancelText="No"
            >
              <div>Delete</div>
            </Popconfirm>
          </Dropdown.Item>
        </Dropdown.Menu>
      )}
      {notification && <Notification message={notification} onClose={() => setNotification(null)} />} 
    </>
  );  
};

export default Playlist;
