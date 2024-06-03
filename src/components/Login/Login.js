import React, { useState } from 'react';
import { Button, Modal, Form } from "react-bootstrap";
import Notification from '../Notification';
import axios from 'axios';
import './Login.css';

axios.defaults.withCredentials = true;

const LoginForm = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showRegister, setShowRegister] = useState(false);
    const [regUsername, setRegUsername] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regPasswordRepeat, setRegPasswordRepeat] = useState('');
    const [notification, setNotification] = useState(null);  // Add state for notification

    const displayNotification = (message) => {
      setNotification(message);
      setTimeout(() => {
          setNotification(null);
      }, 5000);
    };

    const handleSubmit = async (event) => {
      event.preventDefault(); // Prevent the default form submission behavior
      
      // Check if username or password fields are empty
      if (!username || !password) {
          displayNotification('Both username and password are required!');
          return; // Stop the function if fields are empty
      }
    
      // Create form data object
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
    
      try {
        // Make a POST request to Login.php using Axios
        const response = await axios.post('http://localhost/backend/login.php', formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
        
        if (response.data.success) {
          displayNotification(response.data.message);
          onLogin(true);
        } else {
          displayNotification(response.data.message);
        }
      } catch (error) {
        displayNotification('Login failed. Please try again.');
      }
    };

    const resetRegisterForm = () => {
      setRegUsername('');
      setRegPassword('');
      setRegPasswordRepeat('');
    };

    const handleRegister = async (e) => {
      e.preventDefault();
      if (regPassword !== regPasswordRepeat) {
          displayNotification('Passwords do not match!');
          return;
      }
  
      // Validate password length and uppercase letter
      if (!isValidPassword(regPassword)) {
          displayNotification('Password must be at least 8 characters long and include at least one uppercase letter.');
          return;
      }
  
      const registerData = {
          username: regUsername,
          password: regPassword
      };  
  
      try {
          const response = await axios.post('http://localhost/backend/register.php', registerData);
          if (response.data.success) {
              displayNotification('Registration successful');
              resetRegisterForm();
              setShowRegister(false);
          } else {
            displayNotification(response.data.message);
          }
      } catch (error) {
          displayNotification('Error:', error);
      }
  };
  
  // Function to validate password
  function isValidPassword(password) {
      return password.length >= 8 && /[A-Z]/.test(password);
  }
  

    return (
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="btn">Login</Button>
          <Button variant="secondary" onClick={() => setShowRegister(true)} className="btn">Register</Button>
        </form>

        <Modal show={showRegister} onHide={() => {
                resetRegisterForm();
                setShowRegister(false);
            }}>
            <Modal.Header closeButton>
                <Modal.Title>Register</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleRegister}>
                    <Form.Group controlId="regUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter username"
                            value={regUsername}
                            onChange={(e) => setRegUsername(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="regPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="regPasswordRepeat">
                        <Form.Label>Repeat Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Repeat Password"
                            value={regPasswordRepeat}
                            onChange={(e) => setRegPasswordRepeat(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Register
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
        {notification && <Notification message={notification} onClose={() => setNotification(null)} />}
      </div>
    );
}

export default LoginForm;
