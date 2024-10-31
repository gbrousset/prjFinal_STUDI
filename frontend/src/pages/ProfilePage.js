import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../components/ProfilePage.css'; 

const ProfilePage = () => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get('https://prjfinal-studi-frontend.onrender.com/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          withCredentials: true
        });
        setUser(response.data);
      } catch (err) {
        console.error('Erreur lors de la récupération des données utilisateur:', err);
        setError('Erreur lors de la récupération des données.');
        navigate('/login');
      } finally {
        setLoading(false); 
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post('https://prjfinal-studi-frontend.onrender.com/api/logout', {}, { withCredentials: true });
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      setError('Erreur lors de la déconnexion.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault(); 
    const token = localStorage.getItem('token');

    try {
      const response = await axios.put('https://prjfinal-studi-frontend.onrender.com/api/profile', {
        email: newEmail, 
        password: newPassword 
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        withCredentials: true
      });

      setUser({ ...user, email: response.data.email });
      setNewEmail('');
      setNewPassword('');
      setError(''); 
    } catch (err) {
      console.error('Erreur lors de la mise à jour du profil:', err);
      setError('Erreur lors de la mise à jour des données.');
    }
  };

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="profile-container">
      {error && <div className="alert alert-danger">{error}</div>}
      {user ? (
        <div>
          <div className="card user-info">
            <div className="card-body">
              <h5 className="card-title">Bienvenue, {user.username}</h5>
              <p className="card-text">Email: {user.email}</p>
              <p className="card-text">Statut : {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}</p>
              <button className="btn btn-danger logout-button" onClick={handleLogout}>Déconnexion</button>
            </div>
          </div>

          <h5 className="update-title">Mettre à jour le profil</h5>
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Nouvel email"
                className="form-control"
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nouveau mot de passe"
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary">Mettre à jour</button>
          </form>
        </div>
      ) : (
        <p>Chargement...</p> 
      )}
      <div className="actions">
        <button onClick={() => navigate('/tickets')} className="btn btn-secondary">Voir mes billets</button> 
        <button onClick={() => navigate('/mes-factures')} className="btn btn-secondary">Mes Factures</button> 
      </div>
    </div>
  );
};

export default ProfilePage;
