import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../components/Invoices.css';

const Invoices = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await axios.get(`https://prjfinal-studi.onrender.com/api/payments/user/${userId}`);
                setPayments(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Erreur lors de la récupération des paiements :', error);
                setLoading(false);
            }
        };

        fetchPayments();
    }, [userId]);

    if (loading) {
        return <p>Chargement des factures...</p>;
    }

    return (
        <div className="invoice-container">
            <h1>Mes Factures</h1>
            {payments.length > 0 ? (
                <div className="invoice-list">
                    {payments.map(payment => (
                        <div key={payment.payment_id} className="invoice-receipt">
                            <div className="invoice-header">
                                <h3 className="invoice-amount">Montant : {payment.amount} €</h3>
                                <p className="invoice-date">Date : {new Date(payment.payment_date).toLocaleString()}</p>
                            </div>
                            <div className="invoice-body">
                                <p><strong>Statut :</strong> {payment.status}</p>
                                <p><strong>ID du Ticket :</strong> {payment.ticket_id}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Aucun paiement trouvé.</p>
            )}
        </div>
    );
};

export default Invoices;
