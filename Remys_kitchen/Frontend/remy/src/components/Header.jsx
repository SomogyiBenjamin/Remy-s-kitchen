import React, { useState, useEffect } from "react";
import "../styles/Header.css";
import { useNavigate } from "react-router-dom";
import Success from "../pages/uploadSuccess.jsx";

function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser
      ? JSON.parse(storedUser)
      : null
  });
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } else {
 
    }

    var user = localStorage.getItem("user");
    user = JSON.parse(user);
  }, []);
  localStorage.setItem("user", JSON.stringify(user));
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null); 
    navigate('/')
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <header className="header">
      <div className="logo" onClick={() => navigate("/home")}>
        Remy's Kitchen
      </div>
      <button className="hamburger" onClick={toggleMenu}>
        <span className="line"></span>
        <span className="line"></span>
        <span className="line"></span>
      </button>
      <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
        <a className="nav-link" onClick={() => navigate("/home")}>Home</a>
        <a className="nav-link"
          onClick={() => {
            user==null ? setIsModalOpen(true) : navigate("/upload")
          }}
        >
          Recept feltöltés
        </a>
        <a className="nav-link"
          onClick={() => {
            toggleMenu();
            navigate("/fridge");
          }}
        >
          Mi van a hűtődben?
        </a>
        <a className="nav-link"
          onClick={() => {
            toggleMenu();
            navigate("/viewAll");
          }}
        >
          Összes megtekintése
        </a>
        {user?.Jogosultsag === 1 && ( // Jogosultság alapján jelenítjük meg
          <a className="nav-link"
            onClick={() => {
              toggleMenu();
              navigate("/pendingRecipes");
            }}
          >
            Döntésre váró receptek
          </a>
        )}
      </nav>
      <div className="profile samefont">
        <button className="profile-icon" onClick={toggleProfileMenu}>
        <img
        src={
        user?.ProfilkepURL
          ? `/asserts/kepek/${user.ProfilkepURL}`
          : `/asserts/kepek/profPlaceholder.png`
        }
        alt="Profil"
      className="profile-icon-img"
      />


        </button>
        {isProfileMenuOpen && (
          <div className="profile-menu">
            {user ? (
              <>
                <a
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    navigate("/profile");
                  }}
                >
                  Profil
                </a>
                <a
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    handleLogout();
                  }}
                >
                  Kijelentkezés
                </a>
              </>
            ) : (
              <>
                <a
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    navigate("/log");
                  }}
                >
                  Bejelentkezés
                </a>
                <a
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    navigate("/reg");
                  }}
                >
                  Regisztráció
                </a>
              </>
            )}
          </div>
        )}
      </div>
      <Success isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="A funkció elérése megtagadva!" description="Az oldalon néhány funkció csak regisztrált felhasználók számára elérhető. 
      A folytatáshoz jelentkezz be, vagy regisztrálj új fiókot!" buttonText="Megértettem" relocate="/home"/>
    </header>
  );
}

export default Header;
