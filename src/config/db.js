const {Sequelize} = require('sequelize');
    dotenv = require('dotenv').config();
    const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.resolve(__dirname, "database.sqlite"),
    logging: false
})

//import models


const connectDB = async () => {
    // Test connection
    try { 
        await sequelize.authenticate();
        console.log(`SQLITE Connected`);
         //sync the database
         await sequelize.sync({ alter: true });
         console.log(`Database sync complete`);
    } catch (err) {
        console.error(`Database inactive`, err);
        process.exit(1);
    }
}

module.exports = {sequelize, connectDB};