import React from 'react';
import Toast from 'react-bootstrap/Toast';

const Notification = ({ message, onClose }) => {
  return (
    <Toast
      onClose={onClose}
      show={true}
      autohide
      style={{
        position: 'fixed',
        top: '-100px', // Initially off-screen
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: '9999',
        minWidth: '200px',
        animation: 'slideIn 0.5s forwards, slideOut 0.5s forwards 2.5s', // Slide in, then slide out after 2.5 seconds
        backgroundColor: '#1d1d1d', // Background color
        color: 'white', // Text color
      }}
    >
      <Toast.Header style={{ backgroundColor: '#1d1d1d', color: 'white' }}> {/* Header background and text color */}
        <strong className="me-auto">Notification</strong>
      </Toast.Header>
      <Toast.Body>{message}</Toast.Body>
    </Toast>
  );
};

export default Notification;
