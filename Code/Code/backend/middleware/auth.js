const jwt = require('jsonwebtoken');
const User = require('../models/User');

const isAdmin = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(403).json({ error: 'No token provided.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.userId);
        if (!user || !user.isAdmin) return res.status(403).json({ error: 'Access denied.' });
        next();
    } catch (err) {
        res.status(403).json({ error: 'Invalid token.' });
    }
};

module.exports = { isAdmin };