import React, { useEffect, useState } from "react";
import "../styles/ViewAll.css";
import "../styles/BlogSection.css";
import { useNavigate } from "react-router-dom";
import time from "../../public/images/timing.png";
import ingredient from "../../public/images/ingredients.png";
import difficulty from "../../public/images/difficulty.png";
import Header from "../components/Header";
import Pagination from "../components/Pagination";

const apiUrl = "https://localhost:44350/api/Recept";
const tagsApiUrl = "https://localhost:44350/api/Recept_Tag";
const tagsUrl = "https://localhost:44350/api/Tag";
const categoriesUrl = "https://localhost:44350/api/Kategoria";
const ratingsApiUrl = "https://localhost:44350/api/Ertekeles";
const ingredientsApiUrl = "https://localhost:44350/api/Recept_Hozzavalo";
const sensitivitiesApiUrl = "https://localhost:44350/api/Felhasznalo_Erzekenyseg";
const erzekenysegApiUrl = "https://localhost:44350/api/Hozzavalo_Erzekenyseg";

function ViewAll() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [Ingredients, setIngredients] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectTags, setSelectTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ratings, setRatings] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [error, setError] = useState(null);
  const [userSensitivities, setUserSensitivities] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [allergies, setUseAllergies]=useState(true)

  useEffect(() => {
    //console.clear();
  });

  // Adatok betöltése
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    const fetchData = async () => {
      try {
        // Receptek betöltése
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP hiba: ${response.status}`);
        let data = await response.json();
        data=data.filter(item =>item.Allapot==1)
        // Képek betöltése
        const updatedRecipes = await Promise.all(
          data.map(async (recipe) => {
            try {
              const imageResponse = await fetch(`https://localhost:44350/api/Multimedia/${recipe.Rid}`);
              if (!imageResponse.ok) throw new Error(`HTTP hiba: ${imageResponse.status}`);
              const imageData = await imageResponse.json();
              return { ...recipe, image: "/asserts/kepek/" + imageData[0].URL };
            } catch (error) {
              console.error(`Hiba a kép lekérdezése során: ${error.message}`);
              return { ...recipe, image: null };
            }
          })
        );

        setRecipes(updatedRecipes || []); 
        setTotalRecipes(updatedRecipes.length || 0);
        applyFilters(updatedRecipes || [], searchTerm, selectedTag, selectedCategory);
      } catch (error) {
        setError("Hiba a receptek lekérdezése során.");
        console.error("Hiba a lekérdezés során:", error.message);
      }
    };
    const fetchRecipeIngredients = async () => {
      try {
        const response = await fetch(ingredientsApiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP hiba: ${response.status}`);
        }
        const data = await response.json();
        setIngredients(data || []); 
      } catch (error) {
        setError("Hiba a recept hozzávalók lekérdezése során.");
        console.error("Hiba a hozzávalók lekérdezése során:", error.message);
      }
    }
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
        setTags(data || []); 
      } catch (error) {
        setError("Hiba a tagek lekérdezése során.");
        console.error("Hiba a tagek lekérdezése során:", error.message);
      }
    };

    const fetchSelectTags = async () => {
      try {
        const response = await fetch(tagsUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP hiba: ${response.status}`);
        }
        const data = await response.json();
        setSelectTags(data || []);
      } catch (error) {
        setError("Hiba a tagek lekérdezése során.");
        console.error("Hiba a tagek lekérdezése során:", error.message);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(categoriesUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP hiba: ${response.status}`);
        }
        const data = await response.json();
        setCategories(data || []);
      } catch (error) {
        setError("Hiba a kategóriák lekérdezése során.");
        console.error("Hiba a kategóriák lekérdezése során:", error.message);
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

        setRatings(averageRatings || {}); 
      } catch (error) {
        setError("Hiba az értékelések lekérdezése során.");
        console.error("Hiba az értékelések lekérdezése során:", error.message);
      }
    };

    const fetchUserSensitivities = async () => {
      try {
        const response = await fetch(`${sensitivitiesApiUrl}/${user.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP hiba: ${response.status}`);
        }

        const userSensitivities2 = await response.json();
        console.log(userSensitivities2);
        const sensitivitiesDetails = await Promise.all(
          userSensitivities2.map(async (sensitivity) => {
            try {
              console.log(sensitivity+" : "+sensitivity.E_id)
              const detailResponse = await fetch(`${erzekenysegApiUrl}/${sensitivity.E_id}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              });

              if (!detailResponse.ok) {
                throw new Error(`HTTP hiba: ${detailResponse.status}`);
              }

              const detailData = await detailResponse.json();
              console.log(detailData);
              return detailData;
            } catch (detailError) {
              console.error(`Hiba az Érzékenység adatainak lekérdezése során: ${detailError.message}`);
              return null;
            }
          })
        );

        console.log("Hozzávalót ír ki?: ", sensitivitiesDetails);
        
        setUserSensitivities(sensitivitiesDetails)
        
        

        console.log("Hozzávalót ír ki?2: ", sensitivitiesDetails);
        console.log("Hozzávalók amikre érzékeny: ", userSensitivities);
      } catch (error) {
        console.error("Hiba az érzékenységek lekérdezése során:", error.message);
      }
    };

    fetchData();
    fetchRecipeIngredients();
    fetchTags();
    fetchSelectTags();
    fetchCategories();
    fetchRatings();
    fetchUserSensitivities()
  }, []);

  // Szűrők alkalmazása
  const applyFilters = (recipes, search, tag, category) => {
    let filtered = recipes || []; 

    // Szűrés cím alapján
    if (search) {
      filtered = filtered.filter((recipe) =>
        recipe.Nev.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Szűrés tag alapján
    if (tag) {
      const filteredIds = (tags || [])
        .filter((t) => t.TagNev === tag)
        .map((t) => t.R_id);
      filtered = filtered.filter((recipe) => filteredIds.includes(recipe.Rid));
    }

    // Szűrés kategória alapján
    if (category) {
      filtered = filtered.filter((recipe) => 
        recipe.KategoriaNev === category
      );
    }

    // Érzékenységek alapján szűrés
    if (allergies && userSensitivities.length > 0) {
      filtered = filtered.filter((recipe) => {

        const triggers = userSensitivities.flat().map((sensitivity) => sensitivity.HozzavaloNev);
        //console.log("Triggers:", triggers);

        const ingredientNames = Ingredients.filter((i) => i.R_id === recipe.Rid).map((i) => i.HozzavaloNev);
        //console.log("Ingredient names for recipe " + recipe.Rid + ":", ingredientNames);
    
        return !triggers.some((trigger) => ingredientNames.includes(trigger));
      });
    }

    setTotalRecipes(filtered.length);
    const startIndex = (page - 1) * pageSize;
    const paginatedRecipes = filtered.slice(startIndex, startIndex + pageSize);
    setFilteredRecipes(paginatedRecipes || []); 
  };

  // Keresés változása
  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);
    setPage(1);
    applyFilters(recipes, searchValue, selectedTag, selectedCategory);
  };

  // Tag változása
  const handleTagChange = (e) => {
    const tagValue = e.target.value;
    setSelectedTag(tagValue);
    setPage(1);
    applyFilters(recipes, searchTerm, tagValue, selectedCategory);
  };

  //Kategória változása
  const handleCategoryChange = (e) => {
    const categoryValue = e.target.value;
    setSelectedCategory(categoryValue);
    setPage(1);
    applyFilters(recipes, searchTerm, selectedTag, categoryValue);
  };

  //Oldalváltás
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  //Szűrők alkalmazása ha valami változzik
  useEffect(() => {
    applyFilters(recipes, searchTerm, selectedTag, selectedCategory);
  }, [page, searchTerm, selectedTag, selectedCategory, userSensitivities, allergies]);

  //Csillagok renderelése
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

  const totalPages = Math.ceil(totalRecipes / pageSize);

  return (
    <div>
      <Header />
      <div className="blog-section">
        <h1 className="viewallmaintitle">Összes recept</h1>
        <div className="filter-container">

          {/*<span>Érzékenységek figyelembevétele</span>
          <input type="checkbox" name="" className="useAllergy" id="" value={allergies} onChange={(e)=>setUseAllergies(e.target.checked)}/>*/}

          {
            userSensitivities.length>0?     <button className="sensitivityButton" value={allergies} onClick={(e)=>{
              setUseAllergies(!allergies)
              e.target.classList.toggle("disable")
              }} onTouchEnd={(e => {
                e.preventDefault();
                e.target.classList.toggle("disable")
              })}>Érzékenységek</button>:null
          }
     
            <input
              type="text"
              placeholder="Keresés a receptek között..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <select
              value={selectedTag}
              onChange={handleTagChange}
              className="tag-select"
            >
              <option value="">Minden tag</option>
              {(selectTags || []).map((tag) => ( 
                <option key={tag.Tid} value={tag.Nev}>
                  {tag.Nev}
                </option>
              ))}
            </select>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="category-select"
            >
              <option value="">Minden kategória</option>
              {(categories || []).map((category) => (
                <option key={category.Kid} value={category.Nev}>
                  {category.Nev}
                </option>
              ))}
            </select>
          
        </div>
        {error ? (
          <p>{error}</p>
        ) : filteredRecipes.length > 0 ? (
          <div className="blog-grid-view">
            {(filteredRecipes || []).map((recipe) => ( 
              <div
                key={recipe.Rid}
                className="blog-item"
                onClick={() =>
                  console.log("recept", recipe) ||  
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
                <hr />
                <div className="quick-info">
                  <div>
                    <img src={time} alt="" />
                    <span>{recipe.Eperc}</span>
                    <div> Perc</div>
                  </div>
                  <div>
                    <img src={ingredient} alt="" />
                    <span>{recipe.HozzavaloDb}</span>
                    <div>Hozzávaló</div>
                  </div>
                </div>
                <p id="card-description">{recipe.Leiras}</p>
                {ratings[recipe.Rid] && renderStars(ratings[recipe.Rid])}
              </div>
            ))}
          </div>
        ) : (
          <p>Nem találhatóak receptek.</p>
        )}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default ViewAll;