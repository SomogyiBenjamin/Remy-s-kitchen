import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import './Reg.css';
import profilePicture from './profPlaceholder.png';
import mouseImage from '../mouse.svg';
import { checkRegistration, userNameWatcher, emailWatcher, passwordWatcher } from './conditions';
import { criterionU, criterionE, criterionP, Delete } from './criterion';
import './criterion.js';
import Footer from "../Footer.jsx";

function Registration() {
  const [fnev, setFnev] = useState(""); //User name
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");


  const [criteriaUser, setCriteriaUser] = useState({ //User name krit
    length: false,
  });

  const [criteriaEmail, setCriteriaEmail] = useState({ //Email krit
    correctFormat: false,
  });

  const [criteriaPassword, setCriteriaPassword] = useState({ //Jelszó krit
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    specialcharacter: false,
  });

  const [strengthPercentage, setStrengthPercentage] = useState(0); //User name erősség

  const [strengthPercentageEmail, setStrengthPercentageEmail] = useState(0); //Email erősség

  const [strengthPercentagePassword, setStrengthPercentagePassword] = useState(0); //Jelszó erősség

  const navigate = useNavigate();

  //User name
  const checkUserName = (value) => {
    const newCriteria = {
      length: value.length >= 3,
    };
    setCriteriaUser(newCriteria);

    const metCriteriaCount = Object.values(newCriteria).filter(Boolean).length;
    const percentage = (metCriteriaCount / 1) * 100; // Csak 1 kritérium van
    setStrengthPercentage(percentage);
  };

  const handleUserNameChange = (e) => {
    const newUserName = e.target.value;
    setFnev(newUserName);
    checkUserName(newUserName);
  };
  //User name vége

  //Email kezdete
  const checkEmail = (value) => {
    const newCriteria = {
      correctFormat: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
    };
    setCriteriaEmail(newCriteria);

    const metCriteriaCountEmail = Object.values(newCriteria).filter(Boolean).length;
    const percentageEmail = (metCriteriaCountEmail / 1) * 100; // Csak 1 kritérium van
    setStrengthPercentageEmail(percentageEmail);
  };


  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    checkEmail(newEmail);
  };
  //Email vége


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
    setPassword(newPassword);
    checkPassword(newPassword);
  };

  //Jelszó vége

  const [previewImage, setPreviewImage] = useState(null);
  const [fileName, setFileName] = useState(""); // Kép neve
  const [profilePicturePath, setProfilePicturePath] = useState("")
  const fileInputRef = useRef(null);

  // Placeholder kattintás kezelése
  const handlePlaceholderClick = () => {
    fileInputRef.current.click();
  };

  // Fájl feltöltés kezelése
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setFileName(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result); // Beállítjuk az előnézetet
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

          setFileName(data.file_path.split('/')[4]);
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


  async function ReservedUserName(){
    let data= await fetch('https://localhost:44350/api/Felhasznalo').then(response => response.json()).catch(error => console.error('Hiba:', error));

    for (let i=0; i<data.length; i++){
      if (data[i].Fnev===fnev){
        alert('Ez a felhasználónév már foglalt!');
        return true;
        break;
      }
    }
  }

 async function ReservedEmail(){
    let data= await fetch('https://localhost:44350/api/Felhasznalo').then(response => response.json()).catch(error => console.error('Hiba:', error));

    for (let i=0; i<data.length; i++){
      if (data[i].Email===email){
        alert('Ez az Email cím már foglalt!');
        break;
      }
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (checkRegistration() === false && ReservedEmail() !== true && ReservedUserName() !== true) {
      try {
        const response = await fetch('https://localhost:44350/api/Felhasznalo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Fnev: fnev,
            Email: email,
            Jelszo: password,
            Jogosultsag: 2,
            Erzekeny: "",
            ProfilkepURL: fileName || '',
          }),
        });

        if (response.ok) {
          const fetchResponse = await fetch('https://localhost:44350/api/Felhasznalo', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const contentType = fetchResponse.headers.get('Content-Type') || '';
          if (contentType.includes('application/json')) {
            const data = await fetchResponse.json();
            if (Array.isArray(data) && data.length > 0) {
              const lastUser = data.reduce((prev, current) => (prev.id > current.id) ? prev : current);
              localStorage.setItem('user', JSON.stringify(lastUser));
            }
          }

          navigate('/allergen');
        }
      } catch (error) {
        console.error('Hiba:', error);
      }
    }

  };

  const [IsHidden, setHidden] = useState("hidden");

  const DialogBoxShow = () => {
    setHidden("bubble")
  }

  const DialogBoxHiden = () => {
    setHidden("hidden")
  }

  const [IsHiddenSmall, setHiddenSmall] = useState("SmallSizeCritPlace");

  const DialogBoxShowSmall = () => {
    setHiddenSmall("SmallSizeCritPlace")
  }

  const DialogBoxHidenSmall = () => {
    setHiddenSmall("hidden")
  }


  const multipleShowFocus = () => {
    DialogBoxShow();
    DialogBoxShowSmall();
  }

  const multipleHideBlur = () => {
    DialogBoxHiden();
    DialogBoxHidenSmall();
  }

  

  return (
    <div className='felbody'>
      <div className="frame">
        <div className="column1">
          <div className="flex1">
            <h2>Üdvözlünk a Remy's Kitchenben!</h2>
            <img
              src={previewImage || profilePicture}
              className="placeholder"
              id="profilePicture"
              alt="Profilkép"
              onClick={handlePlaceholderClick}
              style={{ cursor: 'pointer' }}
            />
            <p>Profilkép</p>
            <div className='criteria'></div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>
          <div className="mouse2">
            <img src={mouseImage} alt="Mouse" className="mouse-image2" />
          </div>

          <div class={IsHidden}>
            <ul className="bubblelist">
              <li className="bubblelistli">Minimum 8 karakter</li>
              <li className="bubblelistli">Egy kis- és nagybetű</li>
              <li className="bubblelistli">Egy szám</li>
              <li className="bubblelistli">Egy speciális karakter</li>
            </ul>
          </div>

          <p>Receptek, amelyek életre kelnek.</p>
        </div>

        <div className="columm2">
          <h2>Regisztráció</h2>
            <div className="containerReg fnevField">
              <div className="entryarea">
                <input
                  type="text"
                  id="fname"
                  name='fname'
                  className="inputField"
                  required
                  value={fnev}
                  onBlur={Delete}
                  // onInput={userNameWatcher}
                  onChange={handleUserNameChange}
                />
                <div className="labelLine">Felhasználónév</div>
              </div>

              <div className='progress-bar-container'>
                <div
                  className='progress-bar'
                  style={{
                    width: `${strengthPercentage}%`,
                    backgroundColor: strengthPercentage === 0 ? "red" : "green",
                  }}
                ></div>
              </div>
              <p id="fix">
                Minimum 3 karakter: {strengthPercentage === 0 ? "Nem teljesül" : "Teljesül"}
              </p>
            </div>

            <div className="containerReg emailField">
              <div className="entryarea">
                <input
                  type="text"
                  id="email"
                  className="inputField"
                  required
                  value={email}
                  onBlur={Delete}
                  // onInput={emailWatcher}
                  onChange={handleEmailChange}
                />
                <div className="labelLine">E-mail cím</div>
              </div>

              <div className='progress-bar-container'>
                <div
                  className='progress-bar'
                  style={{
                    width: `${strengthPercentageEmail}%`,
                    backgroundColor: strengthPercentageEmail === 0 ? "red" : "green",
                  }}
                ></div>
              </div>
              <p id="fix2">
                Helyes Email formátum: {strengthPercentageEmail === 0 ? "Nem teljesül" : "Teljesül"}
              </p>

            </div>

            <div className="containerReg passwordField">
              <div className="entryarea">
                <input
                  type="password"
                  id="password"
                  className="inputField"
                  required
                  value={password}
                  onBlur={multipleHideBlur}
                  onFocus={multipleShowFocus}
                  onInput={passwordWatcher}
                  onChange={handlePasswordChange}
                />
                <div className="labelLine">Jelszó</div>
              </div>

              <div className={IsHiddenSmall}>
                  <ul className="SmallSizeCritPlaceUl">
                    <li className="SmallSizeCritPlaceLi">Minimum 8 karakter</li>
                    <li className="SmallSizeCritPlaceLi">Egy kisbetű és nagybetű</li>
                    <li className="SmallSizeCritPlaceLi">Egy szám</li>
                    <li className="SmallSizeCritPlaceLi">Egy speciális karakter</li>
                  </ul>
              </div>

              <div className='progress-bar-container'>
                <div
                  className='progress-bar'
                  style={{
                    width: `${strengthPercentagePassword}%`,
                    backgroundColor: strengthPercentagePassword < 25 ? "red" : strengthPercentagePassword < 50 ? "orange" : strengthPercentagePassword < 75 ? "lightgreen" : "green"
                  }}
                ></div>
              </div>
              
              <p id="fix3">
                Jelszó erőssége: {strengthPercentagePassword === 0 ? "Nem teljesül": strengthPercentagePassword < 25 ? "Gyenge" : strengthPercentagePassword < 50 ? "Közepes" : strengthPercentagePassword < 75 ? "Erős" : strengthPercentagePassword < 100 ? "Nagyon erős" : "Extrém erős"}
              </p>
            </div>

            <div className="containerReg rePasswordField">
              <div className="entryarea">
                <input
                  type="password"
                  id="rePassword"
                  className="inputField"
                  required
                  value={rePassword}
                  onChange={(e) => setRePassword(e.target.value)}
                />
                <div className="labelLine">Jelszó újra</div>
              </div>
            </div>

            <button type="submit" className="button2" onClick={handleSubmit}>
              <p>Fiók létrehozása</p>
            </button>
          
        </div>
      </div>
    </div>
  );
}

export default Registration;