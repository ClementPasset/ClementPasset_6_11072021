const Sauce = require('../models/Sauce');
const fs = require('fs');

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
    const sauce = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauce, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(500).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(500).json({ error }));
};

exports.likeSauce = (req, res, next) => {
    const like = req.body.like;
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            let { likes, dislikes, usersLiked, usersDisliked } = sauce;

            if (like === 1) {
                likes += 1;
                usersLiked.push(req.body.userId);
            } else if (like === -1) {
                dislikes += 1;
                usersDisliked.push(req.body.userId);
            } else {
                let position = usersLiked.findIndex(elt => elt === req.body.userId);
                if (position !== -1) {
                    usersLiked.splice(position, 1);
                    likes -= 1;
                }

                position = usersDisliked.findIndex(elt => elt === req.body.userId);
                if (position !== -1) {
                    usersDisliked.splice(position, 1);
                    dislikes -= 1;
                }

            }

            const newSauce = {
                ...sauce._doc,
                likes,
                dislikes,
                usersLiked,
                usersDisliked,
            };

            Sauce.updateOne({ _id: newSauce._id }, { ...newSauce, _id: newSauce._id })
                .then(() => {
                    res.status(201).json({ message: "Like modifié." });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(400).json({ error }));
};