// import React, { useState, useEffect } from "react";
// import { ListGroup, ListGroupItem, Button } from "react-bootstrap";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlay } from '@fortawesome/free-solid-svg-icons';
// import '../App.css';

// const Playlist = ({ handlePlayback }) => {
//   const [songs, setSongs] = useState([]);

//   useEffect(() => {
//     // Fetch data from getData.php
//     fetch('http://localhost/backend/getData.php')
//       .then(response => response.json())
//       .then(data => setSongs(data))
//       .catch(error => console.error('Error fetching data:', error));
//   }, []); // Empty dependency array ensures useEffect runs only once

//   return (
//     <ListGroup className="playlist">
//       {songs.map((song, index) => (
//         <ListGroupItem key={index} className="plistitem">
//           <img
//             src={song.cover_path ? `http://localhost/backend/${song.cover_path}` : 'http://localhost/backend/covers/noImage.jpg'}
//             alt={`${song.song_title} cover`}
//             className="playlist-image"
//           />
//           <div className="song-info">
//             <div>{song.song_title}</div>
//             <div>{song.artist}</div>
//           </div>
//           <Button className="play-button" onClick={() => handlePlayback(song)}>
//             <FontAwesomeIcon icon={faPlay} />
//           </Button>
//         </ListGroupItem>
//       ))}
//     </ListGroup>
//   );
// };

// export default Playlist;

import React, { useState, useEffect } from "react";
import { Popconfirm } from 'antd';
import { ListGroup, ListGroupItem, Button, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'; // Added faArrowLeft icon
import '../App.css';  
import PlaylistModal from './PlaylistModal';
import Notification from "./Notification";
import PlaylistSongs from "./PlaylistSongs"; // Import PlaylistSongs component

const Playlist = ({ handlePlayback }) => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistSongs, setPlaylistSongs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [editPlaylistName, setEditPlaylistName] = useState('');
  const [playlistSelected, setPlaylistSelected] = useState(false);

  const fetchPlaylists = () => {
    fetch('http://localhost/backend/getPlaylists.php')
      .then(response => response.json())
      .then(data => setPlaylists(data))
      .catch(error => console.error('Error fetching playlists:', error));
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylistSongs = (playlistId) => {
    fetch(`http://localhost/backend/getPlaylistSongs.php?playlistId=${playlistId}`)
      .then(response => response.json())
      .then(data => setPlaylistSongs(data))
      .catch(error => console.error('Error fetching playlist songs:', error));
  };

  const handlePlaylistClick = (event, playlistId) => {
    setPlaylistSelected(true);
    if (event.button === 0) {
      setSelectedPlaylist(playlistId);
      fetchPlaylistSongs(playlistId);
    }
  };

  const handlePlayButtonClick = (song) => {
    handlePlayback(song);
  };

  const handleCloseModal = () => {
    fetchPlaylists();
    setShowModal(false);
    setPlaylistSelected(false);

  };

  const displayNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleContextMenu = (event, playlistId) => {
    event.preventDefault();
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setSelectedPlaylist(playlistId);
    setPlaylistSelected(false);
    setShowContextMenu(true); 
  };

  const handleCloseContextMenu = () => {
    fetchPlaylists();
    setShowContextMenu(false);
  };

  const handleEditPlaylist = () => {
    const selectedPlaylistData = playlists.find(playlist => playlist.playlist_id === selectedPlaylist);

    if (selectedPlaylistData) {
      setEditPlaylistName(selectedPlaylistData.playlist_name);
      setShowContextMenu(false); // Close the context menu
      setShowModal(true); // Open the PlaylistModal
    }
  
    handleCloseContextMenu();
  };

  const handleDeletePlaylist = () => {
    fetch(`http://localhost/backend/deletePlaylist.php?playlistId=${selectedPlaylist}`, {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
      displayNotification(data.message);
      fetchPlaylists();
    })
    .catch(error => console.error('Error:', error));
    handleCloseContextMenu();
  };
  
  const handleRemoveSongFromPlaylist = (songId) => {
    fetch(`http://localhost/backend/removeSongFromPlaylist.php?songId=${songId}`, {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
      displayNotification(data.message);
      fetchPlaylistSongs(selectedPlaylist);
    })
    .catch(error => console.error('Error:', error));
  };

  const handleBackButtonClick = () => {
    setSelectedPlaylist(null);
    setPlaylistSelected(false)
  };

  return (
    <>
      {(!selectedPlaylist || showContextMenu || showModal || !playlistSelected) && (
        <>
          <Button variant="primary" onClick={() => setShowModal(true)} className="add-playlist-button">
            <FontAwesomeIcon icon={faPlus} /> Add Playlist
          </Button>
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
          <PlaylistModal show={showModal} handleClose={handleCloseModal} displayNotification={displayNotification} editPlaylistName={editPlaylistName}  playlistId={selectedPlaylist}/>
        </>
      )}
      {playlistSelected && !showContextMenu && !showModal && (
        <PlaylistSongs
          selectedPlaylist={selectedPlaylist}
          playlistSongs={playlistSongs}
          handlePlayButtonClick={handlePlayButtonClick}
          handleBackButtonClick={handleBackButtonClick}
          handleRemoveSongFromPlaylist={handleRemoveSongFromPlaylist}
        />
      )}
      {showContextMenu && (
        <Dropdown
          style={{ position: 'absolute', top: contextMenuPosition.y, left: contextMenuPosition.x }}
          show={showContextMenu}
          onClose={handleCloseContextMenu}
          onHide={handleCloseContextMenu}
        >
          <Dropdown.Menu>
            <Dropdown.Item onClick={handleEditPlaylist}>Edit</Dropdown.Item>
            <Popconfirm
              title="Are you sure you want to delete this playlist?"
              onConfirm={handleDeletePlaylist}
              okText="Yes"
              cancelText="No"
            >
              <Dropdown.Item>Delete</Dropdown.Item>
            </Popconfirm>
          </Dropdown.Menu>
        </Dropdown>
      )}
      {notification && <Notification message={notification} onClose={() => setNotification(null)} />} 
    </>
  );  
};

export default Playlist;


