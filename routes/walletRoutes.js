const router = require('express').Router();
const { getWallet, topUp } = require('../controllers/walletController');
const { authenticate, authorizePlayer } = require('../middlewares/auth');

router.get('/', authenticate, authorizePlayer, getWallet);
router.post('/topup', authenticate, authorizePlayer, topUp);

module.exports = router;