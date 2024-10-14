const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

// Configuration de la connexion à PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'billeterie_jo_db',
    password: 'azertlove',
    port: 5432,
});

const saltRounds = 10; // Nombre de rounds pour le hachage de bcrypt

// Fonction pour créer un administrateur
async function createAdmin(username, email, phone, password) {
  try {
    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Clé d'authentification générée (peut être une valeur aléatoire)
    const authKey = generateAuthKey();

    // Connexion à la base de données
    const client = await pool.connect();

    // Insertion de l'administrateur dans la table Users
    const insertQuery = `
      INSERT INTO users (username, email, phone, password_hash, auth_key, is_2fa_enabled, role) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    
    const values = [
      username,
      email,
      phone, 
      hashedPassword,
      authKey,
      false,  // is_2fa_enabled, ici désactivé par défaut
      'admin' // Rôle d'administrateur
    ];

    const result = await client.query(insertQuery, values);

    console.log('Administrateur créé avec succès :', result.rows[0]);

    // Libération du client
    client.release();
  } catch (error) {
    console.error('Erreur lors de la création de l\'administrateur :', error);
  } finally {
    // Fermer la connexion au pool de base de données
    await pool.end();
  }
}

// Fonction pour générer une clé d'authentification
function generateAuthKey() {
  return Math.random().toString(36).substr(2); // Simple clé aléatoire
}

// Exécuter la fonction pour créer un administrateur (changez les valeurs par celles souhaitées)
createAdmin('admin_user', 'admin@example.com', '0600000000', 'adminpassword');