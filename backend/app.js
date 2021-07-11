const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/user');

const connectionString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@so-pekocko.grpcp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
mongoose.connect(connectionString,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à la base de données réussie.'))
    .catch(() => console.log('La connexion à la base de données a échoué.'));

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth/', userRoutes);


module.exports = app;