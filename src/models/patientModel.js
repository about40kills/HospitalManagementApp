const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const express = require('express');

// Define the Patient model
const Patient = sequelize.define(`Patient`, {
    // Model attributes are defined here
    patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    gender: {
        type: DataTypes.ENUM(`Male`, `Female`, `Other`),
        allowNull: false,
    },
    contactNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    addess: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    medicalHistory: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    allergies: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {timestamps: true});

module.exports = Patient;