import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPlus } from '@fortawesome/free-solid-svg-icons'; // Import the plus icon
import '../App.css';

const Favourites = ({ addToPlaylist, handlePlayback, setCurrentSongId, fetchPlaylists, setShowModal }) => {
  const [favoriteSongs, setFavoriteSongs] = useState([]);

  useEffect(() => {
    const fetchFavoriteSongs = async () => {
      try {
        const response = await fetch('http://localhost/backend/getFavourites.php');
        const data = await response.json();
        setFavoriteSongs(data);
      } catch (error) {
        console.error('Error fetching favorite songs:', error);
      }
    };

    fetchFavoriteSongs();
  }, []);

  const playSong = (song) => {
    handlePlayback(song);
  };

  return (
    <div>
      <h2 style={{ color: 'white', textAlign: 'center' }}>Favorites</h2>
      <Container fluid className="home">
      <Row>
        {favoriteSongs.map((song) => (
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
    </Container>
    </div>
  );
};

export default Favourites;

