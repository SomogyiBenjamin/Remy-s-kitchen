import React, { useEffect, useState } from "react";
import "../styles/RecipeDetails.css";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import categoryImg from "../../public/images/category.png";
import tagImg from "../../public/images/foodTags.png";
import time from "../../public/images/timing.png";
import difficulty from "../../public/images/difficulty.png";

function AdminRecipeDetails() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();
  const recipe = state?.recipe;
  const recipeId = recipe?.R_id || id;

  const apiUrlS = `https://localhost:44350/api/Lepes/${recipeId}`;
  const apiUrlI = `https://localhost:44350/api/Recept_Hozzavalo/${recipeId}`;
  const apiUrlUpdate = `https://localhost:44350/api/Recept/${recipeId}`;
  const apiUnits=`https://localhost:44350/api/Mertekegyseg`;
  const apiTags=`https://localhost:44350/api/Recept_Tag/${recipeId}`;

  const [steps, setSteps] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [recipeData, setRecipeData] = useState({
    Nev: recipe?.Nev || "",
    Leiras: recipe?.Leiras || "",
    KategoriaNev: recipe?.KategoriaNev || "",
    Eperc: recipe?.Eperc || 0,
    Nehezseg: recipe?.Nehezseg || "",
    image: recipe?.image || "",
  });
  const [error, setError] = useState(null);

    const [categories, setCategories] = useState([]); 
    const [selectedCategory, setSelectedCategory] = useState(""); 
    const [times, setNewTime] = useState(0);
    const [difficulties, setNewDifficulty] = useState(recipeData.Nehezseg);

    const [units, setUnits]=useState([]);
    const [tags, setTags]=useState([]);
  useEffect(() => {
    const fetchUnits=async ()=>{
      const response=await fetch(apiUnits);

      if((await response).ok){
        const data=await response.json();
        setUnits(data);
      }
    }

    fetchUnits();
  },[])
  useEffect(() => {
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

    fetch("https://localhost:44350/api/Kategoria", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Hiba a kategóriák lekérésekor:", error));

    const fetchTags = async () => {

      const response= await fetch(apiTags);

      if((await response).ok){
        const data=await response.json();
        setTags(data);
      }

    }


    fetchSteps();
    fetchIngredients();
    fetchTags();
  
  }, [recipeId]);

  useEffect(() => {
    if (recipeData.KategoriaNev) {
      setSelectedCategory(recipeData.KategoriaNev);
    }
    if (recipeData.Nehezseg) {
      setNewDifficulty(recipeData.Nehezseg);
    }
  }, [recipeData]);

  const handleFieldChange = (field, value) => {
    setRecipeData((prev) => ({ ...prev, [field]: value }));
  };

  const handleIngredientChange = (index, field, value) => {
    setIngredients((prev) =>
      prev.map((ingredient, i) =>
        i === index ? { ...ingredient, [field]: value } : ingredient
      )
    );
  };

  const handleStepChange = (index, value) => {
    setSteps((prev) =>
      prev.map((step, i) => (i === index ? { ...step, Leiras: value } : step))
    );
  };

  const handleAccept = async () => {
    try {
      const updatedRecipe = {
        ...recipeData,
        Allapot: 1,
        Hozzavalok: ingredients,
        Lepesek: steps,
      };
      console.log("A frissített recept:", updatedRecipe);
      


      if(await updateRecipe(recipeId, ingredients, steps)){

      
      const response = await fetch(apiUrlUpdate, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Nev: recipeData.Nev,
          Leiras: recipeData.Leiras,
          KategoriaNev: selectedCategory,
          FelhasznaloNev: recipe.FelhasznaloNev,
          Allapot: 1,
          Eperc: recipeData.Eperc,
          Szakmai: recipe.Szakmai,
          Nehezseg: difficulties
        }),
      });

      if (!response.ok) throw new Error(`HTTP hiba (állapot frissítés): ${response.status}`);
      //alert("A recept elfogadva és frissítve!");
      console.log("A recept frissítve.: ", updatedRecipe);
      let details=document.querySelector(".recipe-details");
        details.classList.add("toAnimate");
        setTimeout(() => {
          navigate("/pendingRecipes")
        }, 1500);
      }
      //navigate("/viewAll");
    } catch (error) {
      alert("Hiba történt a recept frissítése során.");
    }
    
    
 
  };
  //TODO: beszélni a frissitésből adódó hibákról

  
  async function updateRecipe(recipeId, ingredients, steps) {
    try {
      // 1. Lekérjük a hozzávalókat
      const ingredientsRes = await fetch(`https://localhost:44350/api/Recept_Hozzavalo/${recipeId}`);
      const existingIngredients = await ingredientsRes.json();
  
      // 2. Lekérjük a lépéseket
      const stepsRes = await fetch(`https://localhost:44350/api/Lepes/${recipeId}`);
      const existingSteps = await stepsRes.json();
  
      console.log("Meglévő hozzávalók:", existingIngredients);
      console.log("Meglévő lépések:", existingSteps);
  
      //TODO: PUT method átírása mert baj lesz ha nem csak 1 tartozik valamelyikhez
      for (const ingredient of ingredients) {
        console.log(ingredient.Mertekegyseg)
        console.log(recipeId)
        const rh=await fetch(`https://localhost:44350/api/Recept_Hozzavalo?Rid=${recipeId}&HozzavaloNev=${ingredient.HozzavaloNev}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Mennyiseg: ingredient.Mennyiseg,
            MertekegysegNev: ingredient.Mertekegyseg
          }),
        });

        if((await rh).ok){
          console.log("Hozzávaló sikeresen frissítve")
          
        }
        else{
          throw new Error(`HTTP hiba (Hozzávaló frissítés): ${rh.status}`);
        }

      }
  
      for (const step of steps) {
          console.log(step.Lid)
          const response=await fetch(`https://localhost:44350/api/Lepes/${recipeId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Sorszam: step.Sorszam,
            Leiras: step.Leiras
          }),
        });

        if((await response).ok){
          console.log("Lepes sikeresen frissítve")
        }
        else throw new Error(`HTTP hiba (lépés frissítés): ${response.status}`);
       
      }

      const Tagek=document.querySelectorAll(".deletedTag");
      for(const item of Tagek){
        const response=await fetch(`https://localhost:44350/api/Recept_Tag/${item.value}?Rid=${recipeId}`, {
          method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if((await response).ok){
          console.log("Tag sikeresen törölve")
        }
        else throw new Error(`HTTP hiba (Tag törlés): ${response.status}`);
      }

  
       return true;
       
      }
  
  
    catch (error) {
      alert("Hiba történt:"+ error);
      return false
    }
  }
   



  async function handleReject(){
    try{
        const response = await fetch(apiUrlUpdate, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if(response.ok){
            let details = document.querySelector(".recipe-details");
            details.classList.add("toReject");

            // Kép törlése és várakozás
            console.warn(recipeData.image)
            if(recipeData.image!="/asserts/kepek/Recipe_Placeholder.jpg") await deleteFile(recipeData.image);

            setTimeout(() => {
                navigate("/pendingRecipes");
            }, 1500);
        }
    } catch(error) {
        console.error("Hiba a törlés közben:", error);
    }
}

async function deleteFile(filename) {
  const url = `http://127.0.0.1:5000/delete/${filename.split('/').pop()}`;

  try {
      const response = await fetch(url, { method: 'DELETE' });

      const result = await response.json();
      console.log("Backend válasz:", result);

      if (response.ok) {
          console.log("A kép sikeresen törölve:", result.message);
      } else {
          console.error("Probléma történt a file törlése közben:", result.error);
      }
  } catch (error) {
      console.error("Error a törlés közben:", error);
  }
}
const checkNegativeNumber = (e)=>{
  if(e.target.value<0) return e.target.value=e.target.value*-1
}

  return (
    <div className="recipe-details">
      <button onClick={() => navigate("/pendingRecipes")} className="back-button">
        Vissza a receptekhez
      </button>

      <div className="recipe-header">
        <h1>
          <input
            type="text"
            value={recipeData.Nev}
            onChange={(e) => handleFieldChange("Nev", e.target.value)}
            className="editable-field"
          />
        </h1>
      </div>

      {recipeData.image && (
        <img
          src={recipeData.image}
          alt={recipeData.Nev}
          className="recipe-image-large"
        />
      )}

      <textarea
        value={recipeData.Leiras}
        onChange={(e) => handleFieldChange("Leiras", e.target.value)}
        className="editable-field"
        id="adminDescription"
        maxLength={500}
      />
              <div className="Attributes">
                <div>
                  <div className="img-input">
                    <img src={categoryImg} alt="" id="categoryImg"/>
                    <select
                      value={selectedCategory || recipeData.KategoriaNev} // Ha nincs kiválasztva, akkor a recipeData értéke
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      id="category"
                    >
                      
                      {categories.map((category, index) => (
                        <option key={index} value={category.Nev}>
                          {category.Nev}
                        </option>
                      ))}
                    </select>
                  </div>
                  <label className="labelsUpload">Kategória</label>
                </div>
              </div>
      
              <div className="Attributes">
                <div>
                  <div className="img-input">
                    <img src={time} alt="" id="timeAdmin"/>
                    <input
                      type="number"
                      id="time"
                      className="inputs AttributeImputs"
                      name="time"
                      placeholder="Perc"
                      value={recipeData.Eperc}
                      onChange={(e)=>setNewTime(e.target.value)}
                    />
                  </div>
                  <label htmlFor="time" className="labelsUpload">Elkészítési idő</label>
                </div>
                <div>
                  <div className="img-input">
                    <img src={difficulty} alt="" id="difficultyAdmin"/>
                    <select
                      name="difficulty"
                      id="difficulty"
                      onChange={(e) => setNewDifficulty(e.target.value)}
                      value={difficulties || recipeData.Nehezseg}
                    >
                      <option value="Könnyű">Könnyű</option>
                      <option value="Közepes">Közepes</option>
                      <option value="Nehéz">Nehéz</option>
                    </select>
                  </div>
                  <label htmlFor="time" className="labelsUpload">Nehézség</label>
                </div>
              </div>

      <h3>Hozzávalók:</h3>
      {error ? (
        <p>{error}</p>
      ) : (
        <ul id="ingredientList">
          {ingredients.map((ingredient, index) => (
            <li key={index}>
              <input
                type="text"
                value={ingredient.HozzavaloNev}
                onChange={(e) =>
                  handleIngredientChange(index, "HozzavaloNev", e.target.value)
                }
                className="editable-field"
                disabled
              />{" "}
              -{" "}
              <input
                type="number"
                value={ingredient.Mennyiseg}
                onChange={(e) =>
                  handleIngredientChange(index, "Mennyiseg", e.target.value)
                }
                onKeyUp={(e)=>checkNegativeNumber(e)}
                className="adminQuantity"
              />{" "}
              <select
                value={ingredient.Mertekegyseg}
                onChange={(e) =>
                  handleIngredientChange(index, "Mertekegyseg", e.target.value)
                }
                className="editable-field unit">
                  {units.map((item)=>{
                    return(
                      <option key={item.MertekegysegNev} value={item.MertekegysegNev}>
                        {item.MertekegysegNev}
                      </option>
                    )
                  })}
                </select>
              {/*<input
                type="text"
                value={ingredient.Mertekegyseg}
                onChange={(e) =>
                  handleIngredientChange(index, "Mertekegyseg", e.target.value)
                }
                className="editable-field"
              /> */}
            </li>
          ))}
        </ul>
      )}

      <h3>Elkészítés:</h3>
      <ol className="adminOl">
        {steps.map((step, index) => (
          <li key={index}>
            <textarea
              value={step.Leiras}
              onChange={(e) => handleStepChange(index, e.target.value)}
              className="editable-field adminStepDescription"
              maxLength={500}
            />
          </li>
        ))}
      </ol>
      
      <h3>Tagek</h3>
      <div className="AdminTagContainer">
      {tags.map((item)=>{
        return(
          <button className="button TagButton" value={item.T_id} onClick={(e)=>{e.target.classList.toggle("deletedTag")}}>{item.TagNev}</button>
        )
      })}
      </div>
   

      <div className="action-buttons">
        <button className="accept-button button" onClick={handleAccept}>
          Elfogadás
        </button>
        <button className="reject-button button" onClick={handleReject}>Elutasítás</button>
      </div>
    </div>
  );
}

export default AdminRecipeDetails;