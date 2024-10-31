import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../components/AdminDashboard.css';

const AdminDashboard = () => {
    const [offers, setOffers] = useState([]);
    const [offerName, setOfferName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantityTotal, setQuantityTotal] = useState('');
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const adminId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const response = await axios.get('https://prjfinal-studi.onrender.com/api/offers');
                setOffers(response.data);
            } catch (err) {
                console.error('Erreur lors de la récupération des offres:', err);
                setError('Erreur lors de la récupération des offres.');
            } finally {
                setLoading(false);
            }
        };

        fetchOffers();
    }, []);

    const handleCreateOrUpdateOffer = async (e) => {
        e.preventDefault();
        const offerData = {
            offer_name: offerName,
            description: description,
            price: parseFloat(price),
            quantity_total: parseInt(quantityTotal, 10),
            admin_id: adminId,
        };

        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            if (selectedOffer) {
                await axios.put(`https://prjfinal-studi.onrender.com/api/offers/${selectedOffer.offer_id}`, offerData, { headers });
            } else {
                await axios.post('https://prjfinal-studi.onrender.com/api/offers', offerData, { headers });
            }

            // Réinitialiser les champs du formulaire
            setOfferName('');
            setDescription('');
            setPrice('');
            setQuantityTotal('');
            setSelectedOffer(null);

            // Récupérer à nouveau les offres
            const response = await axios.get('https://prjfinal-studi.onrender.com/api/offers');
            setOffers(response.data);
        } catch (err) {
            console.error('Erreur lors de la création ou de la mise à jour de l\'offre:', err);
            setError('Erreur lors de la création ou de la mise à jour de l\'offre.');
        }
    };

    const handleDeleteOffer = async (offerId) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            await axios.delete(`https://prjfinal-studi.onrender.com/api/offers/${offerId}`, { headers });
            // Mettre à jour la liste des offres
            setOffers(offers.filter(offer => offer.offer_id !== offerId));
        } catch (err) {
            console.error('Erreur lors de la suppression de l\'offre:', err);
            setError('Erreur lors de la suppression de l\'offre.');
        }
    };

    const handleEditOffer = (offer) => {
        // Remplir le formulaire avec les données de l'offre sélectionnée
        setOfferName(offer.offer_name);
        setDescription(offer.description);
        setPrice(offer.price);
        setQuantityTotal(offer.quantity_total);
        setSelectedOffer(offer);
    };

    if (loading) {
        return <p>Chargement des offres...</p>;
    }

    return (
        <div className="admin-dashboard">
            <h2>Gestion des Offres</h2>
            {error && <p className="alert alert-danger">{error}</p>}
            <form onSubmit={handleCreateOrUpdateOffer} className="offer-form">
                <input
                    type="text"
                    placeholder="Nom de l'offre"
                    value={offerName}
                    onChange={(e) => setOfferName(e.target.value)}
                    required
                    className="form-control"
                />
                <textarea
                    placeholder="Description de l'offre"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="form-control"
                />
                <input
                    type="number"
                    step="0.01"
                    placeholder="Prix de l'offre"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="form-control"
                />
                <input
                    type="number"
                    placeholder="Quantité totale"
                    value={quantityTotal}
                    onChange={(e) => setQuantityTotal(e.target.value)}
                    required
                    className="form-control"
                />
                <button type="submit" className="btn btn-primary">
                    {selectedOffer ? 'Mettre à jour' : 'Créer'} l'offre
                </button>
            </form>

            <div className="offer-list">
                {offers.map(offer => (
                    <div key={offer.offer_id} className="offer-card">
                        <h3>{offer.offer_name}</h3>
                        <p>{offer.description}</p>
                        <p>Prix : {offer.price} €</p>
                        <p>Quantité totale : {offer.quantity_total} billets disponibles</p>
                        <div className="offer-actions">
                            <button className="btn btn-warning" onClick={() => handleEditOffer(offer)}>Modifier</button>
                            <button className="btn btn-danger" onClick={() => handleDeleteOffer(offer.offer_id)}>Supprimer</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
