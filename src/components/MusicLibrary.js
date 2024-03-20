import { useState } from 'react';
import ID3Reader from 'id3-reader';

const MusicLibrary = () => {
  const [musicLibrary, setMusicLibrary] = useState([]);

  const addMusicFile = (file) => {
    const reader = new ID3Reader(file);
    reader.read().then((tags) => {
      const metadata = {
        title: tags.title,
        artist: tags.artist,
        album: tags.album,
        duration: file.duration,
      };
      setMusicLibrary((prevLibrary) => [...prevLibrary, { file, metadata }]);
    });
  };

  const removeMusicFile = (index) => {
    setMusicLibrary((prevLibrary) =>
      prevLibrary.filter((_, i) => i !== index)
    );
  };

  return (
    <div>
      <h2>Music Library</h2>
      <button onClick={() => inputRef.current.click()}>Add Music</button>
      <input
        type="file"
        accept=".mp3"
        ref={(input) => {
          inputRef.current = input;
        }}
        onChange={(event) => {
          const file = event.target.files[0];
          addMusicFile(file);
        }}
        style={{ display: 'none' }}
      />
      <ul>
        {musicLibrary.map(({ file, metadata }, index) => (
          <li key={index}>
            <div>{metadata.title}</div>
            <div>{metadata.artist}</div>
            <div>{metadata.album}</div>
            <div>{metadata.duration}</div>
            <button onClick={() => removeMusicFile(index)}>
              Remove Music
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MusicLibrary;