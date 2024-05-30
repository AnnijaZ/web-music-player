import React, { useState } from 'react';
import { Container, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPlus } from '@fortawesome/free-solid-svg-icons';
import Pagination from './components/Pagination';
import '../../App.css';

const UploadedSongs = ({ songs, handlePlayback, setCurrentSongId, fetchPlaylists, setShowModal }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [songsPerPage] = useState(10);

  const indexOfLastSong = currentPage * songsPerPage;
  const indexOfFirstSong = indexOfLastSong - songsPerPage;
  const currentSongs = songs.slice(indexOfFirstSong, indexOfLastSong);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const playSong = (song) => {
    handlePlayback(song);
  };

  return (
    <div>
      <h2 style={{ color: 'white', textAlign: 'center' }}>Uploaded Songs</h2>
      <Container fluid className="home">
        <Row>
          {currentSongs.map((song) => (
            <Col key={song.song_id} xs={12} sm={6} md={4} lg={2} className="album-item">
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
                  setCurrentSongId(song.song_id);
                  fetchPlaylists();
                  setShowModal(true);
                }}>
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
              </div>
            </Col>
          ))}
        </Row>
        <Pagination songsPerPage={songsPerPage} totalSongs={songs.length} paginate={paginate} />
      </Container>
    </div>
  );
};

export default UploadedSongs;
