const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User, Wallet } = require('../models');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Lihat isi profile dari Google
      console.log('=== GOOGLE PROFILE ===');
      console.log(JSON.stringify(profile, null, 2));
      console.log('======================');

      const email = profile.emails?.[0]?.value || profile._json?.email;
      const username = profile.displayName || profile._json?.name;

      console.log('Email:', email);
      console.log('Username:', username);

      if (!email) return done(new Error('No email from Google'), null);

      let user = await User.findOne({ where: { email } });

      if (!user) {
        user = await User.create({
          username,
          email,
          password: 'OAUTH_USER',
          role: 'player',
        });
        await Wallet.create({ user_id: user.user_id, balance: 0 });
      }

      return done(null, user);
    } catch (err) {
      console.log('Error:', err.message);
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => done(null, user.user_id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findByPk(id);
  done(null, user);
});

module.exports = passport;