require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const passport = require('./config/passport');
const { sequelize } = require('./models');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/weapons', require('./routes/weaponRoutes'));
app.use('/api/wallet', require('./routes/walletRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));

const PORT = process.env.PORT || 3000;
sequelize.sync({ force: false }).then(() => {
  console.log('Database synced');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});