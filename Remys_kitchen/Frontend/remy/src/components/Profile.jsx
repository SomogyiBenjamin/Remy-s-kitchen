import React, { useEffect, useState } from "react";
import "../styles/Profile.css";
import { useNavigate } from "react-router-dom";
import { FaCog } from "react-icons/fa";
import SettingsModal from "../components/SettingModal.jsx";
import Header from "./Header.jsx";
function Profile() {
  const [user, setUser] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [selectedStar, setSelectedStar] = useState(null);
  const [recipes, setRecipes] = useState({});
  const [uploadedRecipes, setUploadedRecipes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchUserRatings(parsedUser.id);
      fetchUserUploadedRecipes(parsedUser.Fnev);
      
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchUserRatings = async (userId) => {
    try {
      const response = await fetch(`https://localhost:44350/api/Ertekeles`);
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const data = await response.json();
      const userRatings = data.filter((rating) => rating.FelhasznaloId === userId);
      setRatings(userRatings);
      fetchRecipes(userRatings);
    } catch (error) {
      console.error("Értékelések fetch hiba:", error);
    }
  };

  const fetchRecipes = async (ratings) => {
    const recipePromises = ratings.map(rating =>
      fetch(`https://localhost:44350/api/Recept/${rating.ReceptId}`)
        .then(response => response.json())
        .then(data => data[0])
    );
    const recipesData = await Promise.all(recipePromises);
    const recipesWithImages = await Promise.all(recipesData.map(async recipe => {
      const imageResponse = await fetch(`https://localhost:44350/api/Multimedia/${recipe.Rid}`);
      const imageData = await imageResponse.json();
      return { ...recipe, image: `/asserts/kepek/${imageData[0].URL}` };
    }));
    const recipesMap = recipesWithImages.reduce((acc, recipe) => {
      acc[recipe.Rid] = recipe;
      return acc;
    }, {});
    setRecipes(recipesMap);
  };


  const fetchUserUploadedRecipes = async (username) => {
    try {
      const response = await fetch(`https://localhost:44350/api/Recept`);
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const data = await response.json();
      const userRecipes = data.filter(recipe => recipe.FelhasznaloNev === username);
      
      const updatedRecipes = await Promise.all(
        userRecipes.map(async (recipe) => {
          try {
            const imageResponse = await fetch(
              `https://localhost:44350/api/Multimedia/${recipe.Rid}`
            );
            if (!imageResponse.ok) {
              throw new Error(`HTTP hiba: ${imageResponse.status}`);
            }
            const imageData = await imageResponse.json();
            return { ...recipe, image: `/asserts/kepek/${imageData[0]?.URL || "default.png"}` };
          } catch (error) {
            console.error(`Hiba a kép lekérdezése során: ${error.message}`);
            return { ...recipe, image: "/asserts/kepek/default.png" };
          }
        })
      );
      setUploadedRecipes(updatedRecipes);
    } catch (error) {
      console.error("Felhasználó által feltöltött receptek lekérdezési hiba:", error);
    }
  };

  const groupRatingsByStars = () => {
    const grouped = {};
    ratings.forEach((rating) => {
      if (!grouped[rating.Csillag]) {
        grouped[rating.Csillag] = [];
      }
      grouped[rating.Csillag].push(rating);
    });
    return grouped;
  };

  const groupedRatings = groupRatingsByStars();

  return (
    <div>
      <Header/>
      <div className="profile-container">
      <h1 className="samefont">Profil</h1>
      {user && (
        <div className="user-info">
          <img
            src={user?.ProfilkepURL ? `/asserts/kepek/${user.ProfilkepURL}` : "/asserts/kepek/profPlaceholder.png"}
            alt="Profil"
            className="profile-icon-img"
          />
          <h2 className="samefont">{user.Fnev}</h2>
          <p className="samefont">{user.Email}</p>
          <button className="settings-icon" onClick={() => setIsModalOpen(true)}>
            <FaCog  className="rotate"/>
          </button>
        </div>
      )}

      <SettingsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <h2 className="samefont">Értékelései:</h2>
      <div className="star-filter">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={`star-button ${selectedStar === star ? "active" : ""}`}
            onClick={() => setSelectedStar(star)}
          >
            {star} Csillag ({groupedRatings[star]?.length || 0})
          </button>
        ))}
      </div>

      {selectedStar && (
        <div className="selected-ratings">
          <h3 className="samefont">{selectedStar} Csillagra értékelt receptek:</h3>
          {groupedRatings[selectedStar]?.length > 0 ? (
            <ul>
              {groupedRatings[selectedStar].map((rating, index) => {
                const recipe = recipes[rating.ReceptId];
                return (
                  <div key={index} className="recipe-card" onClick={() => navigate(`/recipeDetails/${recipe.Rid}`, { state: { recipe } })}>
                    {recipe ? (
                      <>
                        <img src={recipe.image} alt={recipe.Nev} style={{ width: 100, height: 100 }} />
                        <div>{recipe.Nev}</div>
                        <div>Kategória: {recipe.KategoriaNev}</div>
                      </>
                    ) : (
                      <p>Betöltés...</p>
                    )}
                  </div>
                );
              })}
            </ul>
          ) : (
            <p className="samefont">Nem történt értékelése {selectedStar} csillagra.</p>
          )}
        </div>
      )}

    <h2 className="samefont">Feltöltött receptek:</h2>
      <div className="uploaded-recipes">
        {uploadedRecipes.length > 0 ? (
          uploadedRecipes.map((recipe, index) => (
            <div key={index} className="recipe-card" onClick={() => navigate(`/recipeDetails/${recipe.Rid}`, { state: { recipe } })}>
              <img src={recipe.image} alt={recipe.Nev} style={{ width: 100, height: 100 }} />
              <div>{recipe.Nev}</div>
              <div>Kategória: {recipe.KategoriaNev}</div>
            </div>
          ))
        ) : (
          <p className="samefont">Nincs feltöltött recept.</p>
        )}
      </div>
    </div>
    </div>
    
  );
}

export default Profile;