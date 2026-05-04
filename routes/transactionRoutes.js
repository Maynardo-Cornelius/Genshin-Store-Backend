const router = require('express').Router();
const ctrl = require('../controllers/transactionController');
const { authenticate, authorizePlayer, authorizeAdmin } = require('../middlewares/auth');

router.post('/buy', authenticate, authorizePlayer, ctrl.buyWeapon);
router.get('/logs', authenticate, authorizeAdmin, ctrl.getTransactionLogs);

module.exports = router;