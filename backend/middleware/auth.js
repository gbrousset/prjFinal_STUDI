const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    // Récupérer le token dans les cookies ou dans les headers
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
    if (!token) {
        // Renvoie un statut 401 avec un message JSON
        return res.status(401).json({ message: 'Token non fourni ou invalide' });
    }

    // Vérification du token JWT
    jwt.verify(token, 'votre_clé_secrète', (err, user) => {
        if (err) {
            // Si le token est invalide, renvoyer une réponse 401 avec un message
            return res.status(401).json({ message: 'Token non fourni ou invalide' });
        }
        // Assigner l'utilisateur à la requête
        req.user = user;
        next(); // Passer à la route suivante
    });
};

module.exports = authenticateToken;
