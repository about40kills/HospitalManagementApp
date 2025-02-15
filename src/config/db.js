const {Sequelize} = require('sequelize');
    dotenv = require('dotenv').config();

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: `${process.env.DB_PATH}`,
    logging: false
})

const connectDB = async () => {
    // Test connection
    try { 
        await sequelize.authenticate();
        console.log(`SQLITE Connected`);
    } catch (err) {
        console.error(`Database inactive`);
    }
}

module.exports = {sequelize, connectDB};