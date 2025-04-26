import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './Log.css';


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        localStorage.clear();



        try {
            const response = await fetch('https://localhost:44350/api/Felhasznalo/authenticate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Email: email,
                    Jelszo: password
                })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('user', JSON.stringify(data));
            }
        } catch (error) {
           
        }

        if (localStorage.length>0){
            navigate('/home')
        }
        else{
            alert('Sikertelen bejelentkezés!');
        }
    };

    return (
        <div className="fo">

            <div className="kell">
            <div className="frameLog">
                <div className="contentLog">
                    <h1>Bejelentkezés</h1>

                    <form onSubmit={handleLogin}>
                        <div className="container2">
                            <div className="entryareaLog">
                                <input 
                                    type="text" 
                                    className="inputFieldLog" 
                                    required 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                />
                                <div className="labelLineLog">E-mail</div>
                            </div>
                        </div>

                        <div className="container2">
                            <div className="entryareaLog">
                                <input 
                                    type="password" 
                                    className="inputFieldLog" 
                                    required 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                />
                                <div className="labelLineLog">Jelszó</div>
                            </div>
                        </div>

                        <button className="loginbutton" type="submit">
                            <p>Belépés</p>
                        </button>
                    </form>

                    <div className="missingAccount">
                        <p id="text">Még nincs fiókod?</p>
                        <button className="Regbutton" onClick={() => navigate('/reg')}>
                            <p>Fiók létrehozása</p>
                        </button>
                    </div>
                </div>

            </div>
            </div>

    <footer className="footerLogin">
      <div className="footer-contentLogin">
        <p>&copy; 2024 Remy's Kitchen. All rights reserved.</p>
        <p>Contact us: info@remykt.com</p>
      </div>
    </footer>

        </div>

        
    );
}

export default Login;
