import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/BlogSection.css";
import recept1 from "../asserts/recept1.jpg";
import recept2 from "../asserts/recept2.jpg";
import recept3 from "../asserts/recept3.jpg";

function BlogSection() {
  const [userTags, setUserTags] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchUserTags = async () => {
      if (user) {
        try {
          const response = await fetch(`https://localhost:44350/api/Izles/${user.id}`);
          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
          }
          const data = await response.json();
          const tags = data.map(tag => tag.T_id);
          setUserTags(tags);
          console.log('Fetched user tags:', tags);
        } catch (error) {
          console.error('Error fetching user tags:', error);
        }
      }
    };

    const fetchRecipes = async () => {
      try {
        const response = await fetch('https://localhost:44350/api/Recept');
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        
        const filteredData = data.filter(recipe => recipe.Allapot === 1);
        
        const recipesWithTagsAndImages = await Promise.all(
          filteredData.map(async (recipe) => {
            try {
              const tagsResponse = await fetch(`https://localhost:44350/api/Recept_Tag/${recipe.Rid}`);
              if (!tagsResponse.ok) {
                throw new Error(`Network response was not ok: ${tagsResponse.statusText}`);
              }
              const tagsData = await tagsResponse.json();
              const tags = tagsData.map(tag => tag.T_id);

              const imageResponse = await fetch(`https://localhost:44350/api/Multimedia/${recipe.Rid}`);
              if (!imageResponse.ok) {
                throw new Error(`Network response was not ok: ${imageResponse.statusText}`);
              }
              const imageData = await imageResponse.json();
              const imageUrl = imageData.length > 0 ? `/asserts/kepek/${imageData[0].URL}` : null;

              return { ...recipe, Tags: tags, image: imageUrl };
            } catch (error) {
              console.error(`Error fetching tags or image for recipe ${recipe.Rid}:`, error);
              return { ...recipe, Tags: [], image: null };
            }
          })
        );

        setRecipes(recipesWithTagsAndImages);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchUserTags();
    fetchRecipes();
  }, []);

  useEffect(() => {
    if (recipes.length > 0) {
      let filtered = recipes;
      if (userTags.length > 0) {
        filtered = recipes.filter(recipe =>
          recipe.Tags.some(tagId => userTags.includes(tagId))
        );
      }

      if (filtered.length < 3) {
        const randomRecipes = recipes
          .filter(recipe => !filtered.includes(recipe))
          .sort(() => 0.5 - Math.random())
          .slice(0, 3 - filtered.length);
        setFilteredRecipes([...filtered, ...randomRecipes]);
      } else {
        setFilteredRecipes(filtered.slice(0, 3));
      }
    }

    console.log('Filtered recipes:', filteredRecipes);
  }, [recipes, userTags]);

  const handleRecipeClick = (recipe) => {
    navigate(`/recipeDetails/${recipe.Rid}`, { state: { recipe } });
  };

  return (
    <section className="blog-section">
      <h2>Az ízlésednek megfelelő receptek</h2>
      <div className="blog-grid">
        {filteredRecipes.map((recipe, index) => (
          <div key={index} className="blog-item" onClick={() => handleRecipeClick(recipe)}>
            <img src={recipe.image ? `${recipe.image}` : recept1} alt={`Recipe ${index + 1}`} />
            <h3>{recipe.Nev}</h3>
            <p>{recipe.Leiras}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default BlogSection;