const express = require('express');
const { body } = require('express-validator');
const { registerUser, loginUser } = require('../controller/userController');
const router = express.Router();
const User = require('../models/userModel');
const authMiddleware = require('../middleware/authMiddleware');

router.post(
    '/register',
    [
        body('name', 'Name is required').not().isEmpty(),
        body('email', 'Please include a valid email').isEmail(),
        body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
    ],
    registerUser
);

router.post(
    '/login',
    [
        body('email', 'Please include a valid email').isEmail(),
        body('password', 'Password is required').exists()
    ],
    loginUser
);

router.get('/auth/check', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password'); // Use _id
        res.json({ user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
