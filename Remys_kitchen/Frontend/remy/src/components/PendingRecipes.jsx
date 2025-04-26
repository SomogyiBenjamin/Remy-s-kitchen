import React, { useEffect, useState } from "react";
import "../styles/ViewAll.css";
import "../styles/BlogSection.css";
import Header from "../components/Header";

import { useNavigate } from "react-router-dom";

const apiUrl = "https://localhost:44350/api/Recept";

function PendingRecipes() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    setFilteredRecipes(recipes);
  }, [recipes]);

  const fetchRecipes = async () => {
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP hiba: ${response.status}`);
      }
      const data = await response.json();

      const updatedRecipes = await Promise.all(
        data.map(async (recipe) => {
          try {
            const imageResponse = await fetch(
              `https://localhost:44350/api/Multimedia/${recipe.Rid}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            if (!imageResponse.ok) {
              throw new Error(`HTTP hiba: ${imageResponse.status}`);
            }
            const imageData = await imageResponse.json();
            return { ...recipe, image: "/asserts/kepek/" + imageData[0].URL };
          } catch (error) {
            console.error(`Hiba a kép lekérdezése során: ${error.message}`);
            return { ...recipe, image: null };
          }
        })
      );

      const uniqueRecipes = updatedRecipes.filter((recipe) => recipe.Allapot === 0);
     

      setRecipes(uniqueRecipes);
    } catch (error) {
      setError("Hiba a receptek lekérdezése során.");
      console.error("Hiba a lekérdezés során:", error.message);
    }
  };

  return (
    <div>
      <Header />
      {error && <p>{error}</p>}
      {filteredRecipes.length > 0 ? (
        <div className="blog-grid">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.Rid}
              className="blog-item"
              onClick={() =>
                navigate(`/adminRecipeDetails/${recipe.Rid}`, {state: {recipe}})	
              }
            >
              {recipe.image && (
                <img
                  src={recipe.image}
                  alt={recipe.Nev}
                  className="recipe-image"
                />
              )}
              <h2>{recipe.Nev}</h2>
              <p>{recipe.Leiras}</p>
              
            </div>
          ))}
        </div>
      ) : (
        <p>Nem találhatóak receptek.</p>
      )}
    </div>
  );
}

export default PendingRecipes;
