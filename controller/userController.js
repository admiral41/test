const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/userModel');
const xss = require('xss');
const axios = require('axios');
const requestIp = require('request-ip');

// Function to get geolocation from IP
const getGeolocation = async (ip) => {
    try {
        const response = await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.ABSTRACT_API_KEY}&ip=${ip}`);
        return {
            city: response.data.city,
            country: response.data.country_name,
            latitude: response.data.latitude,
            longitude: response.data.longitude
        };
    } catch (error) {
        console.error("Error fetching geolocation:", error);
        return { city: "unknown", country: "unknown", latitude: null, longitude: null };
    }
};

// Function to get the real IP address
const getRealIp = (req) => {
    let ip = requestIp.getClientIp(req);
    if (req.headers['x-forwarded-for']) {
        ip = req.headers['x-forwarded-for'].split(',')[0];
    }
    if (ip === '::1' || ip === '127.0.0.1') {
        // Replace with your actual IP for testing purposes
        ip = '27.34.90.106';
    }
    return ip;
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
            _id: user.id // Changed to _id
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
        const ip = getRealIp(req);
        const location = await getGeolocation(ip);

        if (!user) {
            return res.status(400).json({ msg: 'Email does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            user.logs.push({
                action: 'Failed login attempt',
                ip,
                location: `${location.city}, ${location.country}`,
                latitude: location.latitude,
                longitude: location.longitude
            });
            await user.save();

            return res.status(400).json({ msg: 'Invalid password' });
        }

        const payload = {
            _id: user.id // Changed to _id
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
                    location: `${location.city}, ${location.country}`,
                    latitude: location.latitude,
                    longitude: location.longitude
                });
                await user.save();

                res.json({
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
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
