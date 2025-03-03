const { DataTypes } = require("sequelize")
const { sequelize } = require("../config/db")
const  Patient  = require("./patientModel")
const  User  = require("./userModel")

// Define the model
const Appointment = sequelize.define(`Appointment`, {
    patientId: {
        type: DataTypes.INTEGER,
        references: {
            model: Patient,
            key: `id`
        }
    },
    doctotId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: `id`
        }
    },
    appointmentDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    appointmentTime: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM(`Scheduled`, `Completed`, `Cancelled`),
        defaultValue: `Scheduled`,
        allowNull: false,
    }

}, {timestamps: true});
//`Appointment` model associations
Appointment.belongsTo(Patient, { foreignKey: 'patientId', onDelete: 'CASCADE' });
Appointment.belongsTo(User, { foreignKey: 'doctorId', onDelete: 'CASCADE' });

module.exports = Appointment;