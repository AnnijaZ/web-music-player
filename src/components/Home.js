import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPlus } from '@fortawesome/free-solid-svg-icons'; // Import the plus icon
import Notification from "./Notification";
import '../App.css';

const Home = ({ handlePlayback, songs }) => {
  // const [songs, setSongs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [currentSongId, setCurrentSongId] = useState(null); // New state variable to store the current song ID
  const [notification, setNotification] = useState(null);


  /*useEffect(() => {
    fetch('http://localhost/backend/getData.php')
      .then(response => response.json())
      .then(data => setSongs(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);*/

  const displayNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  // Function to fetch playlists from getPlaylists.php
  const fetchPlaylists = () => {
    fetch('http://localhost/backend/getPlaylists.php')
      .then(response => response.json())
      .then(data => setPlaylists(data))
      .catch(error => console.error('Error fetching playlists:', error));
  };

  const playSong = (song) => {
    handlePlayback(song);
  };

  // Function to handle adding song to playlist
  const addToPlaylist = (playlistId) => {
    // Check if currentSongId is valid
    if (currentSongId) {
        console.log(currentSongId);
        fetch('http://localhost/backend/addSongPlaylist.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ songId: currentSongId, playlistId }), // Use currentSong.song_id here
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
    <Container fluid className="home">
      <Row>
        {songs.map((song) => (
          <Col key={song.song_id} xs={12} sm={6} md={4} lg={3} className="album-item">
            <div className="album-cover">
              <img src={song.cover_path ? `http://localhost/backend/${song.cover_path}` : 'http://localhost/backend/covers/noImage.jpg'} alt={`${song.song_title} Cover`} />
            </div>
            <div className="album-info">
              <p className="album-title">{song.song_title}</p>
              <p className="album-artist">{song.artist}</p>
              <Button className="play-button" onClick={() => playSong(song)}>
                <FontAwesomeIcon icon={faPlay} />
              </Button>
              <Button className="add-button" onClick={() => {
                setCurrentSongId(song.song_id); // Set current song ID when add button is clicked
                fetchPlaylists(); // Fetch playlists when the add button is clicked
                setShowModal(true);
              }}>
                <FontAwesomeIcon icon={faPlus} />
              </Button>
            </div>
          </Col>
        ))}
      </Row>
      {/* Modal to display playlists */}
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
    </Container>
  );
};

export default Home;
