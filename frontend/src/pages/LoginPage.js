import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css'; 
import { jwtDecode } from 'jwt-decode'; 
import '../components/LoginPage.css'; 

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState(''); 
    const [message, setMessage] = useState(''); 
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage(''); 

        try {
            const response = await axios.post('https://prjfinal-studi-frontend.onrender.com/api/login', {
                email,
                password,
                phone, 
            }, { withCredentials: true });

            console.log("Réponse de l'API:", response.data); 

            if (response.data.token) {
                const { token } = response.data; 
                const decodedToken = jwtDecode(token); 
                const userId = decodedToken.id; 
                const role = decodedToken.role; 

                localStorage.setItem('token', token); 
                localStorage.setItem('userId', userId); 
                localStorage.setItem('role', role); 

                // Si la connexion est réussie, redirige vers la page de profil
                setMessage('Connexion réussie !'); // Message de succès
                navigate('/profile');
            } else {
                throw new Error('Token manquant dans la réponse.');
            }
        } catch (error) {
            console.error("Erreur lors de la connexion:", error);
            setMessage('Erreur lors de la connexion.');
        }
    };

    return (
        <div className="login-container">
            <h2>Se connecter</h2>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label>Email :</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Mot de passe :</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mot de passe"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Numéro de téléphone :</label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Numéro de téléphone"
                        required
                    />
                </div>
                <button type="submit">Se connecter</button>
                {message && <p className="alert">{message}</p>}
            </form>
            <div className="button-container">
                <button onClick={() => navigate('/register')}>S'inscrire</button>
                <button onClick={() => navigate('/reset-password')}>Réinitialiser le mot de passe</button>
            </div>
        </div>
    );
};

export default LoginPage;
