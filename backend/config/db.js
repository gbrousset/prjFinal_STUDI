const { Pool } = require('pg');

// Créer une instance du pool de connexions
const pool = new Pool({
    user: 'postgres', // A remplacer par le nom d'utilisateur de la base de données
    host: 'localhost',     // L'hôte de la base de données
    database: 'billeterie_jo_db', // A Remplacer par le nom de la base de données
    password: 'azertlove', // A Remplacer par le mot de passe de la base de données
    port: 5432,           // Le port par défaut de PostgreSQL
});

// Exporter le pool pour l'utiliser dans d'autres fichiers
module.exports = pool;
