  import React, { useState, useEffect } from "react";
  import { Modal, Form, Button } from "react-bootstrap";

  const PlaylistModal = ({ show, handleClose, displayNotification, editPlaylistName, playlistId  }) => {
    const [playlistName, setPlaylistName] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [validated, setValidated] = useState(false);

    useEffect(() => {
      // If editPlaylistName prop has a value, set the playlist name for editing
      if (editPlaylistName) {
        setPlaylistName(editPlaylistName);
      } else {
        // If not, clear the playlist name
        setPlaylistName('');
      }
    }, [editPlaylistName]);


    const handleAction = (event) => {
      event.preventDefault();
      const form = event.currentTarget;

      if (form.checkValidity() === false) {
        event.stopPropagation();
      } else {
        const formData = new FormData();
        formData.append('playlistName', playlistName);
        formData.append('coverImage', coverImage);

        if (editPlaylistName) {
          formData.append('playlistId', playlistId);
        }

        // Use different endpoint based on whether editing or adding playlist
        const endpoint = editPlaylistName ? 'editPlaylist.php' : 'addPlaylist.php';

        fetch(`http://localhost/backend/${endpoint}`, {
          method: 'POST',
          body: formData,
          credentials: 'include'  // Ensures cookies are included
        })
        .then(response => response.json())
        .then(data => {
          handleClose();
          displayNotification(data.message);
        })
        .catch(error => console.error('Error:', error));
      }

      setValidated(true);
    };

    const handleCloseModal = () => {
      setPlaylistName('');
      setCoverImage(null); // Reset coverImage state
      setValidated(false); // Reset validated state
      handleClose();
    };

    return (
      <Modal show={show} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editPlaylistName ? 'Edit Playlist' : 'Add Playlist'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleAction}>
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
                {editPlaylistName ? 'Save Changes' : 'Add Playlist'}
              </Button>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    );
  };

  export default PlaylistModal;
