import React, { useEffect, useState } from 'react';
import axios from 'axios';
import QRCodeComposant from '../components/QRCodeComponent';
import '../components/TicketList.css';

const TicketList = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const token = localStorage.getItem('auth_key');
                const response = await axios.get('https://prjfinal-studi.onrender.com/api/tickets', { withCredentials: true });
                setTickets(response.data);
            } catch (err) {
                console.error('Erreur lors de la récupération des billets:', err);
                setError('Erreur lors de la récupération des billets.');
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    if (loading) {
        return <p>Chargement des billets...</p>;
    }

    return (
        <div className="ticket-container">
            <h2>Mes Billets</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {tickets.length > 0 ? (
                tickets.map(ticket => (
                    <div key={ticket.ticket_id} className="ticket">
                        <div className="ticket-content">
                            <div className="ticket-qr">
                                <QRCodeComposant 
                                    authKey={localStorage.getItem('auth_key')} 
                                    ticketKey={ticket.ticket_key} 
                                />
                            </div>
                            <div className="ticket-info">
                                <div className="ticket-header">
                                    <span className="ticket-amount">Montant : {ticket.purchase_amount} €</span>
                                </div>
                                <h3 className="ticket-id">{ticket.ticket_id}</h3>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p>Aucun billet trouvé.</p>
            )}
        </div>
    );
};

export default TicketList;
