const express = require("express");
const dotenv = require("dotenv");
const connectToDB = require('./database/db');
const path = require("path");
const userRoutes = require('./routes/userRoutes');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const requestIp = require('request-ip');

// creating an express app
const app = express();
// configure dotenv to use .env
dotenv.config();

// connecting to db
connectToDB();

// Middleware to secure HTTP headers
app.use(helmet());

// Middleware to sanitize user input
app.use(xss());

// Middleware to limit repeated requests to public APIs
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Middleware to sanitize data
app.use(mongoSanitize());

// Middleware to get client IP
app.use(requestIp.mw());

// accept json data
app.use(express.json());
// accept form data
app.use(express.urlencoded({ extended: true }));

// Upload file routes
app.use(
    "/uploads",
    express.static(path.join(__dirname, "/uploads"))
);

// app.use('/api/files', fileRoutes); // Use file routes
app.use('/api/users', userRoutes); // Use user routes

// Defining port
const PORT = process.env.PORT || 5000;
// running the server on port 5000
app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});
