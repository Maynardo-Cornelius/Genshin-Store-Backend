const router = require('express').Router();
const passport = require('../config/passport');
const { register, login, googleCallback } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email', 'openid'],  // tambah openid
  })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  googleCallback
);

router.get('/google/failure', (req, res) => {
  res.status(401).json({ message: 'Google OAuth failed' });
});

module.exports = router;