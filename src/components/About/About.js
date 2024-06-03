// import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFacebook, faInstagram, faTiktok } from '@fortawesome/free-brands-svg-icons';

// const About = () => {
//   return (
//     <div>
//       <h2>About Music Web Player</h2>
//       <p>
//         Music Web Player is your ultimate destination for all your favorite music. 
//         Whether you're into rock, pop, hip-hop, or classical, we've got you covered!
//         Our platform offers a seamless listening experience, allowing you to access
//         your favorite tunes from anywhere, anytime.
//       </p>
//       <p>
//         Just like Facebook, Instagram, and TikTok revolutionized social media, 
//         Music Web Player is revolutionizing the way you enjoy music. With our 
//         user-friendly interface and extensive library, you can discover new 
//         artists, create playlists, and share your favorite tracks with friends.
//       </p>
//       <div className="social-icons">
//         <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
//           <FontAwesomeIcon icon={faFacebook} />
//         </a>
//         <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
//           <FontAwesomeIcon icon={faInstagram} />
//         </a>
//         <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">
//           <FontAwesomeIcon icon={faTiktok} />
//         </a>
//       </div>
//     </div>
//   );
// };

// export default About;
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTiktok } from '@fortawesome/free-brands-svg-icons';
import './About.css'; // Import your CSS file for styling

const About = () => {
  return (
    <div className="about-container">
      <h2 className="about-title">About Our Music Player</h2>
      <p className="about-description">
        Our music player provides you with the convenience of accessing all your favorite music in one place. Enjoy seamless playback and explore a wide range of tracks from various genres.
      </p>
      <div className="social-icons">
        <a href="https://www.facebook.com" className="social-icon-link">
          <FontAwesomeIcon icon={faFacebook} className="social-icon" />
        </a>
        <a href="https://www.instagram.com" className="social-icon-link">
          <FontAwesomeIcon icon={faInstagram} className="social-icon" />
        </a>
        <a href="https://www.tiktok.com" className="social-icon-link">
          <FontAwesomeIcon icon={faTiktok} className="social-icon" />
        </a>
      </div>
    </div>
  );
};

export default About;

