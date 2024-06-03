import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Notification from './Notification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

const Account = ({ show, handleClose, handleLogout }) => {
  const [userData, setUserData] = useState(null);
  const [notification, setNotification] = useState(null);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost/backend/getUserData.php', {
          method: 'GET',
          credentials: 'include' // Ensures cookies, including session cookies, are sent
        });
        const data = await response.json();
        if (data.error) {
          console.error(data.error);
        } else {
          setUserData(data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [show]); // Re-fetch when modal is shown

  const displayNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

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
            <Button variant="secondary" className="mr-2" onClick={() => console.log('Change Password Clicked')}>
            Change Password
            </Button>
            <Button variant="danger" className="mr-2" onClick={deactivateAccount}>
            Deactivate Account
            </Button>
        </div>
      </Modal.Body>
    </Modal>
    {notification && <Notification message={notification} onClose={() => setNotification(null)} />} 
    </>
  );
};

export default Account;
