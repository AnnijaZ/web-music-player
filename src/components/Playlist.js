import React, { useState, useEffect, useRef } from "react";
import { Popconfirm } from 'antd';
import { ListGroup, ListGroupItem, Button, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import '../App.css';  
import PlaylistModal from './PlaylistModal';
import Notification from "./Notification";
import PlaylistSongs from "./PlaylistSongs";

const Playlist = ({ handlePlayback, fetchPlaylistSongs, playlistSongs }) => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [editPlaylistName, setEditPlaylistName] = useState('');
  const [playlistSelected, setPlaylistSelected] = useState(false);
  const contextMenuRef = useRef(null);

  const fetchPlaylists = () => {
    fetch('http://localhost/backend/getPlaylists.php', {
      credentials: 'include'  // Ensures cookies are included
    })
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPlaylists(data);
        } else {
          setPlaylists([]); // Ensure data is always an array
        }
      })
      .catch(error => {
        displayNotification('Error fetching playlists:', error);
        setNotification("Failed to fetch playlists");
      });
  };

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
    fetch('http://localhost/backend/deletePlaylist.php', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ playlistId: selectedPlaylist }),
      credentials: 'include'  // Ensure cookies are included with the request
    })
    .then(response => response.json())
    .then(data => {
      displayNotification(data.message);
      fetchPlaylists();
    })
    .catch(error => displayNotification('Error:', error));
    handleCloseContextMenu();
  };

  const handleRemoveSongFromPlaylist = (songId) => {
    fetch(`http://localhost/backend/removeSongFromPlaylist.php?songId=${songId}`, {
      method: 'DELETE',
      credentials: 'include'  // Ensure cookies are included with the request
    })
    .then(response => response.json())
    .then(data => {
      displayNotification(data.message);
      fetchPlaylistSongs(selectedPlaylist);
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

