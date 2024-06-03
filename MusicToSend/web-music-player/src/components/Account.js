import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Notification from './Notification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Account = ({ show, handleClose, handleLogout }) => {
  const [userData, setUserData] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const displayNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost/backend/getUserData.php', {
          method: 'GET',
          credentials: 'include' // Ensures cookies, including session cookies, are sent
        });
        const data = await response.json();
        if (data.error) {
        } else {
          setUserData(data);
        }
      } catch (error) {
        displayNotification('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [show]); // Re-fetch when modal is shown

  const deactivateAccount = async () => {
    try {
      const response = await fetch('http://localhost/backend/deactivateUser.php', {
        method: 'POST',
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        displayNotification('Account deactivated');
        // Call handleLogout after successful deactivation
        handleLogout();
      } else {
        displayNotification('Failed to deactivate account:', data.message);
        // Optionally show a message if the deactivation fails
      }
    } catch (error) {
      displayNotification('Error deactivating account:', error);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      displayNotification('New passwords do not match!');
      return;
    }

    if (!isValidPassword(newPassword)) {
      displayNotification('Password must be at least 8 characters long and include at least one uppercase letter.');
      return;
    }

    try {
      const response = await axios.post('http://localhost/backend/updatePassword.php', {
        currentPassword,
        newPassword
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        displayNotification('Password changed successfully.');
        setShowPasswordModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        displayNotification(response.data.message);
      }
    } catch (error) {
      displayNotification('Error changing password:', error);
    }
  };

  // Function to validate password
  function isValidPassword(password) {
    return password.length >= 8 && /[A-Z]/.test(password);
  }

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Account Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userData ? (
            <div className="account-details">
              <FontAwesomeIcon icon={faUserCircle} size="6x" color="grey"/>
              <p>Username: {userData.user_name}</p>
              <p>Date Joined: {new Date(userData.user_created).toLocaleDateString()}</p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
          <div className="account-buttons">
              <Button variant="secondary" className="mr-2" onClick={() => setShowPasswordModal(true)}>
                Change Password
              </Button>
              <Button variant="danger" className="mr-2" onClick={deactivateAccount}>
                Deactivate Account
              </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleChangePassword}>
            <Form.Group controlId="currentPassword">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="newPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="confirmNewPassword">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm new password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Change Password
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {notification && <Notification message={notification} onClose={() => setNotification(null)} />} 
    </>
  );
};

export default Account;
