import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import Notification from './Notification';
import '../App.css';

const MusicUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [notification, setNotification] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('file', selectedFile);

    fetch('http://localhost/backend/uploadMusic.php', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      setNotification(data.message);
      setTimeout(() => {
        setNotification(null);
      }, 5000); // Hide notification after 5 seconds
    })
    .catch(error => console.error('Error:', error));
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  return (
    <div className="music-uploader">
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Choose Music File</Form.Label>
        <Form.Control type="file" accept=".mp3" onChange={handleFileChange} />
      </Form.Group>
      <Button variant="primary" onClick={handleUpload}>Upload Music</Button>
      {notification && <Notification message={notification} onClose={handleCloseNotification} />}
    </div>
  );
};

export default MusicUploader;
