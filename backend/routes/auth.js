const express = require('express');
const bcrypt = require('bcryptjs'); // Pour hacher les mots de passe
const db = require('../config/db'); // Connexion à la base de données
const jwt = require('jsonwebtoken');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const adminMiddleware = require('../middleware/authAdmin'); 
const crypto = require('crypto');

// Route d'inscription
router.post('/register', async (req, res) => {
    const { username, email, password, phone } = req.body;

    if (!username || !email || !password || !phone) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    try {
        // Vérifier si l'email existe déjà
        const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
        }

        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Générer une auth_key unique
        const authKey = crypto.randomBytes(20).toString('hex'); // 40 caractères hexadécimaux

        // Insérer l'utilisateur dans la base de données avec le rôle 'client' par défaut
        await db.query(
            'INSERT INTO users (username, email, password_hash, phone, role, auth_key) VALUES ($1, $2, $3, $4, $5, $6)', 
            [username, email, hashedPassword, phone, 'client', authKey] // Rôle par défaut
        );

        res.status(201).json({ message: 'Utilisateur créé avec succès.', auth_key: authKey });
    } catch (error) {
        console.error('Erreur lors de l\'inscription :', error);
        res.status(500).json({ message: 'Erreur lors de l\'inscription.' });
    }
});

// Route de connexion
router.post('/login', async (req, res) => {
    const { email, password, phone } = req.body;

    try {
        console.log('Tentative de connexion avec :', { email, password, phone });
        
        // Rechercher l'utilisateur par email et téléphone
        const result = await db.query('SELECT * FROM users WHERE email = $1 AND phone = $2', [email, phone]);
        const user = result.rows[0];

        if (!user) {
            console.log('Utilisateur non trouvé');
            return res.status(401).json({ message: 'Identifiants invalides' });
        }

        // Vérifier le mot de passe
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        console.log('Correspondance du mot de passe :', passwordMatch);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Identifiants invalides' });
        }

        // Générer le token JWT
        const token = jwt.sign({ id: user.user_id, role: user.role }, 'votre_clé_secrète', { expiresIn: '1h' });

        // Envoyer le token dans un cookie
        res.cookie('token', token, { httpOnly: true });
        res.json({ message: 'Connexion réussie !', token });
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
});

// Route de profil
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; 

        const user = await db.query('SELECT user_id, username, email, phone, role FROM users WHERE user_id = $1', [userId]);

        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        res.json(user.rows[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur :', error);
        res.status(500).json({ message: 'Erreur du serveur', error: error.message });
    }
});

// Route de déconnexion
router.post('/logout', (req, res) => {
    res.clearCookie('token'); // Supprimer le cookie
    res.status(200).json({ message: 'Déconnexion réussie' });
});

// Route pour le tableau de bord administrateur
router.get('/admin-dashboard', (req, res) => {
    res.send('Bienvenue sur le tableau de bord administrateur !');
});

// Route pour réinitialiser le mot de passe
router.post('/reset-password', async (req, res) => {
    const { email, newPassword, phone } = req.body; // Inclure le numéro de téléphone

    if (!email || !newPassword || !phone) { 
        return res.status(400).json({ message: 'Email, numéro de téléphone et nouveau mot de passe sont requis.' });
    }

    try {
        // Vérifier si l'email et le téléphone existent
        const existingUser = await db.query('SELECT * FROM users WHERE email = $1 AND phone = $2', [email, phone]);
        if (existingUser.rows.length === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        // Hachage du nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Mettre à jour le mot de passe dans la base de données
        await db.query('UPDATE users SET password_hash = $1 WHERE email = $2', [hashedPassword, email]);

        res.status(200).json({ message: 'Mot de passe réinitialisé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la réinitialisation du mot de passe :', error);
        res.status(500).json({ message: 'Erreur du serveur.' });
    }
});

module.exports = router;
