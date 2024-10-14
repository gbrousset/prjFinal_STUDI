const request = require('supertest');
const app = require('../server'); // Importer l'application depuis le serveur
const db = require('../config/db'); // Importer la configuration de la base de données

// Fonction de tests pour les utilisateurs
const userTests = () => {
    describe('Tests Utilisateurs', () => {
        const newUser = {
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
            phone: '1234567890',
        };

        const existingUser = {
            username: 'loginuser',
            email: 'loginuser@example.com',
            password: 'password123',
            phone: '1234567890',
        };

        let token;

        beforeAll(async () => {
            await request(app).post('/api/register').send(existingUser);
        });

        // Tests pour l'inscription
        describe('POST /api/register', () => {
            test('Devrait inscrire un nouvel utilisateur', async () => {
                const response = await request(app).post('/api/register').send(newUser);
                expect(response.status).toBe(201);
                expect(response.body.message).toBe('Utilisateur créé avec succès.');
                expect(response.body).toHaveProperty('auth_key'); // Vérifier que l'auth_key est renvoyé

                // Vérifier que l'utilisateur a été ajouté à la base de données
                const userInDb = await db.query('SELECT * FROM users WHERE email = $1', [newUser.email]);
                expect(userInDb.rows.length).toBe(1);
                expect(userInDb.rows[0].username).toBe(newUser.username);
            });

            test('Devrait renvoyer 400 si des champs requis sont manquants', async () => {
                const response = await request(app).post('/api/register').send({});
                expect(response.status).toBe(400);
                expect(response.body.message).toBe('Tous les champs sont requis.');
            });

            test('Devrait renvoyer 400 si l\'email est déjà utilisé', async () => {
                await request(app).post('/api/register').send(existingUser); // Créer un utilisateur

                const response = await request(app).post('/api/register').send(existingUser); // Réessayer avec le même email
                expect(response.status).toBe(400);
                expect(response.body.message).toBe('Cet email est déjà utilisé.');
            });
        });

        // Tests pour la connexion
        describe('POST /api/login', () => {
            test('Devrait se connecter avec des identifiants valides', async () => {
                const response = await request(app).post('/api/login').send({
                    email: existingUser.email,
                    password: existingUser.password,
                    phone: existingUser.phone,
                });

                expect(response.status).toBe(200);
                expect(response.body.message).toBe('Connexion réussie !');
                expect(response.body).toHaveProperty('token'); // Vérifier que le token est renvoyé
                token = response.body.token; // Stocker le token pour les tests suivants
            });

            test('Devrait renvoyer 401 pour des identifiants invalides', async () => {
                const response = await request(app).post('/api/login').send({
                    email: existingUser.email,
                    password: 'wrongpassword', // Mauvais mot de passe
                    phone: existingUser.phone,
                });

                expect(response.status).toBe(401);
                expect(response.body.message).toBe('Identifiants invalides');
            });

            test('Devrait renvoyer 401 pour un utilisateur inexistant', async () => {
                const response = await request(app).post('/api/login').send({
                    email: 'nonexisting@example.com',
                    password: 'password123',
                    phone: '1234567890',
                });

                expect(response.status).toBe(401);
                expect(response.body.message).toBe('Identifiants invalides');
            });
        });

        // Tests pour le profil
        describe('GET /api/profile', () => {
            test('Devrait renvoyer le profil de l\'utilisateur authentifié', async () => {
                const response = await request(app)
                    .get('/api/profile')
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('email', existingUser.email);
            });

            test('Devrait renvoyer 401 pour un utilisateur non authentifié', async () => {
                // Ne pas envoyer de token (utilisateur non authentifié)
                const response = await request(app).get('/api/profile');

                // Vérifier le statut 401 et le message attendu
                expect(response.status).toBe(401);
                expect(response.body).toEqual({ message: 'Token non fourni ou invalide' });
            });
        });

        // Tests pour la réinitialisation du mot de passe
        describe('POST /api/reset-password', () => {
            test('Devrait réinitialiser le mot de passe avec des données valides', async () => {
                const response = await request(app)
                    .post('/api/reset-password')
                    .send({ email: existingUser.email, phone: existingUser.phone, newPassword: 'newpassword123' });

                expect(response.status).toBe(200);
                expect(response.body.message).toBe('Mot de passe réinitialisé avec succès.');
            });

            test('Devrait renvoyer 404 pour un utilisateur inexistant lors de la réinitialisation du mot de passe', async () => {
                const response = await request(app)
                    .post('/api/reset-password')
                    .send({ email: 'nonexistent@example.com', phone: '0000000000', newPassword: 'newpassword123' });

                expect(response.status).toBe(404);
                expect(response.body.message).toBe('Utilisateur non trouvé.');
            });

            test('Devrait renvoyer 400 pour des champs manquants lors de la réinitialisation du mot de passe', async () => {
                const response = await request(app)
                    .post('/api/reset-password')
                    .send({ email: '', phone: '', newPassword: '' });

                expect(response.status).toBe(400);
                expect(response.body.message).toBe('Email, numéro de téléphone et nouveau mot de passe sont requis.');
            });
        });

        // Tests pour la déconnexion
        describe('POST /api/logout', () => {
            test('Devrait déconnecter l\'utilisateur', async () => {
                const response = await request(app).post('/api/logout');
                expect(response.status).toBe(200);
                expect(response.body.message).toBe('Déconnexion réussie');
            });
        });

        // Nettoyage final
        afterAll(async () => {
            // Suppression des utilisateurs de test
            await db.query('DELETE FROM users WHERE email = $1', [existingUser.email]);
            await db.query('DELETE FROM users WHERE email = $1', [newUser.email]);
        });
    });
};

// Exécuter les tests d'utilisateurs et d'administrateurs
describe('Tests API', () => {
    userTests();
});
