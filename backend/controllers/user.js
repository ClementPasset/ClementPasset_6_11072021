const User = require('../models/User');
const bcrypt = require('bcrypt');
const crypto = require('crypto-js');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.signup = (req, res, next) => {
    let key = crypto.enc.Hex.parse(process.env.MAIL_ENCRYPTION_KEY);
    let iv = crypto.enc.Hex.parse(process.env.MAIL_ENCRYPTION_IV);

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: crypto.AES.encrypt(req.body.email, key, { iv: iv }).toString(),
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé' }))
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    let key = crypto.enc.Hex.parse(process.env.MAIL_ENCRYPTION_KEY);
    let iv = crypto.enc.Hex.parse(process.env.MAIL_ENCRYPTION_IV);
    let mail = crypto.AES.encrypt(req.body.email, key, { iv: iv }).toString();

    User.findOne({ email: mail })
        .then(user => {
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: "Erreur d'authentification." });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.JWT_KEY,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(401).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
}