const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Connexion à la base de données

// Endpoint pour récupérer les paiements d'un utilisateur
router.get('/user/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const payments = await pool.query(
            `SELECT p.payment_id, p.amount, p.payment_date, p.status, t.ticket_id 
             FROM payments p
             JOIN tickets t ON p.ticket_id = t.ticket_id
             WHERE p.user_id = $1`,
            [userId]
        );

        res.json(payments.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des paiements :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des paiements' });
    }
});

// Endpoint pour enregistrer un nouveau paiement
router.post('/create', async (req, res) => {
    const { user_id, ticket_id, amount, status } = req.body;

    if (!user_id) {
        return res.status(400).json({ error: 'L\'ID utilisateur est requis' });
    }
    
    try {
        const newPayment = await pool.query(
            `INSERT INTO payments (user_id, ticket_id, amount, payment_date, status) 
             VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4) RETURNING *`,
            [user_id, ticket_id, amount, status]
        );

        res.json(newPayment.rows[0]);
    } catch (error) {
        console.error('Erreur lors de la création du paiement :', error);
        res.status(500).json({ error: 'Erreur lors de la création du paiement' });
    }
});

module.exports = router;
