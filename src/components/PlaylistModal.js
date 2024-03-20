import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const PlaylistModal = ({ show, handleClose, displayNotification }) => {
  const [playlistName, setPlaylistName] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [validated, setValidated] = useState(false);

  const handleAddPlaylist = (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      const formData = new FormData();
      formData.append('playlistName', playlistName);
      formData.append('coverImage', coverImage);

      fetch('http://localhost/backend/addPlaylist.php', {
        method: 'POST',
        body: formData,
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        handleClose();
        displayNotification(data.message);
      })
      .catch(error => console.error('Error adding playlist:', error));
    }

    setValidated(true);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Playlist</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={handleAddPlaylist}>
          <Form.Group controlId="playlistName">
            <Form.Label>Playlist Name</Form.Label>
            <Form.Control
              type="text"
              required
              placeholder="Enter playlist name"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please enter a playlist name.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="coverImage">
            <Form.Label>Cover Image</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setCoverImage(e.target.files[0])}
            />
          </Form.Group>
          <Modal.Footer>
          <Button variant="primary" type="submit">
            Add Playlist
          </Button>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default PlaylistModal;
