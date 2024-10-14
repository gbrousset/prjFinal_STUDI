const request = require('supertest');
const app = require('../server'); // Importer l'application depuis le serveur
const db = require('../config/db'); // Importer la configuration de la base de données

// Fonction de tests pour les administrateurs
const adminTests = () => {
    describe('Tests Administrateur', () => {
        const adminUser = {
            email: 'admin@example.com',
            password: 'adminpassword',
            phone: '0600000000'
        };

        let adminToken;

        // Connexion Admin avant les tests
        beforeAll(async () => {
            const response = await request(app).post('/api/login').send({
                email: adminUser.email,
                password: adminUser.password,
                phone: adminUser.phone,
            });
            adminToken = response.body.token;
        });

        // Fonction pour créer une offre avec un `offer_id` spécifique
        const insertOfferWithId = async (offerId) => {
            const newOffer = {
                offer_name: 'Offre Test Spécifique',
                description: 'Description pour suppression',
                price: 99.99,
                quantity_total: 100,
                admin_id: 305 // ID de l'admin
            };

            // Insertion manuelle dans la base de données avec un `offer_id` spécifique
            await db.query(
                `INSERT INTO offers (offer_id, offer_name, description, price, quantity_total, admin_id) 
                VALUES ($1, $2, $3, $4, $5, $6)`,
                [offerId, newOffer.offer_name, newOffer.description, newOffer.price, newOffer.quantity_total, newOffer.admin_id]
            );
        };

        // Tests pour la connexion admin
        describe('POST /api/login', () => {
            test('Devrait se connecter avec des informations valides', async () => {
                const response = await request(app).post('/api/login').send({
                    email: adminUser.email,
                    password: adminUser.password,
                    phone: adminUser.phone,
                });

                expect(response.status).toBe(200);
                expect(response.body.message).toBe('Connexion réussie !');
                expect(response.body).toHaveProperty('token'); // Vérifier que le token est renvoyé
                adminToken = response.body.token; // Stocker le token pour les tests suivants
            });
        });

        // Test pour le tableau de bord admin
        describe('GET /api/admin-dashboard', () => {
            test('Devrait retourner le tableau de bord admin pour un administrateur authentifié', async () => {
                const response = await request(app)
                    .get('/api/admin-dashboard')
                    .set('Authorization', `Bearer ${adminToken}`);

                expect(response.status).toBe(200);
                expect(response.text).toBe('Bienvenue sur le tableau de bord administrateur !');
            });
        });

        // Test pour créer une offre
        describe('POST /api/offers', () => {
            test('Devrait créer une offre avec des données valides', async () => {
                const newOffer = {
                    offer_name: 'Offre Test',
                    description: 'Ceci est une offre de test',
                    price: 100,
                    quantity_total: 50
                };

                const response = await request(app)
                    .post('/api/offers')
                    .set('Authorization', `Bearer ${adminToken}`)
                    .send(newOffer);

                expect(response.status).toBe(201);
                expect(response.body.message).toBe('Offre créée avec succès.');
            });

            test('Devrait renvoyer 400 si des champs obligatoires sont manquants', async () => {
                const invalidOffer = {
                    offer_name: 'Offre Incomplète',
                    price: 100,
                };

                const response = await request(app)
                    .post('/api/offers')
                    .set('Authorization', `Bearer ${adminToken}`)
                    .send(invalidOffer);

                expect(response.status).toBe(400);
                expect(response.body.message).toBe('Tous les champs sont requis.');
            });
        });

        // Test pour récupérer toutes les offres
        describe('GET /api/offers', () => {
            test('Devrait récupérer toutes les offres', async () => {
                const response = await request(app).get('/api/offers');
                expect(response.status).toBe(200);
                expect(Array.isArray(response.body)).toBe(true); // Vérifier que c'est un tableau
            });
        });

        // Test pour récupérer une offre spécifique
        describe('GET /api/offers/:id', () => {
            test('Devrait récupérer une offre spécifique', async () => {
                const offerId = 65; 
                const response = await request(app).get(`/api/offers/${offerId}`);
                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('offer_name');
            });

            test('Devrait renvoyer 404 pour une offre inexistante', async () => {
                const nonExistingId = 9999;
                const response = await request(app).get(`/api/offers/${nonExistingId}`);
                expect(response.status).toBe(404);
                expect(response.body.message).toBe('Offre non trouvée.');
            });
        });

        // Test pour mettre à jour une offre
        describe('PUT /api/offers/:id', () => {
            test('Devrait mettre à jour une offre avec des données valides', async () => {
                const updatedOffer = {
                    offer_name: 'Offre Mise à Jour',
                    description: 'Nouvelle description',
                    price: 150,
                    quantity_total: 30
                };
                const offerId = 67; 

                const response = await request(app)
                    .put(`/api/offers/${offerId}`)
                    .set('Authorization', `Bearer ${adminToken}`)
                    .send(updatedOffer);

                expect(response.status).toBe(200);
                expect(response.body.message).toBe('Offre mise à jour avec succès.');
            });

            test('Devrait renvoyer 404 pour une offre inexistante', async () => {
                const nonExistingId = 9999;
                const updatedOffer = {
                    offer_name: 'Offre Inexistante',
                    description: 'Ne sera jamais mise à jour',
                    price: 150,
                    quantity_total: 30
                };

                const response = await request(app)
                    .put(`/api/offers/${nonExistingId}`)
                    .set('Authorization', `Bearer ${adminToken}`)
                    .send(updatedOffer);

                expect(response.status).toBe(404);
                expect(response.body.message).toBe('Offre non trouvée.');
            });
        });

        // Test pour supprimer une offre avec un ID spécifique
        describe('DELETE /api/offers/:id', () => {
            const offerId = 1000;

            // Avant le test, créer une offre avec l'ID spécifique
            beforeAll(async () => {
                await insertOfferWithId(offerId);
            });

            test('Devrait supprimer une offre', async () => {
                const response = await request(app)
                    .delete(`/api/offers/${offerId}`)
                    .set('Authorization', `Bearer ${adminToken}`);

                expect(response.status).toBe(200);
                expect(response.body.message).toBe('Offre supprimée avec succès.');
            });

            test('Devrait renvoyer 404 pour une offre inexistante après suppression', async () => {
                const response = await request(app)
                    .delete(`/api/offers/${offerId}`)
                    .set('Authorization', `Bearer ${adminToken}`);

                expect(response.status).toBe(404);
                expect(response.body.message).toBe('Offre non trouvée.');
            });
        });

        // Test pour mettre à jour la quantité d'offres vendues
        describe('PUT /api/offers/:offerId/purchase', () => {
            test('Devrait mettre à jour les quantités d\'offres après un achat', async () => {
                const offerId = 65; 
                const purchaseQuantity = 5;

                const response = await request(app)
                    .put(`/api/offers/${offerId}/purchase`)
                    .send({ quantity: purchaseQuantity });

                expect(response.status).toBe(200);
                expect(response.body.message).toBe('Quantité d\'offres mise à jour avec succès.');
            });

            test('Devrait renvoyer 404 si l\'offre n\'existe pas', async () => {
                const nonExistingId = 9999;
                const purchaseQuantity = 5;

                const response = await request(app)
                    .put(`/api/offers/${nonExistingId}/purchase`)
                    .send({ quantity: purchaseQuantity });

                expect(response.status).toBe(404);
                expect(response.body.message).toBe('Offre non trouvée.');
            });

            test('Devrait renvoyer 400 si la quantité est insuffisante', async () => {
                const offerId = 65; 
                const purchaseQuantity = 9999; // Quantité trop grande

                const response = await request(app)
                    .put(`/api/offers/${offerId}/purchase`)
                    .send({ quantity: purchaseQuantity });

                expect(response.status).toBe(400);
                expect(response.body.message).toBe('Cette offre n\'est plus disponible.');
            });
        });
    });
};

// Exécuter les tests d'administrateur
describe('Tests API', () => {
    adminTests();
});
