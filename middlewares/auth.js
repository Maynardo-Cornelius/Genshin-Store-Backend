const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({message : 'No token provided'});

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        res.status(401).json({message : 'Invalid token'});
    }
};

const authorizeAdmin = (req, res, next) => {
    if(req.user.role !== 'admin') return res.status(403).json({message: 'Admin only'});
    next();
};

const authorizePlayer = (req, res, next) => {
    if(req.user.role !== 'player') return res.status(403).json({message: 'Admin only'});
    next();
};

module.exports = {authenticate, authorizeAdmin, authorizePlayer};