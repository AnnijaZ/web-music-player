import React, { useEffect, useState } from 'react';
import { Container, Row, Col, ListGroup, ListGroupItem, Badge, Button, Modal } from 'react-bootstrap';
import './UserNotifications.css';
import axios from 'axios';

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://localhost/backend/getNotifications.php', {
          withCredentials: true,
        });
        if (Array.isArray(response.data)) {
          setNotifications(response.data);
        } else {
          setNotifications([]);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotifications([]);
      }
    };

    fetchNotifications();
  }, []);

  const handleAddSong = async (songId) => {
    try {
      await axios.post('http://localhost/backend/addSharedSong.php', { songId }, {
        withCredentials: true,
      });
      alert('Song added to your profile!');
      setShowModal(false);
    } catch (error) {
      console.error('Error adding song:', error);
      alert('Failed to add song.');
    }
  };

  return (
    <Container className="notifications-container">
      <Row className="justify-content-center">
        <Col xs={12} md={10}>
          <div className="notifications-header">
            <h2>Notifications</h2>
            <Badge pill variant="info" className="notifications-count">
              {notifications.length}
            </Badge>
            <button className="mark-all-read">Mark all as read</button>
          </div>
          <ListGroup className="notifications-list">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <ListGroupItem key={notification.id} className="notification-item">
                  <div className="notification-content">
                    <div style={{color:'white'}}>
                      {notification.message}
                    </div>
                    <small className="text-muted" style={{color:'white'}}>{new Date(notification.created_at).toLocaleString()}</small>
                  </div>
                  {notification.song_id && (
                    <Button variant="primary" onClick={() => { setSelectedSong(notification.song_id); setShowModal(true); }}>
                      Add to My Songs
                    </Button>
                  )}
                </ListGroupItem>
              ))
            ) : (
              <ListGroupItem className="notification-item">
                <div className="notification-content" style={{color: 'white', textAlign: 'center'}}>
                  No notifications available
                </div>
              </ListGroupItem>
            )}
          </ListGroup>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Add Song</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to add this song to your profile?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={() => handleAddSong(selectedSong)}>Add Song</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserNotifications;
