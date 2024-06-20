import React, { useEffect, useState } from 'react';
import { Container, Row, Col, ListGroup, ListGroupItem, Button } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPlus } from '@fortawesome/free-solid-svg-icons';
import '../../App.css';
import './SharedSongs.css';
import { Pagination } from 'antd'; 

const SharedSongs = ({ setShowModal, handlePlayback, setCurrentSongId, playlists, addToPlaylist }) => {
  const [sharedSongs, setSharedSongs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const songsPerPage = 5;

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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastSong = currentPage * songsPerPage;
  const indexOfFirstSong = indexOfLastSong - songsPerPage;
  const currentSongs = sharedSongs.slice(indexOfFirstSong, indexOfLastSong);

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={10}>
          <h2 style={{ color: 'white', textAlign: 'center' }}>Shared Songs</h2>
          {sharedSongs.length > 0 ? (
            <>
              <ListGroup className="playlist">
                {currentSongs.map((song, index) => (
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
                ))}
              </ListGroup>
              <Pagination
                current={currentPage}
                pageSize={songsPerPage}
                total={sharedSongs.length}
                onChange={handlePageChange}
                style={{ textAlign: 'center', marginTop: '20px' }}
                className="custom-pagination"
              />
            </>
          ) : (
            <div className="notification-item">
              <div className="notification-content">
                No shared songs available
              </div>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default SharedSongs;
