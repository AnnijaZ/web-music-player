import React, { useState } from 'react';
import { Button, Modal, Form } from "react-bootstrap";
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

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        
        // Create an object to hold form data
        const formData = {
          username: username,
          password: password
        };
    
        try {
          // Make a POST request to Login.php using Axios
          const response = await axios.post('http://localhost/backend/login.php', formData);
          
          console.log(response.data); // Log the response data
          
          if (response.status === 200) {
            // Handle successful login
            console.log('Login successful');
            onLogin(true);
          } else {
            // Handle login failure
            console.error('Login failed:', response.data.message); // Output the error message
          }
        } catch (error) {
          console.error('Error:', error);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (regPassword !== regPasswordRepeat) {
            alert('Passwords do not match!');
            return;
        }

        const registerData = {
            username: regUsername,
            password: regPassword
        };

        try {
            const response = await axios.post('http://localhost/backend/register.php', registerData);
            if (response.data.success) {
                console.log('Registration successful');
                setShowRegister(false);
            } else {
                console.error('Registration failed:', response.data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

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

        <Modal show={showRegister} onHide={() => setShowRegister(false)}>
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
      </div>
    );
}

export default LoginForm;
