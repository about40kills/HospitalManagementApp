const { DataTypes } = require(`sequelize`);
const { sequelize } = require(`../config/db`);

// Define the Inventory model
const Inventory = sequelize.define(`Inventory`, {
    // Model attributes are defined here
    itemName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    itemDescription: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    itemPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    itemQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        min: 0, // Quantity cannot be negative
    },
    supplier: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('in-stock', 'low-stock', 'out-of-stock'),
        defaultValue: 'in-stock'
    }
}, {timestamps: true});

model.exports = {Inventory};
