const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'billeterie_jo_db',
    password: 'azertlove',
    port: 5432,
});

async function createOffers() {
    const offers = [
        {
            offer_name: 'Solo',
            description: 'Offre solo, idéale pour une personne.',
            price: 29.99,
            quantity_total: 100
        },
        {
            offer_name: 'Duo',
            description: 'Offre duo, pour deux personnes.',
            price: 49.99,
            quantity_total: 50
        },
        {
            offer_name: 'Familiale',
            description: 'Offre familiale, pour toute la famille.',
            price: 99.99,
            quantity_total: 30
        }
    ];
    
    try {
        // Se connecter à la base de données
        await pool.connect();

        // Insérer chaque offre dans la base de données
        for (const offer of offers) {
            await pool.query(
                'INSERT INTO offers (offer_name, description, price, quantity_total) VALUES ($1, $2, $3, $4)', 
                [offer.offer_name, offer.description, offer.price, offer.quantity_total]
            );
        }
        console.log('Offres créées avec succès !');
    } catch (error) {
        console.error('Erreur lors de la création des offres:', error);
    } finally {
        // Toujours se déconnecter du client
        await pool.end();
    }
}

createOffers();
