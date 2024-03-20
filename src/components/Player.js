// src/components/Player.js
import React from "react";
import { Container } from "react-bootstrap";
import ReactPlayer from "react-player";
import '../App.css';

const Player = () => {
  const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // Replace with the desired song URL

  return (
    <Container className="player">
      <ReactPlayer url={url} controls={true} width="100%" height="100%" />
    </Container>
  );
};

export default Player;