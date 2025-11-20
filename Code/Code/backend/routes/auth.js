const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User} = require('../models');

const router = express.Router();

router.post('/register', async (req, res) => {
    try{
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword });
        res.status(201).json(user);
    }catch(err){
        console.log(err);
        res.status(500).send("Something went wrong!")
    }
});

router.post('/login', async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    }catch(err){
        console.log(err);
        res.status(500).send("Something went wrong!")
    }
});

module.exports = router;