import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPlus } from '@fortawesome/free-solid-svg-icons'; // Import the plus icon
import { Pagination } from 'antd'; // Import antd pagination
import '../App.css';

const Favourites = ({ addToPlaylist, handlePlayback, setCurrentSongId, fetchPlaylists, setShowModal, fetchFavoriteSongs, favoriteSongs }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const songsPerPage = 8; // Set the number of songs per page

  useEffect(() => {
    fetchFavoriteSongs();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastSong = currentPage * songsPerPage;
  const indexOfFirstSong = indexOfLastSong - songsPerPage;
  const currentSongs = favoriteSongs.slice(indexOfFirstSong, indexOfLastSong);

  const playSong = (song) => {
    handlePlayback(song);
  };

  return (
    <div>
      <h2 style={{ color: 'white', textAlign: 'center' }}>Favorites</h2>
      <Container fluid className="home">
        <Row>
          {currentSongs && currentSongs.length > 0 ? (
            currentSongs.map((song) => (
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
                    setCurrentSongId(song.song_id);
                    fetchPlaylists();
                    setShowModal(true);
                  }}>
                    <FontAwesomeIcon icon={faPlus} />
                  </Button>
                </div>
              </Col>
            ))
          ) : (
            <p style={{ color: 'white', textAlign: 'center' }}>No Favorite Songs Available</p>
          )}
        </Row>
        {favoriteSongs && favoriteSongs.length > 0 && (
          <Pagination
            current={currentPage}
            pageSize={songsPerPage}
            total={favoriteSongs.length}
            onChange={handlePageChange}
            style={{ textAlign: 'center', marginTop: '20px'}}
            className="custom-pagination"
          />
        )}
      </Container>
    </div>
  );
};

export default Favourites;
