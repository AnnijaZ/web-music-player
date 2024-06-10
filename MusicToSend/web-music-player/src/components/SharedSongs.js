import React, { useEffect, useState } from 'react';
import { Container, Row, Col, ListGroup, ListGroupItem, Button } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPlus } from '@fortawesome/free-solid-svg-icons';
import '../App.css';

const SharedSongs = ({ setShowModal, handlePlayback, setCurrentSongId, playlists, addToPlaylist }) => {
  const [sharedSongs, setSharedSongs] = useState([]);

  useEffect(() => {
    const fetchSharedSongs = async () => {
      try {
        const response = await axios.get('http://localhost/backend/getSharedSongs.php', {
          withCredentials: true,
        });
        setSharedSongs(response.data);
      } catch (error) {
        console.error('Error fetching shared songs:', error);
      }
    };

    fetchSharedSongs();
  }, []);

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={10}>
          <h2 style={{ color: 'white', textAlign: 'center' }}>Shared Songs</h2>
          <ListGroup className="playlist">
            {sharedSongs.length > 0 ? (
              sharedSongs.map((song, index) => (
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
                  <Button className="play-button" onClick={() => handlePlayback(song)}>
                    <FontAwesomeIcon icon={faPlay} />
                  </Button>
                  <Button className="add-button" onClick={() => {
                    setCurrentSongId(song.song_id);
                    setShowModal(true);
                  }}>
                    <FontAwesomeIcon icon={faPlus} />
                  </Button>
                </ListGroupItem>
              ))
            ) : (
              <ListGroupItem className="notification-item">
                <div className="notification-content" style={{color: 'white', textAlign: 'center'}}>
                  No shared songs available
                </div>
              </ListGroupItem>
            )}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default SharedSongs;
