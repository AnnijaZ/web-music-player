import React, { useState, useEffect } from 'react';
import { Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Pagination } from 'antd';
import '../App.css';

const Recents = ({ fetchPlaylists, recentSongs, setShowModal, handlePlayback, setCurrentSongId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const songsPerPage = 5; // Set the number of songs per page

  useEffect(() => {
    fetchPlaylists();
    // Add any other necessary fetches
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastSong = currentPage * songsPerPage;
  const indexOfFirstSong = indexOfLastSong - songsPerPage;
  const currentSongs = recentSongs.slice(indexOfFirstSong, indexOfLastSong);

  return (
    <>
      <h2 style={{ color: 'white', textAlign: 'center' }}>Recents</h2>
      {recentSongs.length === 0 ? (
        <p style={{ color: 'white', textAlign: 'center' }}>No songs to display</p>
      ) : (
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
                  fetchPlaylists();
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
            total={recentSongs.length}
            onChange={handlePageChange}
            style={{ textAlign: 'center', marginTop: '20px'}}
            className="custom-pagination"
          />
        </>
      )}
    </>
  );
};

export default Recents;
