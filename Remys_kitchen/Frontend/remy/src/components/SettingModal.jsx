import React, { useState, useEffect } from "react";
import "../styles/SettingsModal.css";
import {passwordWatcherForProfile } from '../components/Reg/conditions';
import mouseImage from './mouse.svg';
import { useNavigate } from "react-router-dom";

function SettingsModal({ isOpen, onClose, onPasswordChange, onProfilePictureChange }) {
  const [newPassword, setNewPassword] = useState("");
  const [newProfilePicture, setNewProfilePicture] = useState("");
  const [profilePicturePath, setProfilePicturePath] = useState("");
  const [userId, setUserId] = useState(null);
  const [criteriaPassword, setCriteriaPassword] = useState({ //Jelszó krit
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    specialcharacter: false,
  });
  const [IsHidden, setHidden] = useState("hidden");
  const [IsMouseHidden, setMouseHidden] = useState("hidden");
  const [IsProgressBarHidden, setProgressBarHidden] = useState("hidden");

  const [strengthPercentagePassword, setStrengthPercentagePassword] = useState(0); //Jelszó erősség
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUserId(parsedUser.id);
        setNewProfilePicture(parsedUser.ProfilkepURL);
      } catch (error) {
        console.error("Hiba a JSON parseolás során:", error);
      }
    }
  }, []);

  if (!isOpen) return null;

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (typeof onPasswordChange === "function") {
      onPasswordChange(newPassword);
    } else {
      console.warn("onPasswordChange is not a function");
    }
    setNewPassword("");
  };

  const handleProfilePictureSubmit = async (e) => {
    e.preventDefault();
    if (typeof onProfilePictureChange === "function") {
      onProfilePictureChange(newProfilePicture);
    } else {
      console.warn("onProfilePictureChange is not a function");
    }
    setNewProfilePicture(null);
  };

  const multipleShowFocus = () => {
    setHidden("bubbleProfile")
    setMouseHidden("mouse3");
    setProgressBarHidden("ProgressbarProfileContainer");
  }

  const multipleHideBlur = () => {
    setHidden("hidden")
    setMouseHidden("hidden");
    setProgressBarHidden("hidden");
  }

    //Jelszó kezdete
    const checkPassword = (value) => {
      const newCriteria = {
        length: value.length >= 8,
        lowercase: /[a-z]/.test(value),
        uppercase: /[A-Z]/.test(value),
        number: /[0-9]/.test(value),
        specialcharacter: /[@$!%*?&]/.test(value),
      };
      setCriteriaPassword(newCriteria);
  
      const metCriteriaCountPassword = Object.values(newCriteria).filter(Boolean).length;
      const percentagePassword = (metCriteriaCountPassword / 5) * 100; // Csak 5 kritérium van
      setStrengthPercentagePassword(percentagePassword);
    };
  
    const handlePasswordChange = (e) => {
      const newPassword = e.target.value;
      setNewPassword(newPassword);
      checkPassword(newPassword);
    };
  
    //Jelszó vége


      // Fájl feltöltés kezelése
      const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
          setNewProfilePicture(file);
          console.log(newProfilePicture); // Itt null-t ír ki
          const reader = new FileReader();
          reader.onload = (e) => {
            // setPreviewImage(e.target.result);
          };
          reader.readAsDataURL(file);
          const formData = new FormData();
          formData.append('image', file);
    
          try {
            const response = await fetch('http://localhost:5000/upload', {
              method: 'POST',
              body: formData,
            });
    
            const data = await response.json();
            if (response.ok) {
              setProfilePicturePath(data.file_path);
              console.log('Feltöltött fájl elérési útja:', data.file_path);
    
              setNewProfilePicture(data.file_path.split('/')[4]);
              console.log('Feltöltött fájl neve:', data.file_path.split('/')[4]);
    
            } else {
              console.error('Hiba a fájl feltöltése során:', data.error);
              alert('Hiba a fájl feltöltése során: ' + data.error);
            }
          } catch (error) {
            console.error('Hiba a fájl feltöltése során:', error);
            alert('Hiba a fájl feltöltése során: ' + error.message);
          }
        } else {
          alert('Kérlek, csak képet tölts fel!');
        }
      }



  const handleSubmitJelszo = async (e) => {
    e.preventDefault();


    if (!userId) {
      console.error("Felhasználó ID nem található!");
      return;
    }

    if (document.getElementById('fixProfile').innerText==="Jelszó erőssége: Extrém erős") {
      try {
        const response = await fetch(`https://localhost:44350/api/Felhasznalo/${userId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...(newPassword && { Jelszo: newPassword })
          }),
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Hiba a frissítés során: ${response.status} - ${errorText}`);
        }
  
        if (response.status === 200) {
          alert("Sikeres jelszó frissítés");
        } else {
          const updatedUser = await response.json();
          console.log("Sikeres frissítés:", updatedUser);
        }
        multipleHideBlur();
        setNewPassword("");
        setNewProfilePicture(null);
      } catch (error) {
        // console.error("Hiba:", error);
      }
    }
    else{
      alert("A feltételek nem teljesülnek!");
      multipleHideBlur();
    }


  };


  const handleSubmitProfilePicture = async (e) => {
    e.preventDefault();



    if (!userId) {
      console.error("Felhasználó ID nem található!");
      return;
    }

    try {
      const response = await fetch(`https://localhost:44350/api/Felhasznalo/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(newProfilePicture && { ProfilkepURL: newProfilePicture || "" })
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Hiba a frissítés során: ${response.status} - ${errorText}`);
      }

      if (response.ok) {
        const userData = JSON.parse(localStorage.getItem("user"));
        userData.ProfilkepURL = newProfilePicture;
        console.warn(newProfilePicture)
        console.error(userData.ProfilkepURL)
        localStorage.setItem("user", JSON.stringify(userData));
        window.location.href=window.location.href;
        alert("Sikeres profilkép frissítés");
      } else {
        const updatedUser = await response.json();
        console.log("Sikeres frissítés:", updatedUser);
      }

      setNewProfilePicture(null);
    } catch (error) {
       console.error("Hiba:", error);
    }
  };


  const handleAllergenChange=()=>{
    localStorage.setItem("valtozas", true);
    navigate('/allergen');
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <h2 className="samefont">Beállítások</h2>
        <div className="settings-options">
          <div className="password-change">
            <h3 className="samefont">Jelszó módosítása</h3>
            <form onSubmit={handlePasswordSubmit}>
              <input
                id="password"
                type="password"
                placeholder="Új jelszó"
                className="ModalInput"
                value={newPassword}
                onInput={passwordWatcherForProfile}
                onChange={handlePasswordChange}
                onFocus={multipleShowFocus}
                // onBlur={multipleHideBlur}
                required
              />
              <button type="submit" id="changepasswordbutton" onClick={handleSubmitJelszo}>
                Mentés
              </button>
            </form>
          </div>

          
          <div className={IsProgressBarHidden}>
            <div
                className='ProgressBarProfile'
                style={{
                  width: `${strengthPercentagePassword}%`,
                  backgroundColor: strengthPercentagePassword < 25 ? "red" : strengthPercentagePassword < 50 ? "orange" : strengthPercentagePassword < 75 ? "lightgreen" : "green"
                }}></div>
              <p id="fixProfile" className="samefont">
                Jelszó erőssége: {strengthPercentagePassword === 0 ? "Nem teljesül": strengthPercentagePassword < 25 ? "Gyenge" : strengthPercentagePassword < 50 ? "Közepes" : strengthPercentagePassword < 75 ? "Erős" : strengthPercentagePassword < 100 ? "Nagyon erős" : "Extrém erős"}
              </p>
          </div>

          <div className="Dialog-Mouse">

            <div className={IsHidden}>
                <ul className="PasswordModCritsList">
                  <li className="PasswordModCritsLi">Minimum 8 karakter</li>
                  <li className="PasswordModCritsLi">Egy kisbetű és nagybetű</li>
                  <li className="PasswordModCritsLi">Egy szám</li>
                  <li className="PasswordModCritsLi">Egy speciális karakter</li>
                </ul>
            </div>

            <div className={IsMouseHidden}>
              <img src={mouseImage} alt="Mouse" className="mouse-image3" />
            </div>

          </div>

          <div className="changeallergendiv">
            <button
              className="changeallergenbutton"
              onClick={handleAllergenChange}
            >
              Allergén módosítása
            </button>
          </div>

          <div className="profile-picture-change">
            <h3 className="samefont">Profilkép módosítása</h3>
            <form onSubmit={handleProfilePictureSubmit}>
              <input
                type="file"
                className="ModalInput"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
              <button id="ModalSubmit" type="submit" onClick={handleSubmitProfilePicture}>
                Feltöltés
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;