import React, { useState } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic, faUpload } from '@fortawesome/free-solid-svg-icons';
import Notification from './Notification';
import '../App.css';

const MusicUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [notification, setNotification] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
  const ALLOWED_FILE_TYPES = ['audio/mpeg', 'audio/mp3'];

  const handleDragOver = (e) => {
    e.preventDefault();  // Prevent default behavior (Prevent file from being opened)
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleFileChange = (event) => {
    if (event.target.files[0]) {
      const file = event.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const validateFile = (file) => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setNotification("Invalid file type. Only MP3 files are allowed.");
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      setNotification("File size exceeds the limit of 10 MB.");
      return false;
    }
    return true;
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setNotification("No file selected!");
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    fetch('http://localhost/backend/uploadMusic.php', {
      method: 'POST',
      body: formData,
      credentials: 'include'  // Ensure cookies are included with the request
    })
    .then(response => response.json())
    .then(data => {
      setNotification(data.message);
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    })
    .catch(error => {
      console.error('Error:', error);
      setNotification("Upload failed!");
    });
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  return (
    <Container className="music-uploader">
        <h2 style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Upload songs</h2>
      <Row className="justify-content-center">
        <Col md={6}>
          <div
            className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('fileInput').click()} // Simulate file input click on drop zone click
          >
            {selectedFile ? (
              <div className="file-info">
                <FontAwesomeIcon icon={faMusic} />
                <span>{selectedFile.name}</span>
              </div>
            ) : (
              <div>
                <FontAwesomeIcon icon={faUpload} size="3x" />
                <p>Drag and drop file here, or click to select file</p>
              </div>
            )}
            <Form.Control
              id="fileInput"
              type="file"
              accept=".mp3"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>
          <Button className={!selectedFile ? "upload-btn button-disabled" : "upload-btn"} variant="primary" onClick={handleUpload} disabled={!selectedFile}>Upload Music</Button>
          {notification && <Notification message={notification} onClose={handleCloseNotification} />}
        </Col>
      </Row>
    </Container>
  );
};

export default MusicUploader;
