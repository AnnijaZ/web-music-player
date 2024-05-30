import React, { useState, useEffect } from 'react';
import { Modal, Button, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

const Account = ({ show, handleClose }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost/backend/getUserData.php');
        const data = await response.json();
        if (!data.error) {
          setUserData(data);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
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
            <Button variant="danger" className="mr-2" onClick={() => console.log('Delete Account Clicked')}>
            Delete Account
            </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Account;
