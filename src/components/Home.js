import React from "react";
import { Container, Row, Col, Button, ListGroup, ListGroupItem } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPlus } from '@fortawesome/free-solid-svg-icons';
import '../App.css';

const Home = ({
  handlePlayback, 
  songs = [], // Provide a default value for songs
  recentSongs = [], // Provide a default value for recentSongs
  setShowModal, 
  fetchPlaylists, 
  setCurrentSongId 
}) => {
  // Calculate latest uploads assuming songs is defined and non-null
  const latestUploads = songs.sort((a, b) => b.song_id - a.song_id).slice(0, 5);

  const playSong = (song) => {
    handlePlayback(song);
  };

  return (
    <Container fluid className="home">
      <Row>
        <Col xs={12} md={6}>
          <h2 style={{ color: 'white', textAlign: 'center' }}>Recently Played</h2>
          {recentSongs.length === 0 ? (
            <p style={{ color: 'white', textAlign: 'center' }}>No recent songs played</p>
          ) : (
            <ListGroup className="playlist">
              {recentSongs.map((song, index) => (
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
                      fetchPlaylists();
                      setShowModal(true);
                  }}>
                      <FontAwesomeIcon icon={faPlus} />
                  </Button>
                </ListGroupItem>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col xs={12} md={6}>
          <h2 style={{ color: 'white', textAlign: 'center' }}>Recently Uploaded</h2>
          {latestUploads.length === 0 ? (
            <p style={{ color: 'white', textAlign: 'center' }}>No latest uploads</p>
          ) : (
            <ListGroup className="playlist">
              {latestUploads.map((song, index) => (
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
                      fetchPlaylists();
                      setShowModal(true);
                  }}>
                      <FontAwesomeIcon icon={faPlus} />
                  </Button>
                </ListGroupItem>
              ))}
            </ListGroup>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
