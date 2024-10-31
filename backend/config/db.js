const { Pool } = require('pg');

// Créer une instance du pool de connexions
const pool = new Pool({
    user: 'billeterie_jo_db_user', // Nom d'utilisateur de la base de données
    host: 'dpg-cshk9jo8fa8c739f2r0g-a.frankfurt-postgres.render.com', // L'hôte de la base de données
    database: 'billeterie_jo_db', // Nom de la base de données
    password: 'e4Nqx4gTGEbPsAojRT5HDMkjTn7eimkR', // Mot de passe de la base de données
    port: 5432, // Le port par défaut de PostgreSQL
});

// Exporter le pool pour l'utiliser dans d'autres fichiers
module.exports = pool;

