const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const sauceCtrl = require('../controllers/sauces');

router.get('/:id', sauceCtrl.getOneSauce);
router.put('/:id', sauceCtrl.updateSauce);
router.delete('/:id', sauceCtrl.deleteSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/', auth, sauceCtrl.addSauce);


module.exports = router;