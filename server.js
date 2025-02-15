const express = require('express');
const { sequelize, connectDB } = require('./src/config/db');

//define a port
PORT = process.env.PORT || 3000,

cors = require('cors'),
dotenv = require('dotenv').config();

//initialize express
const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to sequelize
connectDB();

//middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the Hospital API"
    })
})

app.listen(PORT, async() => {
    await sequelize.sync({ force: true });
    console.log(`Server running on port ${PORT}`);
})