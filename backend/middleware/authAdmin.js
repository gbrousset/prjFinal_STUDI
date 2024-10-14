// middleware.js

// Middleware pour vérifier le rôle admin
function adminMiddleware(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        return next(); // Si l'utilisateur est authentifié et est admin, continuer
    } else {
        return res.status(403).json({ message: 'Accès interdit.' }); // Répondre avec 403 Forbidden si ce n'est pas un admin
    }
}
  
module.exports = adminMiddleware;
