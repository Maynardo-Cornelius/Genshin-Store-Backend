const router = require('express').Router();
const { getInventory } = require('../controllers/inventoryController');
const { authenticate, authorizePlayer } = require('../middlewares/auth');
router.get('/', authenticate, authorizePlayer, getInventory);
module.exports = router;