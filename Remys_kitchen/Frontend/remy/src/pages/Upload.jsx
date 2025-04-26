import React, { useState, useEffect } from "react";
import "../styles/Upload.css";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import time from "../../public/images/timing.png";
import difficulty from "../../public/images/difficulty.png";
import categoryImg from "../../public/images/category.png";
import tagImg from "../../public/images/foodTags.png";
import js from "@eslint/js";
import { TbReceiptEuro } from "react-icons/tb";
import Success from "./uploadSuccess.jsx";


const recept_Tagek = "https://localhost:44350/api/Recept_Tag";
const tagsApiUrl = "https://localhost:44350/api/Tag";

const Upload = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [newQuantity, setNewQuantity] = useState(0);
  const [newUnit, setNewUnit] = useState("");
  const [units, setUnits] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [selectedCategory, setSelectedCategory] = useState(""); 

  const [times, setNewTime] = useState(0);
  const [difficulties, setNewDifficulty] = useState("Könnyű");
  const [selectedTag, setSelectedTag] = useState("");
  const [tags, setTags] = useState([]);
  const [error, setError] = useState(null); 

  const [newStep, setNewStep] = useState("");
  const [image, setImage] = useState("");

  const [newTag, setNewTag] = useState(""); 
  const [selectedTags, setSelectedTags] = useState([]); 

  var user = localStorage.getItem("user");
  user = JSON.parse(user);
  const [userName, setUserName] = useState(user.Fnev);

  const [existingIngredients, setExistingIngredients] = useState([]);
  const [filteredIngredients, setFilteredIngredients] = useState([]);

  const [uploaded, setUploaded] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(tagsApiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP hiba: ${response.status}`);
        }
        const data = await response.json();
        setTags(data);
      } catch (error) {
        setError("Hiba a tagek lekérdezése során.");
        console.error("Hiba a tagek lekérdezése során:", error.message);
      }
    };

    fetch("https://localhost:44350/api/Hozzavalo", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => setExistingIngredients(data))
      .catch((error) => console.error("Hiba a hozzávalók lekérésekor:", error));

    fetch("https://localhost:44350/api/Kategoria", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Hiba a kategóriák lekérésekor:", error));

    fetchTags();
  }, []);

  const handleIngredientInput = (value) => {
    setNewIngredient(value);

    setFilteredIngredients(
      existingIngredients.filter((ingredient) =>
        ingredient.Nev.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const selectIngredient = async (ingredient) => {
    setNewIngredient(ingredient.Nev);
    setFilteredIngredients([]);

    try {
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
      setUnits(data.map((item) => item.MertekegysegNev));
      console.log(data);
    } catch (error) {
      console.error("Hiba a mértékegységek lekérésekor:", error);
      setUnits([]);
    }

    try {
      const response = await fetch(
        `https://localhost:44350/api/Mertekegyseg_Hozzavalo`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Nem sikerült lekérni az összes mértékegységet!");
      }

      const data = await response.json();
      console.log("Összes adat a Mertekegyseg_Hozzavalo-ból:", data);
    } catch (error) {
      console.error("Hiba az összes mértékegység lekérésekor:", error);
    }
  };

  const addIngredient = async () => {
    if (!newIngredient || !newQuantity || !newUnit) {
      alert("Kérlek, töltsd ki a hozzávaló összes mezőjét!");
      return;
    }

    let ingredientId = null;
    const existingIngredient = existingIngredients.find(
      (ing) => ing.Nev.toLowerCase() === newIngredient.toLowerCase()
    );

    if (existingIngredient) {
      ingredientId = existingIngredient.Hid;
    }

    const normalizedQuantity = parseInt(newQuantity, 10);
    setIngredients([
      ...ingredients,
      {
        id: ingredientId,
        name: newIngredient,
        quantity: normalizedQuantity,
        unit: newUnit,
      },
    ]);

    setNewIngredient("");
    setNewQuantity(0);
    setNewUnit("");
  };

  const addStep = () => {
    if (newStep) {
      setSteps([...steps, { description: newStep, order: steps.length + 1 }]);
      setNewStep("");
    }
  };

  const addTag = () => {
    if (newTag) {
      setSelectedTags([...selectedTags, newTag]);
      setNewTag("");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      console.log(formData)

      try {
        const response = await fetch("http://127.0.0.1:5000/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          alert(`Kép sikeresen feltöltve: ${data.file_path}`);
        } else {
          const errorData = await response.json();
          alert(`Hiba történt: ${errorData.error}`);
        }
      } catch (error) {
        console.error("Hiba a kép feltöltése közben:", error);
        alert("Nem sikerült a kép feltöltése.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isEmpty = false;
    let toScroll=""
    if (!title.trim()) {
      document.querySelector("#title").classList.add("empty")
      isEmpty = true;
      toScroll="#title"
    }
    else{
      document.querySelector("#title").classList.remove("empty")
    }

    if (!description.trim()) {
      document.querySelector("#description").classList.add("empty")
      isEmpty = true;
      if(toScroll=="")toScroll="#description"
    }
    else{
      document.querySelector("#description").classList.remove("empty")
    }

    if (!selectedCategory.trim()) {
      document.querySelector("#category").classList.add("empty")
      isEmpty = true;
      if(toScroll=="")toScroll="#category"
    }
    else{
      document.querySelector("#category").classList.remove("empty")
    }

    if (times==0) {
      document.querySelector("#time").classList.add("empty")
      isEmpty = true;
      if(toScroll=="")toScroll="#time"
    }
    else{
      document.querySelector("#time").classList.remove("empty")
    }
    if (ingredients.length === 0) {
      document.querySelector("#ingredientFirst").classList.add("empty")
      document.querySelector("#mennyiseg").classList.add("empty")
      document.querySelector("#mertekegysegThird").classList.add("empty")
      isEmpty = true;
      if(toScroll=="")toScroll="#ingredientFirst"
    }
    else{
      document.querySelector("#ingredientFirst").classList.remove("empty")
      document.querySelector("#mennyiseg").classList.remove("empty")
      document.querySelector("#mertekegysegThird").classList.remove("empty")
    }
    if(steps.length === 0){
      document.querySelector("#steps").classList.add("empty")
      isEmpty = true;
      if(toScroll=="")toScroll="#steps"
    }
    else{
      document.querySelector("#steps").classList.remove("empty")
    }
    if(selectedTags.length === 0){
      document.querySelector(".tag-select").classList.add("empty")
      isEmpty = true;
      if(toScroll=="")toScroll=".tag-select"
    }
    else{
      document.querySelector(".tag-select").classList.remove("empty")
    }


    if(isEmpty){
      document.querySelector(toScroll).scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    let uploadedImagePath = "";

    if (image) {
      const formData = new FormData();
      formData.append("image", image);

      try {
        const imageResponse = await fetch("http://127.0.0.1:5000/upload", {
          method: "POST",
          body: formData,
        });

        if (imageResponse.ok) {
          const data = await imageResponse.json();
          uploadedImagePath = data.file_path;
          console.log("Kép sikeresen feltöltve:", uploadedImagePath);
        } else {
          const errorData = await imageResponse.json();
          alert(`Kép feltöltési hiba: ${errorData.error}`);
          return;
        }
      } catch (error) {
        console.error("Hiba a kép feltöltése közben:", error);
        alert("Nem sikerült a kép feltöltése.");
        return;
      }
    }
    
    

    try {
      const recipeResponse = await fetch("https://localhost:44350/api/Recept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Nev: title,
          Leiras: description,
          KategoriaNev: selectedCategory,
          FelhasznaloNev: userName,
          Allapot: 0,
          Eperc: times,
          Szakmai: false,
          Nehezseg: difficulties,
        }),
      });

      if (!recipeResponse.ok) {
        throw new Error("Hiba történt a recept mentése során!");
      }

      const savedRecipe = await recipeResponse.json();
      const recipeId = savedRecipe.Rid;

      console.log("Mentett recept ID:", recipeId);

      for (const ingredient of ingredients) {
        await fetch("https://localhost:44350/api/Recept_Hozzavalo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Mennyiseg: ingredient.quantity,
            MertekegysegNeve: ingredient.unit,
            HozzavaloNev: ingredient.name,
            R_id: recipeId,
          }),
        });
      }

      for (const step of steps) {
        await fetch("https://localhost:44350/api/Lepes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Sorszam: step.order,
            Leiras: step.description,
            R_id: recipeId,
          }),
        });
      }

      for (const tag of selectedTags) {
        console.log(recipeId+" "+tag+" feltöltés")
        await fetch("https://localhost:44350/api/Recept_Tag", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            TagNev: tag,
            R_id: recipeId,
          }),
        });
      }

      if (uploadedImagePath) {
        const adjustedPath = uploadedImagePath.split('/').pop(); 
        uploadedImagePath = adjustedPath;
      
        const multimediaResponse = await fetch(
          "https://localhost:44350/api/Multimedia",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              URL: adjustedPath,
              R_id: recipeId,
            }),
          }
        );
      
        if (!multimediaResponse.ok) {
          throw new Error("Probléma a multimédia tartalom feltöltése során.");
        }
      }
      else{
        const multimediaResponse = await fetch(
          "https://localhost:44350/api/Multimedia",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              URL: "Recipe_Placeholder.jpg",
              R_id: recipeId,
            }),
          }
        );
      
        if (!multimediaResponse.ok) {
          throw new Error("Probléma a multimédia tartalom feltöltése során.");
        }
      }

      setIsModalOpen(true)
     
 

    } catch (error) {
      console.error("Hiba:", error);
      alert("Hiba történt a mentés során!");
    }

 
  };

  const handleTagChange = (e) => {
    const tagValue = e.target.value;
    setNewTag(tagValue);
  };
  
  const removeIngredient = (index) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const checkNegativeNumber = (e)=>{
    if(e.target.value<0) return e.target.value=e.target.value*-1
  }

  return (
    <div>
      <Header  />
    
    <div className="upload-page">

      <h1 className="upload-title">Recept Feltöltése</h1>
      <form className="upload-form" onSubmit={handleSubmit}>
        <label htmlFor="title" className="labelsUpload">Recept neve:</label>
        <input
          type="text"
          id="title"
          className="inputs"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Írd be a recept nevét..."
        />

        <label htmlFor="description" className="labelsUpload">Leírás:</label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Írd be a recept részleteit..."
          rows="5"
        ></textarea>

        <div className="Attributes">
          <div>
            <div className="img-input">
              <img src={categoryImg} alt="" id="categoryImgUpload"/>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                id="category"
              >
                <option value="" disabled>Válassz kategóriát</option>
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

        <div className="Attributes AttributesOne">
          <div>
            <div className="img-input">
              <img src={time} alt="" id="ClockIcon"/>
              <input
                type="number"
                id="time"
                className="inputs AttributeImputs"
                name="time"
                placeholder="Perc"
                value={times}
                onChange={(e)=>setNewTime(e.target.value)}
                onKeyUp={(e)=>checkNegativeNumber(e)}
              />
            </div>
            <label htmlFor="time" className="labelsUpload">Elkészítési idő</label>
          </div>
          <div>
            <div className="img-input">
              <img src={difficulty} alt="" id="difficultyIcon"/>
              <select name="difficulty" id="difficultyInput" onChange={(e)=>setNewDifficulty(e.target.value)} value={difficulties}>
                <option value="Könnyű" selected>Könnyű</option>
                <option value="Közepes">Közepes</option>
                <option value="Nehéz">Nehéz</option>
              </select>
            </div>
            <label htmlFor="time" className="labelsUpload">Nehézség</label>
          </div>
        </div>
        <Success isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Recepted sikeresen feltöltésre került!" description="Az általad feltöltött recept a moderátorok által hamarosan ellenőrzésre kerül. Az oldalon a többi felhasználó számára, csak a recept jóváhagyása után fog megjelenni." buttonText="Megértettem" relocate="/upload"/>
        <label htmlFor="image" className="labelsUpload">Kép feltöltése:</label>
        <input
          type="file"
          id="image"
          className="inputs"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
         <label className="labelsUpload">Hozzávalók:</label>
      <div className="Attributes">
        <div className="Ingredient-input">
        <input
            type="text"
            id="ingredientFirst"
            placeholder="Hozzávaló"
            value={newIngredient}
            onChange={(e) => handleIngredientInput(e.target.value)}
          />
        </div>
        <div className="Ingredient-input">
          
          <input
            type="number"
            id="mennyiseg"
            placeholder="Mennyiség"
            value={newQuantity}
            onChange={(e) => setNewQuantity(e.target.value)}
            onKeyUp={(e)=>checkNegativeNumber(e)}
          />
        </div>
        <div className="Ingredient-input">
          <select
            value={newUnit}
            id="mertekegysegThird"
            onChange={(e) => setNewUnit(e.target.value)}
          >
            <option value="" disabled>Válassz mértékegységet</option>
              {units.map((unit, index) => (
              <option key={index} value={unit}>
                {unit}
              </option>
              ))}
          </select>
        </div>
        </div>
          <button type="button" id="measureButton" onClick={addIngredient}>
            Hozzáadás
          </button>

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

        <ul className="ingredient-list">
          {ingredients.map((ingredient, index) => (
            <li key={index} className="ingridientliupload">
              {ingredient.name} - {ingredient.quantity} {ingredient.unit}
              <span className="removeImage" value={ingredient} onClick={()=>removeIngredient(index)}>sss</span>
            </li>
          ))}
        </ul>

        <label className="labelsUpload">Lépések:</label>
        <div className="step-input">
          <input
            type="text"
            placeholder="Lépés leírása"
            value={newStep}
            onChange={(e) => setNewStep(e.target.value)}
            id="steps"
          />
          <button type="button" id="descriptionButton" onClick={addStep}>
            Hozzáadás
          </button>
        </div>
        <ol className="step-list">
          {steps.map((step, index) => (
            <li key={index}>{step.description}</li>
          ))}
        </ol>
        <label className="labelsUpload">Tagek:</label>
          <div className="Attributes">
            <div>
              <div className="img-input">
                <img src={tagImg} alt="" id="tagImg"/>
                <select
                  value={newTag}
                  onChange={handleTagChange}
                  className="tag-select"
                >
                  <option value="" disabled>Válassz Taget</option>
                  {tags.map((tag) => (
                    <option key={tag.T_id} value={tag.Nev}>
                      {tag.Nev}
                    </option>
                  ))}
                </select>
                <button type="button" className="tagaddbutton" onClick={addTag}>
                  Hozzáadás
                </button>
              </div>
            </div>
          </div>
          <ul className="tag-list">
            {selectedTags.map((tag, index) => (
              <li key={index}>{tag}</li>
            ))}
          </ul>
        <button type="submit" className="submit-buttonUpload">
          Mentés
        </button>
      </form>
    </div>
    </div>
  );
};

export default Upload;
