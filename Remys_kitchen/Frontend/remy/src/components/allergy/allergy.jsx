import React from 'react';
import { useState, useEffect } from 'react';
import './allergy.css';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer';

function Allergy() {
  const allergensList = [
    'Glutén',
    'Rákfélék',
    'Tojás',
    'Hal',
    'Földimogyoró',
    'Szójabab',
    'Tej',
    'Diófélék',
    'Zeller',
    'Mustár',
    'Szezámmag',
    'Kén-dioxid',
    'Csillagfürt',
    'Puhatestűek',
  ];

  const allergenImages = {
    'Glutén': '/images/wheat.png',
    'Rákfélék': '/images/crab.png',
    'Tojás': '/images/egg.png',
    'Hal': '/images/fish.png',
    'Földimogyoró': '/images/peanut.png',
    'Szójabab': '/images/soyabean.png',
    'Tej': '/images/milk-can.png',
    'Diófélék': '/images/wallnut.png',
    'Zeller': '/images/celery.png',
    'Mustár': '/images/mustard.png',
    'Szezámmag': '/images/sesame-seed.png',
    'Kén-dioxid': '/images/sulfur-dioxide.png',
    'Csillagfürt': '/images/csillagfurt.png',
    'Puhatestűek': '/images/shell.png',
  };


  const [checkedStates, setCheckedStates] = useState(
    Object.fromEntries(allergensList.map(allergen => [allergen, false]))
  );
  const [sensitivities, setSensitivites] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchUserSensitivies = async () => {
      try {
        const response = await fetch(`https://localhost:44350/api/Felhasznalo_Erzekenyseg/${user.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setSensitivites(data);

          const updatedCheckedStates = { ...checkedStates };
          data.forEach(sensitivity => {
            if (allergensList.includes(sensitivity.ErzekenysegNev)) {
              updatedCheckedStates[sensitivity.ErzekenysegNev] = true;
            }
          });
          setCheckedStates(updatedCheckedStates);
        }
      } catch (error) {
        console.error('Error fetching sensitivities:', error);
      }
    };
    fetchUserSensitivies();
  }, []);

  let legnagyobb = 0;
  let allergens = [];

  const navigate = useNavigate();

  const handleGoToLogin = () => {
    console.warn(localStorage.getItem("valtozas"))
    if(localStorage.getItem("valtozas")){
      localStorage.removeItem("valtozas")
      navigate("/profile")
    } 
    else{
      navigate('/taste-profile');
    }

  };

  const handleSave = () => {
    allergens = allergensList.filter(allergen => checkedStates[allergen]);
  };

  async function handleContinueReg() {
    legnagyobb = 0;
    try {
      const response = await fetch('https://localhost:44350/api/Felhasznalo', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        for (const key in data) {
          if (data[key].Fnev === JSON.parse(localStorage.getItem('user')).Fnev) {
            legnagyobb = data[key].Id;
          }
        }
      }
    } catch (error) {
      console.error('Error in handleContinueReg:', error);
    }
  }

  async function saveAllergens() {
    for (const element of allergens) {
      console.log(element + ' allergen feltöltve');
      try {
        const response = await fetch('https://localhost:44350/api/Felhasznalo_Erzekenyseg', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            FelhasznaloId: user.id,
            ErzekenysegNev: element,
          }),
        });
        if (!(await response).ok) {
          console.error('Failed to save allergen:', element);
        }

        sensitivities.map(async (item)=>{
          if(element.includes(item.ErzekenysegNev)==false){
            const del=await fetch(`https://localhost:44350/api/Felhasznalo_Erzekenyseg?ErzNev=${item.ErzekenysegNev}&fid=${user.id}`,{
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
            })
            allergens=allergens.filter((allergen)=>allergen!=item.ErzekenysegNev)
            
          }
        
        })

      } catch (error) {
        console.error('Error saving allergen:', element, error);
      }
    }
    if(allergens.length==0 && sensitivities.length!=0){
      sensitivities.map(async (item)=>{
        const del=await fetch(`https://localhost:44350/api/Felhasznalo_Erzekenyseg?ErzNev=${item.ErzekenysegNev}&fid=${user.id}`,{
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      })
      
    }
  }

  async function handleEvents() {
    handleSave();
    await handleContinueReg();
    await saveAllergens();
    handleGoToLogin();
  }

  function toggleMenu() {
    const menu = document.querySelector('.headerlist');
    menu.classList.toggle('show');
  }

  const toggleCheckbox = (allergen) => {
    setCheckedStates(prev => ({
      ...prev,
      [allergen]: !prev[allergen],
    }));
  };

  return (
    <div className="App">
      <main>
        <h1 className='maintitle'>Válasszon allergént</h1>
        <div className='typesRow1'>
          {allergensList.slice(0, 3).map((allergen, index) => (
            <div className='item' key={allergen}>
              <div className='card' onClick={() => toggleCheckbox(allergen)}>
                <h3>{allergen}</h3>
                <img src={allergenImages[allergen]} alt={allergen} className='kep'/>
                <div className="ContainerCheckbox">
                  <input
                    type="checkbox"
                    checked={checkedStates[allergen]}
                    onChange={() => toggleCheckbox(allergen)}
                    id={`checkbox${index + 1}`}
                  />
                  <label htmlFor={`checkbox${index + 1}`} onClick={() => toggleCheckbox(allergen)}>
                    {index + 1}.
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className='typesRow1'>
          {allergensList.slice(3).map((allergen, index) => (
            <div className='item' key={allergen}>
              <div className='card' onClick={() => toggleCheckbox(allergen)}>
                <h3>{allergen}</h3>
                <img src={allergenImages[allergen]} alt={allergen} className='kep'/>
                <div className="ContainerCheckbox">
                  <input
                    type="checkbox"
                    checked={checkedStates[allergen]}
                    onChange={() => toggleCheckbox(allergen)}
                    id={`checkbox${index + 4}`}
                  />
                  <label htmlFor={`checkbox${index + 4}`} onClick={() => toggleCheckbox(allergen)}>
                    {index + 4}.
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <div className='buttondiv' onClick={handleEvents}>
        <button className="buttonallergy"><span>Mentés</span></button>
      </div>
      <Footer />
    </div>
  );
}

export default Allergy;