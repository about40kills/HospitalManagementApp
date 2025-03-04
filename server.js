const express = require('express');
const bodyParser = require("body-parser")
const { sequelize, connectDB } = require('./src/config/db');
const errorHandler = require('./src/middleware/errorHandler');

//define a port
PORT = process.env.PORT || 3000
const cors = require('cors')
dotenv = require('dotenv').config();

//initialize express
const app = express();

// app.use("/ipfs", require("./src/routes/ipfs"))
app.set('view engine', 'ejs')
app.use(cors());
app.use(express.urlencoded({ extended: true }));


// Connect to sequelize
connectDB().catch(err => {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
});

//middleware
app.use(express.json());
app.use(bodyParser.json())
// Routes
app.get("/", (req, res) => {
    return res.send("Welcome to the Hospital API");
});
app.use(`/api/users`,require('./src/routes/userRoutes'));
app.use(`/api/patients`,require('./src/routes/patientRoutes'));
app.use(`/api/labreports`,require('./src/routes/labReportRoutes'));
app.use(`/api/appointments`,require('./src/routes/appointmentRoutes'));
app.use(`/api/inventory`,require('./src/routes/inventoryRoutes'));
app.use(errorHandler);

app.listen(PORT, async() => {
    console.log(`Server running on port ${PORT}`);
})