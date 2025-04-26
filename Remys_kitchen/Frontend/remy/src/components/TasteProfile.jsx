import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TasteProfile.css';

const TasteProfile = () => {
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem('user')).Id;

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('https://localhost:44350/api/Tag');
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Fetched tags:', data);
        setTags(data);
      } catch (error) {
        console.error('Error fetching tags:', error);
        setTags([]); 
      }
    };
    fetchTags();
  }, []);

  const handleTagClick = (tagName) => {
    setSelectedTags((prevSelectedTags) =>
      prevSelectedTags.includes(tagName)
        ? prevSelectedTags.filter((name) => name !== tagName)
        : [...prevSelectedTags, tagName]
    );
    console.log('Selected tags:', selectedTags);
  };

  const handleSubmit = async () => {
    const userId = JSON.parse(localStorage.getItem('user')).Id;

    for (const tagName of selectedTags) {
      const tasteProfile = {
        TagNev: tagName
      };

      await fetch(`https://localhost:44350/api/Izles?F_id=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tasteProfile),
      });
    }

    navigate('/log'); 
  };

  return (

      <div className="upload-page field">
        <div className="taste-profile">
          <h1>Milyen ízvilágú ételeket kedvelsz?</h1>
          <div className="tags-container">
            {tags.length > 0 ? (
              tags.map((tag) => (
                <div
                  key={tag.Tid}
                  className={`tag ${selectedTags.includes(tag.Nev) ? 'selected' : ''}`}
                  onClick={() => handleTagClick(tag.Nev)}
                >
                  {tag.Nev}
                </div>
              ))
            ) : (
              <p>Nem jeleníthetők meg tagek.</p>
            )}
          </div>
          <button className="submit-button" onClick={handleSubmit}>
            Küldés
          </button>
        </div>
      </div>
    
    
  );
};

export default TasteProfile;