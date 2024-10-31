import React, { useState } from 'react';
import { useLocation} from 'react-router-dom';
import axios from 'axios';

const CheckoutPage = () => {
    const location = useLocation();
    const { selectedOffers } = location.state || { selectedOffers: [] };
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null);

    const totalAmount = selectedOffers.reduce((total, offer) => total + parseFloat(offer.price), 0);

    // Fonction pour simuler la finalisation de l'achat
    const handlePayment = async () => {
        if (isProcessing || selectedOffers.length === 0) return;

        setIsProcessing(true); 
        setPaymentStatus(null);

        // Obtenir l'ID de l'utilisateur et le token du localStorage
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        // Ajoute un log pour vérifier si userId est bien récupéré
        console.log('userId:', userId);

        // Temporisation de 3 secondes avant de simuler le paiement
        await new Promise((resolve) => setTimeout(resolve, 3000)); // 3000 ms = 3 secondes

        const isSuccess = Math.random() > 0.05; // Simuler 95% de réussite

        if (isSuccess) {
            try {
                // Mettre à jour la quantité d'offres vendues
                const offerPromises = selectedOffers.map(offer => 
                    axios.put(`https://prjfinal-studi.onrender.com/api/offers/${offer.offer_id}/purchase`, {
                        quantity: 1,
                    }, {
                        headers: {
                            'Authorization': `Bearer ${token}`, 
                        }
                    })
                );

                await Promise.all(offerPromises);

                // Créer les billets
                const ticketPromises = selectedOffers.map(offer =>
                    axios.post('https://prjfinal-studi.onrender.com/api/tickets', {
                        offer_id: offer.offer_id,
                        purchase_amount: offer.price,
                    }, {
                        headers: {
                            'Authorization': `Bearer ${token}` 
                        }
                    })
                );

                const ticketResponses = await Promise.all(ticketPromises);

                // Créer les paiements
                const paymentPromises = ticketResponses.map(ticket => {
                    console.log('Payment data:', {
                        user_id: userId,
                        ticket_id: ticket.data.ticket_id,
                        amount: ticket.data.purchase_amount,
                        status: 'réussi',
                    });

                    return axios.post('https://prjfinal-studi.onrender.com/api/payments/create', {
                        user_id: userId,
                        ticket_id: ticket.data.ticket_id,
                        amount: ticket.data.purchase_amount,
                        status: 'réussi',
                    }, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                });

                await Promise.all(paymentPromises);

                console.log('Paiement réussi et billets créés !');
                setPaymentStatus('success'); // Paiement réussi
            } catch (error) {
                console.error('Erreur lors de la création du paiement ou de la mise à jour de l\'offre:', error);
                setPaymentStatus('failed'); // Paiement échoué
            }
        } else {
            console.log('Échec simulé du paiement.');
            setPaymentStatus('failed');
        }

        setIsProcessing(false);
    };

    return (
        <div className="checkout-page">
            <h1>Récapitulatif de la commande</h1>
            {selectedOffers.length > 0 ? (
                <>
                    {selectedOffers.map(offer => (
                        <div key={offer.offer_id}>
                            <p>{offer.offer_name} - {offer.price} €</p>
                        </div>
                    ))}
                    <div className="total-amount">
                        <h3>Total: {totalAmount.toFixed(2)} €</h3>
                    </div>
                    <button
                        onClick={handlePayment}
                        className="finalize-payment-button"
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'Traitement en cours...' : 'Finaliser le paiement'}
                    </button>
                </>
            ) : (
                <p>Votre panier est vide.</p>
            )}

            {paymentStatus === 'success' && (
                <div>
                    <h2>Paiement réussi !</h2>
                </div>
            )}
            {paymentStatus === 'failed' && (
                <div>
                    <h2>Échec du paiement !</h2>
                    <p>Une erreur est survenue. Veuillez réessayer.</p>
                </div>
            )}
        </div>
    );
};

export default CheckoutPage;
