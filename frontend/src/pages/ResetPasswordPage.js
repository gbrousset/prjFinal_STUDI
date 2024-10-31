import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css'; 

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post('https://prjfinal-studi-frontend.onrender.com/api/reset-password', {
        email,
        newPassword,
        phone,
      });

      if (response.status === 200) {
        setMessage('Mot de passe réinitialisé avec succès.');
        navigate('/login');
      }
    } catch (error) {
      console.error("Erreur lors de la réinitialisation du mot de passe:", error);
      setMessage('Erreur lors de la réinitialisation du mot de passe.');
    }
  };

  return (
    <div className="container">
      <h2>Réinitialiser le mot de passe</h2> 
      <form onSubmit={handleResetPassword}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email"
          required 
        />
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)} 
          placeholder="Numéro de téléphone"
          required 
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)} 
          placeholder="Nouveau mot de passe"
          required 
        />
        <button type="submit">Réinitialiser le mot de passe</button> 
        {message && <p className="alert">{message}</p>} 
      </form>
    </div>
  );
};

export default ResetPasswordPage;
