import React, { useEffect, useState } from "react";
import "../styles/WhatsInYourFridge.css";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "../styles/Upload.css";


const apiUrlRecipes = "https://localhost:44350/api/Recept";
const apiUrlIngredients = "https://localhost:44350/api/Recept_Hozzavalo";
const ratingsApiUrl = "https://localhost:44350/api/Ertekeles";

function WhatsInYourFridge() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [fridgeItems, setFridgeItems] = useState([]);
  const [ratings, setRatings] = useState({});
  const [ingredientInput, setIngredientInput] = useState({ 
    name: "", 
    quantity: "", 
    unit: "" 
  });
  const [percent, setPercent] = useState(80)
  const [error, setError] = useState(null);
  const [units, setUnits] = useState([]);
  const [existingIngredients, setExistingIngredients] = useState([]);
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState("");

  useEffect(() => {
    fetch("https://localhost:44350/api/Hozzavalo", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => setExistingIngredients(data))
      .catch((error) => console.error("Hiba a hozzávalók lekérésekor:", error));

    const fetchRecipes = async () => {
      try {
        const response = await fetch(apiUrlRecipes, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
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
        setRecipes(updatedRecipes);
      } catch (error) {
        setError("Hiba a receptek lekérdezése során.");
        console.error("Hiba a lekérdezés során:", error.message);
      }
    };

    const fetchRatings = async () => {
      try {
        const response = await fetch(ratingsApiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP hiba: ${response.status}`);
        }
        const data = await response.json();

        const ratingsByRecipe = data.reduce((acc, rating) => {
          if (!acc[rating.ReceptId]) acc[rating.ReceptId] = [];
          acc[rating.ReceptId].push(rating.Csillag);
          return acc;
        }, {});

        const averageRatings = Object.entries(ratingsByRecipe).reduce(
          (acc, [recipeId, ratings]) => {
            const average = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
            acc[recipeId] = Math.round(average);
            return acc;
          },
          {}
        );

        setRatings(averageRatings);
      } catch (error) {
        setError("Hiba az értékelések lekérdezése során.");
        console.error("Hiba az értékelések lekérdezése során:", error.message);
      }
    };

    fetchRecipes();
    fetchRatings();
  }, []);

  useEffect(()=>{
  

  })

  const selectIngredient = (ingredient) => {
    setNewIngredient(ingredient.Nev);
    setIngredientInput(prev => ({
      ...prev,
      name: ingredient.Nev
    }));
    setFilteredIngredients([]);
    fetchUnits(ingredient.Nev);
  };

  const handleIngredientInput = (e) => {
    const value = e.target.value;
    setNewIngredient(value);
    setIngredientInput(prev => ({
      ...prev,
      name: value
    }));

    setFilteredIngredients(
      existingIngredients.filter((ingredient) =>
        ingredient.Nev.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIngredientInput(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchUnits = async (ingredientName) => {
    try {
      // Find the ingredient in existing ingredients
      const ingredient = existingIngredients.find(item => 
        item.Nev.toLowerCase() === ingredientName.toLowerCase()
      );
      
      if (!ingredient) {
        console.error("Hozzávaló nem található:", ingredientName);
        setUnits([]);
        return;
      }

      // Fetch units for this ingredient
      const response = await fetch(
        `https://localhost:44350/api/Mertekegyseg_Hozzavalo/${ingredient.Hid}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Nem sikerült lekérni a mértékegységeket!");
      }

      const data = await response.json();
      setUnits(data.map(item => item.MertekegysegNev));
    } catch (error) {
      console.error("Hiba a mértékegységek lekérésekor:", error);
      setUnits([]);
    }
  };

  const UnitConversion = async (from, to, quantity) => {
    try {
      const response = await fetch(`https://localhost:44350/atvaltas`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          mibol: from,
          mibe: to,
          mennyiseg: quantity
        }),
      });

      if (!response.ok) {
        throw new Error("Conversion failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Conversion error:", error);
      return null;
    }
  };

  const addFridgeItem = () => {
    if (ingredientInput.name && ingredientInput.quantity && ingredientInput.unit) {
      setFridgeItems(prev => [...prev, {...ingredientInput}]);
      setIngredientInput({ name: "", quantity: "", unit: "" });
      setNewIngredient("");
      setUnits([]);
    }
  };

  const searchRecipes = async () => {
    try {
      const matchingRecipes = [];

      for (const recipe of recipes) {
        const response = await fetch(`${apiUrlIngredients}/${recipe.Rid}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error (ingredients): ${response.status}`);
        }

        const ingredients = await response.json();
        if (ingredients.length === 0) continue;

        let missingCount = 0;
        let Count=0;
        const ingredientColors = {};

        for (const ingredient of ingredients) {
          const fridgeItem = fridgeItems.find(
            item => {
                    if(item.name.toLowerCase().trim() === ingredient.HozzavaloNev.toLowerCase().trim()){
                      Count++
                      return ingredient.HozzavaloNev.toLowerCase().trim()
                    }
                  }
          );

          if (!fridgeItem) {
            missingCount++;
            ingredientColors[ingredient.HozzavaloNev] = "red";
            continue;
          }

          const convertableUnits = ["kg", "dkg", "g", "mg", "l", "dl", "cl", "ml"];
          let convertedQuantity = ingredient.Mennyiseg;

          if (
            convertableUnits.includes(ingredient.Mertekegyseg) &&
            convertableUnits.includes(fridgeItem.unit)
          ) {
            const conversionResult = await UnitConversion(
              ingredient.Mertekegyseg,
              fridgeItem.unit,
              ingredient.Mennyiseg
            );
            
            if (conversionResult !== null) {
              convertedQuantity = conversionResult;
            }
          }

          if (parseFloat(fridgeItem.quantity) >= parseFloat(convertedQuantity)) {
            ingredientColors[ingredient.HozzavaloNev] = "green";
          } else {
            ingredientColors[ingredient.HozzavaloNev] = "orange";
            missingCount++;
          }
        }

        let recipeColor = getRecipeColor(missingCount);
        
        if ((Count/recipe.HozzavaloDb*100)>=percent) {
          matchingRecipes.push({
            recipe,
            ingredients,
            missingCount,
            ingredientColors,
            recipeColor,
          });
        }
      }

      setFilteredRecipes(matchingRecipes);
    } catch (error) {
      setError("Hiba a hozzávalók lekérdezése során.");
      console.error("Hiba a hozzávalók lekérdezése során:", error.message);
    }
  };

  const getRecipeColor = (missingCount) => {
    if (missingCount === 0) return "green";
    if (missingCount <= 2) return "yellow";
    return "red";
  };

  const renderStars = (rating) => {
    return (
      <div className="star-rating">
        {[...Array(5)].map((_, index) => (
          <span key={index} className={`star ${index < rating ? "filled" : ""}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  const removeFridgeItem = (index) => {
    setFridgeItems((prev) => prev.filter((_, i) => i !== index));
  };

  const checkNegativeNumber = (e)=>{
    if(e.target.value<0) return e.target.value=e.target.value*-1
  }
  
  return (
    <div>
      <Header />
      <div className="blog-section">
        <div className="fridge-container">
          <h2>Mi van a hűtődben?</h2>
          <div className="center">
           
              <input type="number" 
              className="ingredient-input"
              id="percentage" 
              onChange={(e)=>setPercent(e.target.value)} 
              placeholder="A hozzávalók %-val szűrés"
              value={percent}
              step={10}
              min={10}
              max={100}
              onKeyUp={(e)=>checkNegativeNumber(e)}
              />
              
              <input
                type="text"
                className="ingredient-input"
                placeholder="Hozzávaló"
                value={newIngredient}
                onChange={handleIngredientInput}
              />
            
            {filteredIngredients.length > 0 && (
              <ul className="autocomplete-list">
                {filteredIngredients.map((ingredient) => (
                  <li
                    key={ingredient.Hid}
                    onClick={() => selectIngredient(ingredient)}
                  >
                    {ingredient.Nev}
                  </li>
                ))}
              </ul>
            )}
            <input
              type="number"
              name="quantity"
              placeholder="Mennyiség"
              value={ingredientInput.quantity}
              onChange={handleInputChange}
              className="ingredient-input"
              min={0}
              onKeyUp={(e)=>checkNegativeNumber(e)}
            />
            <select
              id="unit"
              value={ingredientInput.unit}
              onChange={handleInputChange}
              name="unit"
              disabled={!ingredientInput.name}
            >
              <option value="" disabled>Válassz mértékegységet</option>
              {units.map((unit, index) => (
                <option key={index} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
            <button 
              onClick={addFridgeItem} 
              className="add-ingredient-button"
              disabled={!ingredientInput.name || !ingredientInput.quantity || !ingredientInput.unit}
            >
              Hozzáad
            </button>
          </div>

          <div className="fridge-list">
            <h3>Alapanyagok:</h3>
            <ul>
              {fridgeItems.map((item, index) => (
                <li className="ingridientslist" key={index}>
                  {`${item.name} - ${item.quantity} ${item.unit} `}
                  <span className="removeImage" value={item} onClick={()=>removeFridgeItem(index)}>sss</span>
                </li>
                
              ))}
            </ul>
          </div>
        </div>

        <button 
          onClick={searchRecipes} 
          className="search-recipes-button"
          disabled={fridgeItems.length === 0}
        >
          Keresés
        </button>

        {error ? (
          <p>{error}</p>
        ) : filteredRecipes.length > 0 ? (
          <div className="blog-grid">
            {filteredRecipes.map(({ recipe, ingredients, missingCount, ingredientColors, recipeColor }) => (
              <div
                key={recipe.Rid}
                className="blog-item"
                style={{ borderColor: recipeColor }}
                onClick={() =>
                  navigate(`/recipeDetails/${recipe.Rid}`, { state: { recipe } })
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
                {ratings[recipe.Rid] && renderStars(ratings[recipe.Rid])}
                <h3>Hozzávalók:</h3>
                <ul>
                  {ingredients.map((ingredient) => {
                    const textColor = ingredientColors[ingredient.HozzavaloNev] || "red";

                    return (
                      <li key={ingredient.HozzavaloNev} className="ingridientslistli2" style={{ color: textColor }}>
                        {`${ingredient.HozzavaloNev}: ${ingredient.Mennyiseg} ${ingredient.Mertekegyseg}`}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p>Sajnos nem találtunk megfelelő receptet</p>
        )}
      </div>
    </div>
  );
}

export default WhatsInYourFridge;