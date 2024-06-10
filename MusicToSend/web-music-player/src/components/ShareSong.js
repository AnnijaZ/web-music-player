// ShareSong.js
import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

const ShareSong = ({ show, handleClose, songId }) => {
  const [receiverId, setReceiverId] = useState('');

  const handleShare = async () => {
    try {
      const response = await axios.post('http://localhost/backend/shareSong.php', {
        song_id: songId,
        receiver_id: receiverId
      });
      if (response.data.success) {
        alert('Song shared successfully');
        handleClose();
      } else {
        alert('Failed to share song');
      }
    } catch (error) {
      console.error('Error sharing song:', error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Share Song</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="receiverId">
            <Form.Label>Receiver User ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter receiver's user ID"
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" onClick={handleShare}>
            Share
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ShareSong;
