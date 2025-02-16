const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const { Patient } = require('./patientModel');

const LabReport = sequelize.define(`LabReport`, {
    // Model attributes are defined here
    patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        ref: {
            model: Patient,
            key: `patientId`
        }
    },
    reportType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    results: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM(`Pending`, `Completed`, `Reviewed`),
        defaultValue: `Pending`,
        allowNull: false,
    }
}, {timestamps: true});


LabReport.belongsTo(Patient, { foreignKey: 'patientId', onDelete: 'CASCADE' });

module.exports = LabReport;