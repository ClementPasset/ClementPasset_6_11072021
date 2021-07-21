const Sauce = require('../models/Sauce');

exports.addSauce = (req, res, next) => {
    const sauce = new Sauce({
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce créée !' }))
        .catch(error => res.status(500).json({ error }));
};

exports.updateSauce = (req, res, next) => {

};

exports.deleteSauce = (req, res, next) => {

};

exports.getOneSauce = (req, res, next) => {

};

exports.getAllSauces = (req, res, next) => {

};