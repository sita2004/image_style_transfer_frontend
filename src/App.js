import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [contentImage, setContentImage] = useState(null);
  const [styleImage, setStyleImage] = useState(null);
  const [stylizedImage, setStylizedImage] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [showPoppers, setShowPoppers] = useState(false); 

  // Handle image file uploads
  const handleUpload = (event, setImage) => {
    setImage(event.target.files[0]);
  };

  // Handle form submission to stylize image
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('content_image', contentImage);
    formData.append('style_image', styleImage);

    setLoading(true); 

    try {
      const response = await axios.post('https://image-style-transfer-backend.onrender.com/stylize', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Set stylized image
      setStylizedImage(`data:image/png;base64,${response.data.stylized_image}`);
      setShowPoppers(true); // Show poppers
      playSound(); // Play celebration sound

    } catch (error) {
      console.error('Error stylizing image', error);
    } finally {
      setLoading(false); 
    }
  };

  // Handle download of stylized image
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = stylizedImage;
    link.download = 'stylized_image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Play sound for celebration effect
  const playSound = () => {
    const sound = document.getElementById('party-sound');
    sound.play();
  };

  return (
    <div className="App">
      <h1>Image Stylization App</h1>
      <p className="quote">"Creativity is intelligence having fun!"</p>

      {/* File Inputs */}
      <input
        type="file"
        onChange={(e) => handleUpload(e, setContentImage)}
        className="file-input"
      />
      <input
        type="file"
        onChange={(e) => handleUpload(e, setStyleImage)}
        className="file-input"
      />
      <button onClick={handleSubmit} className="submit-button">Stylize Image</button>

      {/* Loading Spinner */}
      {loading && (
        <>
          <div className="loading-spinner"></div>
          <p className="loading-message">
            Processing your image in style...
          </p>
        </>
      )}

      {/* Display Stylized Image */}
      {!loading && stylizedImage && (
        <>
          <img src={stylizedImage} alt="Stylized" className="stylized-image" />
          <p className="completion-message">Your stylized image is ready!</p>
          <button onClick={handleDownload} className="download-button">Download Image</button>

          {/* Party Poppers Animation */}
          {showPoppers && (
            <div id="party-poppers-container">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="party-popper">🎉</div>
              ))}
            </div>
          )}
        </>
      )}
      
      {/* Hidden audio element for celebration sound */}
      <audio id="party-sound" src="celebration_sound.mp3" preload="auto"></audio>
    </div>
  );
}

export default App;
