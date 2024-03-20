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
import { ListGroup, ListGroupItem, Button, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPlus  } from '@fortawesome/free-solid-svg-icons';
import '../App.css';
import PlaylistModal from './PlaylistModal';
import Notification from "./Notification";

const Playlist = ({ handlePlayback }) => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistSongs, setPlaylistSongs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [showContextMenu, setShowContextMenu] = useState(false);

  useEffect(() => {
    // Fetch playlists from getPlaylists.php
    fetch('http://localhost/backend/getPlaylists.php')
      .then(response => response.json())
      .then(data => setPlaylists(data))
      .catch(error => console.error('Error fetching playlists:', error));
  }, []);

  // Function to fetch songs for the selected playlist
  const fetchPlaylistSongs = (playlistId) => {
    // Fetch songs for the selected playlist from getPlaylistSongs.php
    fetch(`http://localhost/backend/getPlaylistSongs.php?playlistId=${playlistId}`)
      .then(response => response.json())
      .then(data => setPlaylistSongs(data))
      .catch(error => console.error('Error fetching playlist songs:', error));
  };

  // Function to handle click on playlist
  const handlePlaylistClick = (playlistId) => {
    setSelectedPlaylist(playlistId);
    fetchPlaylistSongs(playlistId);
  };

  // Function to handle play button click
  const handlePlayButtonClick = (song) => {
    handlePlayback(song);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Function to display notification
  const displayNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 5000); // Hide notification after 5 seconds
  };

  // Function to handle right-click on playlist
  const handleContextMenu = (event, playlistId) => {
    event.preventDefault(); // Prevent default context menu
    setContextMenuPosition({ x: event.clientX, y: event.clientY }); // Save mouse position
    setSelectedPlaylist(playlistId); // Set the selected playlist
    setShowContextMenu(true); // Show the context menu
  };


  // Function to close the context menu
  const handleCloseContextMenu = () => {
    setShowContextMenu(false);
  };

  const handleEditPlaylist = () => {
    // Logic to handle editing playlist
    handleCloseContextMenu();
  };

  const handleDeletePlaylist = () => {
    // Logic to handle deleting playlist
    handleCloseContextMenu();
  };

  return (
    <>
      <Button variant="primary" onClick={() => setShowModal(true)} className="add-playlist-button">
        <FontAwesomeIcon icon={faPlus} /> Add Playlist
      </Button>
      <ListGroup className="playlist">
        {playlists.map((playlist) => (
          <ListGroupItem key={playlist.playlist_id} className="plistitem" onClick={() => handlePlaylistClick(playlist.playlist_id)} onContextMenu={(e) => handleContextMenu(e, playlist.playlist_id)}>
            <img
                src={playlist.playlist_cover ? `http://localhost/backend/${playlist.playlist_cover}` : 'http://localhost/backend/covers/noImage.jpg'}
                alt={`${playlist.playlist_name} cover`}
                className="playlist-image"
              />
            <div>{playlist.playlist_name}</div>
          </ListGroupItem>
        ))}
      </ListGroup>
      <PlaylistModal show={showModal} handleClose={handleCloseModal}  displayNotification={displayNotification}/>
      {selectedPlaylist && (
        <ListGroup className="playlist">
          {playlistSongs.map((song, index) => (
            <ListGroupItem key={index} className="plistitem">
              <img
                src={song.cover_path ? `http://localhost/backend/${song.cover_path}` : 'http://localhost/backend/covers/noImage.jpg'}
                alt={`${song.song_title} cover`}
                className="playlist-image"
              />
              <div className="song-info">
                <div>{song.song_title}</div>
                <div>{song.artist}</div>
              </div>
              <Button className="play-button" onClick={() => handlePlayButtonClick(song)}>
                <FontAwesomeIcon icon={faPlay} />
              </Button>
            </ListGroupItem>
          ))}
        </ListGroup>
      )}
       <Dropdown
        style={{ position: 'absolute', top: contextMenuPosition.y, left: contextMenuPosition.x }}
        show={showContextMenu}
        onClose={handleCloseContextMenu}
        onHide={handleCloseContextMenu}
      >

        <Dropdown.Menu>
          <Dropdown.Item onClick={handleEditPlaylist}>Edit</Dropdown.Item>
          <Dropdown.Item onClick={handleDeletePlaylist}>Delete</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      {notification && <Notification message={notification} onClose={() => setNotification(null)} />} 
    </>
  );
};

export default Playlist;

