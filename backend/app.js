const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
require('dotenv').config();

const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');

const connectionString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@so-pekocko.grpcp.mongodb.net/so-pekocko?retryWrites=true&w=majority`;
mongoose.connect(connectionString,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à la base de données réussie.'))
    .catch(() => console.log('La connexion à la base de données a échoué.'));

const app = express();

app.use('/images/', express.static(path.join(__dirname, 'images')));

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api/auth/', userRoutes);
app.use('/api/sauces/', saucesRoutes);


module.exports = app;