const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./config/db');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/event');
const {User} = require("./models");
const jwt = require("jsonwebtoken");

require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// Get User Profile
app.get('api/users/profile', async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const payload = jwt.decode(token);
    const userId = payload.userId; 

    // Find the user
    const user = await User.findByPk(userId, {
        attributes: ['id', 'username', 'email', 'isAdmin'],
    });

    if (!user) {
        return res.status(404).json({ error: "User not found." });
    }

    res.json(user);
});

sequelize.sync().then(() => {
    console.log('Database Connected');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));