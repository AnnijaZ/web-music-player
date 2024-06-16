import React, { useEffect } from "react";
import { Container, Row, Col, Button, ListGroup, ListGroupItem } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPlus } from '@fortawesome/free-solid-svg-icons';
import '../App.css';

const Home = ({
  handlePlayback, 
  songs = [], // Nodrošina, ka songs vienmēr ir masīvs
  recentSongs = [], // Nodrošina, ka recentSongs vienmēr ir masīvs
  setShowModal, 
  fetchPlaylists, 
  setCurrentSongId,
  fetchData 
}) => {

  useEffect(() => {
    fetchData(); // Iegūst datus, kad komponents tiek ielādēts
  }, []);

  const validSongs = Array.isArray(songs) && songs.length > 0; // Pārbauda, vai songs ir derīgs masīvs
  const latestUploads = validSongs ? songs.sort((a, b) => b.song_id - a.song_id).slice(0, 5) : []; // Atlasīt pēdējos augšupielādes

  const playSong = (song) => {
    handlePlayback(song); // Atskaņo izvēlēto dziesmu
  };

  return (
    <Container fluid className="home">
      <Row className="justify-content-center">
        <Col xs={12} md={5}>
          <h2 style={{ color: 'white', textAlign: 'center', marginTop: '20px' }}>Recently Played</h2>
          {recentSongs.length > 0 ? (
            <ListGroup className="playlist-home">
              {recentSongs.slice(0, 5).map((song, index) => ( 
                <ListGroupItem key={index} className="plistitem-home">
                  <img
                      src={song.cover_path ? `http://localhost/backend/${song.cover_path}` : 'http://localhost/backend/covers/noImage.jpg'}
                      alt={`${song.song_title} cover`}
                      className="playlist-home-image"
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
          ) : (
            <p style={{ color: 'white', textAlign: 'center' }}>No recent songs played</p> // Paziņojums, ja nav nesen atskaņotu dziesmu
          )}
        </Col>
        <Col xs={12} md={5}>
          <h2 style={{ color: 'white', textAlign: 'center', marginTop: '20px' }}>Recently Uploaded</h2>
          {latestUploads.length > 0 ? (
            <ListGroup className="playlist-home">
              {latestUploads.map((song, index) => (
                <ListGroupItem key={index} className="plistitem-home">
                  <img
                      src={song.cover_path ? `http://localhost/backend/${song.cover_path}` : 'http://localhost/backend/covers/noImage.jpg'}
                      alt={`${song.song_title} cover`}
                      className="playlist-home-image"
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
          ) : (
            <p style={{ color: 'white', textAlign: 'center' }}>No latest uploads</p> // Paziņojums, ja nav nesen augšupielādētu dziesmu
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
