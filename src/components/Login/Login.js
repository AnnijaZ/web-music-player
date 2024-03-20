import React, { useState, useEffect } from 'react';
import {Button } from "react-bootstrap";
import axios from 'axios';
import './Login.css';

axios.defaults.withCredentials = true;

const LoginForm = ({onLogin}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
  
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
        </form>
      </div>
    );
  }
  
  export default LoginForm;
