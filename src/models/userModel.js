const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Define the User model 
const User = sequelize.define('User', {
    // Model attributes are defined here
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('admin', 'doctor', 'staff', 'patient'),
        defaultValue: 'patient'
    }
}, {
    timestamps: true
});

module.exports = User;