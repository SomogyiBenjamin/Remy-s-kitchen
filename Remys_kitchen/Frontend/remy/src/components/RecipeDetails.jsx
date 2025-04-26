import React, { useEffect, useState } from "react";
import "../styles/RecipeDetails.css";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";

import categoryImg from "../../public/images/category.png";
import tagImg from "../../public/images/foodTags.png";
import time from "../../public/images/timing.png";
import difficulty from "../../public/images/difficulty.png";

import Success from "../pages/uploadSuccess.jsx";

function RecipeDetails() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();
  const recipe = state?.recipe;
  const recipeId = recipe?.R_id || id;

  const apiUrlS = `https://localhost:44350/api/Lepes/${recipeId}`;
  const apiUrlI = `https://localhost:44350/api/Recept_Hozzavalo/${recipeId}`;
  const apiUrlR = `https://localhost:44350/api/Ertekeles/${recipeId}`;
  const apiUrlAddRating = `https://localhost:44350/api/Ertekeles`;
  const apiUrlUpdateRating = `https://localhost:44350/api/Ertekeles`; 
  const apiTags=`https://localhost:44350/api/Recept_Tag/${recipeId}`;

  const [steps, setSteps] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [userRatingId, setUserRatingId] = useState(null);
  const [error, setError] = useState(null);
  const [tags, setTags]=useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null)
  useEffect(() => {
    var user = localStorage.getItem("user");
    user = JSON.parse(user);
    setUser(user);
  },[])

  const fetchRating = async () => {
    try {
      const response = await fetch(apiUrlR);
      //if (!response.ok) throw new Error(`HTTP hiba (értékelés): ${response.status}`);
      const data = await response.json();



      //Ezzel keresem hogy töltött-e már fel receptet
      const userRating = data.find((r) => r.FelhasznaloId === user.id);

      if (userRating) {
        setUserRating(userRating.Csillag);
        setUserRatingId(userRating.Ertid);
      }
      console.log(userRating);

      const averageRating = data.reduce((sum, r) => sum + r.Csillag, 0) / data.length;
      setRating(Math.round(averageRating));
    } catch (error) {
     // setError("Hiba az értékelés lekérdezése során.");
    }
  };



  useEffect(() => {
    console.log(recipe)

    if (!recipeId) {
      setError("A recept ID hiányzik, ezért az adatok nem tölthetők be.");
      return;
    }

    const fetchSteps = async () => {
      try {
        const response = await fetch(apiUrlS);
        if (!response.ok) throw new Error(`HTTP hiba (lépések): ${response.status}`);
        setSteps(await response.json());
      } catch (error) {
        setError("Hiba a lépések lekérdezése során.");
      }
    };

    const fetchIngredients = async () => {
      try {
        const response = await fetch(apiUrlI);
        if (!response.ok) throw new Error(`HTTP hiba (hozzávalók): ${response.status}`);
        setIngredients(await response.json());
      } catch (error) {
        setError("Hiba a hozzávalók lekérdezése során.");
      }
    };
    const fetchTags = async () => {

      const response= await fetch(apiTags);

      if((await response).ok){
        const data=await response.json();
        setTags(data);
      }

    }
    
    fetchSteps();
    fetchIngredients();
    fetchRating();
    fetchTags();
  }, [recipeId]);

  const handleRatingSubmit = async () => {

    if (!user || !user.id) {
      alert("Hiba: A felhasználó nem található!");
      return;
    }

    const newRating = {
      Csillag: userRating,
      ReceptId: recipeId,
      FelhasznaloId: user.id,
    };

    try {
      console.log(userRatingId);

      const response = await fetch(userRatingId ? `${apiUrlUpdateRating}/${userRatingId}` : apiUrlAddRating, {
        method: userRatingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRating),
      });

      if (!response.ok) throw new Error(`HTTP hiba (küldés): ${response.status}`);
      alert(userRatingId ? "Értékelés sikeresen frissítve!" : "Értékelés sikeresen beküldve!");
      await fetchRating();
    } catch (error) {
      alert("Hiba történt az értékelés küldése során.");
    }
  };

  const renderStars = () => {
    return (
      <div className="star-rating">
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`star ${index < rating ? "filled" : ""}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const renderUserStars = () => {
    return (
      <div className="user-star-rating">
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`star ${index < userRating ? "filled" : ""}`}
            onClick={() => setUserRating(index + 1)}
          >
            ★
          </span>
        ))}
        <button className="submit-button" onClick={
           user==null ? setIsModalOpen : handleRatingSubmit
          }>
          {userRatingId ? "Módosítás" : "Küldés"}
        </button>
      </div>
    );
  };

  return (
    <div>
      <Header/>
    <div className="recipe-details">
      <button onClick={() => navigate("/viewAll")} className="back-button">
        Vissza a receptekhez
      </button>

      <div className="recipe-header">
        {renderStars()}
        <h1 id="elem">{recipe?.Nev}</h1>
      </div>

      {recipe?.image && (
        <img
          src={recipe.image}
          alt={recipe.Nev}
          className="recipe-image-large"
        />
      )}

      <p>{recipe?.Leiras}</p>
      <h3>Tagek</h3>
      <div className="AdminTagContainer">
      {tags.map((item)=>{
        return(
          <button className="button viewTagButton" value={item.T_id}>{item.TagNev}</button>
        )
      })}
      </div>
      <br />
      <h3>Egyéb információk</h3>
      <div className="Attributes">
                <div>
                  <div className="img-input">
                    <img src={categoryImg} alt="" id="categoryImg"/>
                    <input type="text" name="" id="categoryName" className="inputs AttributeImputs" value={recipe.KategoriaNev} disabled/>
                  </div>
                  <label className="labelsUpload">Kategória</label>
                </div>
              </div>
      
              <div className="Attributes">
                <div>
                  <div className="img-input">
                    <img src={time} id="timeimage" alt="" />
                    <input
                      type="number"
                      id="time"
                      className="inputs AttributeImputs"
                      name="time"
                      placeholder="Perc"
                      value={recipe.Eperc}
                      disabled
                    />
                  </div>
                  <label htmlFor="time" className="labelsUpload">Elkészítési idő</label>
                </div>
                <div>
                  <div className="img-input">
                    <img src={difficulty} alt="" id="defficultyimage"/>
                    <input type="text" name="" id="defficultyName" className="inputs AttributeImputs" value={recipe.Nehezseg || "Könnyű"} disabled/>
                  </div>
                  <label htmlFor="time" className="labelsUpload">Nehézség</label>
                </div>
              </div>

      <h3>Hozzávalók:</h3>
      {error ? <p>{error}</p> : (
        <ul className="ulrecipedetails">
          {ingredients.map((ingredient, index) => (
            <li key={index}>
              {ingredient.HozzavaloNev} - {ingredient.Mennyiseg} {ingredient.Mertekegyseg}
            </li>
          ))}
        </ul>
      )}

      <h3>Elkészítés:</h3>
      <ol>
        {steps.map((step, index) => (
          <li key={index} className="stepsDescription">{step.Leiras}</li>
        ))}
      </ol>

      <h3>Értékelés hozzáadása:</h3>
      {renderUserStars()}
    </div>
    <Success isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="A funkció elérése megtagadva!" description="Az oldalon néhány funkció csak regisztrált felhasználók számára elérhető. A folytatáshoz jelentkezz be, vagy regisztrálj új fiókot!" buttonText="Megértettem" relocate={window.location.href}/>
    </div>
  );
}

export default RecipeDetails;
