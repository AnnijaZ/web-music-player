import React from "react";
import { ListGroup, ListGroupItem, Button } from "react-bootstrap";
import { Popconfirm } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faArrowLeft, faMinus } from '@fortawesome/free-solid-svg-icons';
import "../App.css"

const PlaylistSongs = ({ selectedPlaylist, playlistSongs, handlePlayButtonClick, handleBackButtonClick, handleRemoveSongFromPlaylist }) => {
  return (
    <>
      <Button variant="primary" onClick={handleBackButtonClick} className="add-playlist-button">
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </Button>
      <ListGroup className="playlist">
        {playlistSongs.map((song, index) => (
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
            <Button className="play-button" onClick={() => handlePlayButtonClick(song)}>
              <FontAwesomeIcon icon={faPlay} />
            </Button>
            <Popconfirm
                title={`Are you sure you want to remove "${song.song_title}" from this playlist?`}
                onConfirm={() => handleRemoveSongFromPlaylist(song.song_id)}
                okText="Yes"
                cancelText="No"
              >
                <Button className="minus-button">
                  <FontAwesomeIcon icon={faMinus} />
                </Button>
              </Popconfirm>
          </ListGroupItem>
        ))}
      </ListGroup>
    </>
  );
};

export default PlaylistSongs;
