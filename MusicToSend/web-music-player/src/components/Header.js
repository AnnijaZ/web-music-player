// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic, faBell, faCog } from '@fortawesome/free-solid-svg-icons';
import SearchBar from './SearchBar'; 
import Account from './Account';
import '../App.css';

const Header = ({ handleLogout, handleSearch }) => {
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false); // Stāvoklis, lai kontrolētu iestatījumu izkrītošo sarakstu
  const [showAccountModal, setShowAccountModal] = useState(false); // Stāvoklis, lai kontrolētu konta modālo logu

  const toggleDropdown = () => {
    setShowSettingsDropdown(!showSettingsDropdown); // Pārslēdz iestatījumu izkrītošo sarakstu
  };

  const logout = () => {  
    handleLogout(); // Izsauc izrakstīšanās funkciju
  };

  const handleAccountClick = () => {
    setShowAccountModal(true); // Parāda konta modālo logu
    setShowSettingsDropdown(false); // Aizver iestatījumu izkrītošo sarakstu, ja atvērts
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
            <Nav.Link as={Link} to="/playlist">Playlist</Nav.Link>
            <Nav.Link as={Link} to="/upload">Upload</Nav.Link>
            <Nav.Link as={Link} to="/uploaded-songs">Uploaded Songs</Nav.Link>
            <Nav.Link as={Link} to="/favourites">Favourites</Nav.Link>
            <Nav.Link as={Link} to="/recents">Recents</Nav.Link>
            <Nav.Link as={Link} to="/shared-songs">Shared songs</Nav.Link>
            <Nav.Link as={Link} to="/about">About</Nav.Link>
            <Nav.Link onClick={logout}>Logout</Nav.Link>
          </Nav>
          <SearchBar handleSearch={handleSearch} /> {/* Pievieno meklēšanas joslu */}
          <Nav className="ms-auto">
            <Nav.Link href="/notifications">
              <FontAwesomeIcon icon={faBell} className="notification-icon" />
            </Nav.Link>
            <Dropdown show={showSettingsDropdown} onToggle={toggleDropdown}>
              <Dropdown.Toggle id="dropdown-basic" style={{ border: "none", background: "none", padding: 0 }}>
                <FontAwesomeIcon icon={faCog} className="settings-icon" />
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ boxShadow: "none" }} className="settings-dropdown">
                <Dropdown.Item onClick={handleAccountClick}>Account</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Example 1</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Example 2</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
      <Account show={showAccountModal} handleClose={() => setShowAccountModal(false)} handleLogout={handleLogout}/> {/* Pievieno konta modālo logu */}
    </Navbar>
  );
};

export default Header;
