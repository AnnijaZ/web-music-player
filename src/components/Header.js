// src/components/Header.js
import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic, faBell, faCog } from '@fortawesome/free-solid-svg-icons';
import SearchBar from './SearchBar'; // Import the SearchBar component  
import '../App.css';

const Header = ({ handleLogout }) => {
  const logout = () => {
    // Call the handleLogout function passed from the parent component
    handleLogout();
  };

   // Function to handle search
   const handleSearch = (searchTerm) => {
    // Implement your search logic here
    console.log('Search term:', searchTerm);
  };

  return (
    <Navbar className="custom-navbar" expand="lg">
      <Container>
        <Navbar.Brand>
          <FontAwesomeIcon icon={faMusic} className="music-icon" />
          Music Player
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/home">Home</Nav.Link>
            <Nav.Link as={Link} to="/playlist">
              Playlist
            </Nav.Link>
            <Nav.Link as={Link} to="/upload">Upload</Nav.Link>
            <Nav.Link href="#">Favourites</Nav.Link>
            <Nav.Link href="#">Recents</Nav.Link>
            <Nav.Link href="#">About</Nav.Link>
            <Nav.Link  onClick={logout}>Logout</Nav.Link>
          </Nav>
          <SearchBar handleSearch={handleSearch} />
          <Nav className="ms-auto">
            <Nav.Link href="#">
              <FontAwesomeIcon icon={faBell} className="notification-icon" />
            </Nav.Link>
            <Nav.Link href="#">
              <FontAwesomeIcon icon={faCog} className="settings-icon" />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
