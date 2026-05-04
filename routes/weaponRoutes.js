const router = require('express').Router();
const ctrl = require('../controllers/weaponController');
const { authenticate, authorizeAdmin } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.get('/', authenticate, ctrl.getAllWeapons);
router.get('/:id', authenticate, ctrl.getWeaponById);
router.post('/', authenticate, authorizeAdmin, upload.single('image'), ctrl.createWeapon);
router.put('/:id', authenticate, authorizeAdmin, upload.single('image'), ctrl.updateWeapon);
router.delete('/:id', authenticate, authorizeAdmin, ctrl.deleteWeapon);

module.exports = router;