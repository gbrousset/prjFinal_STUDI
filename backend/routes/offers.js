const express = require('express');
const db = require('../config/db'); // Connexion à la base de données
const authenticateToken = require('../middleware/auth');
const authenticateAdmin = require('../middleware/authAdmin');

const router = express.Router();

// Créer une offre
router.post('/', authenticateToken, authenticateAdmin, async (req, res) => {
    const { offer_name, description, price, quantity_total } = req.body;
  
    if (!offer_name || !description || !price || !quantity_total) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    try {
        const adminId = req.user.user_id; // Récupérer l'ID de l'administrateur à partir du token
        await db.query('INSERT INTO offers (offer_name, description, price, quantity_total, admin_id) VALUES ($1, $2, $3, $4, $5)', [offer_name, description, price, quantity_total, adminId]);
        res.status(201).json({ message: 'Offre créée avec succès.' });
    } catch (error) {
        console.error(error); 
        res.status(500).json({ message: 'Erreur lors de la création de l\'offre.' });
    }
});

// Récupérer toutes les offres
router.get('/', async (req, res) => {
    try {
        const offers = await db.query('SELECT * FROM offers');
        res.status(200).json(offers.rows);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des offres.' });
    }
});

// Récupérer une offre spécifique
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const offer = await db.query('SELECT * FROM offers WHERE offer_id = $1', [id]);
        if (offer.rows.length === 0) {
            return res.status(404).json({ message: 'Offre non trouvée.' });
        }
        res.status(200).json(offer.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'offre.' });
    }
});

// Mettre à jour une offre
router.put('/:id', authenticateToken, authenticateAdmin, async (req, res) => {
    const { id } = req.params;
    const { offer_name, description, price, quantity_total } = req.body;

    // Vérifiez que tous les champs sont fournis
    if (!offer_name || !description || !price || quantity_total === undefined) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    try {
        const result = await db.query(
            'UPDATE offers SET offer_name = $1, description = $2, price = $3, quantity_total = $4 WHERE offer_id = $5 RETURNING *',
            [offer_name, description, price, quantity_total, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Offre non trouvée.' });
        }

        res.status(200).json({ message: 'Offre mise à jour avec succès.', offer: result.rows[0] });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'offre :', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'offre.' });
    }
});

// Supprimer une offre
router.delete('/:id', authenticateToken, authenticateAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query('DELETE FROM offers WHERE offer_id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Offre non trouvée.' });
        }
        res.status(200).json({ message: 'Offre supprimée avec succès.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'offre.' });
    }
});

// Route pour mettre à jour la quantité d'offres vendues
router.put('/:offerId/purchase', async (req, res) => {
    const { offerId } = req.params;
    const { quantity } = req.body;

    try {
        // Récupérer l'offre pour vérifier le stock
        const offer = await db.query('SELECT quantity_total FROM offers WHERE offer_id = $1', [offerId]);

        if (offer.rows.length === 0) {
            return res.status(404).json({ message: 'Offre non trouvée.' });
        }

        const availableQuantity = offer.rows[0].quantity_total;

        // Vérifier si le stock est suffisant
        if (availableQuantity < quantity) {
            return res.status(400).json({ message: 'Cette offre n\'est plus disponible.' });
        }

        // Mettre à jour la quantité d'offres vendues et la quantité totale
        await db.query(`
            UPDATE offers 
            SET quantity_sold = quantity_sold + $1, quantity_total = quantity_total - $1
            WHERE offer_id = $2 AND quantity_total >= $1
        `, [quantity, offerId]);

        res.status(200).json({ message: 'Quantité d\'offres mise à jour avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'offre :', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'offre.' });
    }
});

module.exports = router;
