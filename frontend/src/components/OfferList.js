import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import OfferCard from './OfferCard';
import './OfferList.css';

const OfferList = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOffers, setSelectedOffers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const response = await axios.get('https://prjfinal-studi.onrender.com/api/offers');
                setOffers(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des offres:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOffers();
    }, []);

    const toggleOfferSelection = (offer) => {
        if (selectedOffers.includes(offer)) {
            setSelectedOffers(selectedOffers.filter(o => o.offer_id !== offer.offer_id));
        } else {
            setSelectedOffers([...selectedOffers, offer]);
        }
    };

    const handlePaymentClick = () => {
        navigate('/checkout', { state: { selectedOffers } });
    };

    if (loading) {
        return <div>Chargement...</div>;
    }

    return (
        <div className="offer-list">
            <div className="offers-container">
                {offers.map(offer => (
                    <OfferCard
                        key={offer.offer_id}
                        offer={offer}
                        isSelected={selectedOffers.includes(offer)}
                        toggleOfferSelection={toggleOfferSelection}
                    />
                ))}
            </div>

            <div className="cart-summary">
                <h2>Panier</h2>
                {selectedOffers.length > 0 ? (
                    <>
                        {selectedOffers.map(offer => (
                            <div key={offer.offer_id}>
                                <p>{offer.offer_name} - {offer.price} €</p>
                            </div>
                        ))}
                        <button onClick={handlePaymentClick} className="pay-button">
                            Payer
                        </button>
                    </>
                ) : (
                    <p>Votre panier est vide.</p> 
                )}
            </div>
        </div>
    );
};

export default OfferList;
