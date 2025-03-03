const express = require('express');
const { sequelize, connectDB } = require('./src/config/db');
const errorHandler = require('./src/middleware/errorHandler');

//define a port
PORT = process.env.PORT || 3000,

cors = require('cors'),
dotenv = require('dotenv').config();

//initialize express
const app = express();

app.set('view engine', 'ejs')
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Connect to sequelize
connectDB();

//middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    return res.send("Welcome to the Hospital API");
});
app.use(`/api/users`,require('./src/routes/userRoutes'));
app.use(errorHandler);

app.listen(PORT, async() => {
    await sequelize.sync({ alter: true });
    console.log(`Server running on port ${PORT}`);
})