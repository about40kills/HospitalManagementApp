const express = require('express');
app(express()),
PORT = process.env.PORT || 3000,
connectDB = require('./utils/db'),
cors = require('cors'),
dotenv = require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();



// Routes
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the Hospital API"
    })
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})