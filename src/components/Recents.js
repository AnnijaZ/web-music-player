import React from 'react';
import { Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPlus } from '@fortawesome/free-solid-svg-icons';

const Recents = ({ fetchPlaylists, recentSongs, setShowModal, handlePlayback, setCurrentSongId }) => {
  return (
    <>
      <h2 style={{ color: 'white', textAlign: 'center' }}>Recents</h2>
      {recentSongs.length === 0 ? (
        <p style={{ color: 'white' }}>No songs to display</p>
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
                }}
            >
                <FontAwesomeIcon icon={faPlus} />
            </Button>
            </ListGroupItem>
            ))}
        </ListGroup>
      )}
    </>
  );
};

export default Recents;
