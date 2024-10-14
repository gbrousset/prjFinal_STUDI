// server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors'); 
const authRoutes = require('./routes/auth'); 
const offersRoutes = require('./routes/offers'); 
const ticketsRoutes = require('./routes/tickets'); 
const paymentsRoutes = require('./routes/payments');

const app = express(); 
const cookieParser = require('cookie-parser');
const port = 3001;

const corsOptions = {
    origin: 'http://localhost:3000', 
    credentials: true, 
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json()); 
app.use(cookieParser());

// Utiliser les routes
app.use('/api', authRoutes); 
app.use('/api/offers', offersRoutes);
app.use('/api/tickets', ticketsRoutes);
app.use('/api/payments', paymentsRoutes);

module.exports = app;

const PORT = process.env.PORT || 3001;
if (require.main === module) { 
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
