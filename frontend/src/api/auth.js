import axios from 'axios';

const API_URL = 'https://prjfinal-studi-frontend.onrender.com/api/auth'; 

// Fonction d'inscription
export const registerUser = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};

// Fonction de connexion
export const loginUser = async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
};

const fetchUserData = async () => {
    try {
      const response = await axios.get('https://prjfinal-studi-frontend.onrender.com/api/profile', { withCredentials: true });
      console.log(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error);
    }
  };
