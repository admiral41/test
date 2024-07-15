const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/userModel');
const xss = require('xss');
const axios = require('axios');
const requestIp = require('request-ip');

// Function to get geolocation from IP
const getGeolocation = async (ip) => {
    try {
        const response = await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.ABSTRACT_API_KEY}&ip=${ip}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching geolocation:", error);
        return { city: "unknown", region: "unknown", country: "unknown" };
    }
};

// Register user
exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(12); // Use 12 salt rounds
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name: xss(name),
            email: xss(email),
            password: hashedPassword
        });

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Login user
exports.loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        const ip = requestIp.getClientIp(req);
        const location = await getGeolocation(ip);

        if (!user) {
            // Log failed login attempt
            const tempUser = new User({ email: xss(email) });
            tempUser.logs.push({
                action: 'Failed login attempt',
                ip,
                location: `${location.city}, ${location.region}, ${location.country}`
            });
            await tempUser.save();

            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // Log failed login attempt
            user.logs.push({
                action: 'Failed login attempt',
                ip,
                location: `${location.city}, ${location.region}, ${location.country}`
            });
            await user.save();

            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            async (err, token) => {
                if (err) throw err;

                user.logs.push({
                    action: 'User logged in',
                    ip,
                    location: `${location.city}, ${location.region}, ${location.country}`
                });
                await user.save();

                res.json({
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        password: user.password,
                        logs: user.logs
                    }
                });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
