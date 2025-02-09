const mongoose = require('mongoose');
    dotenv = require('dotenv').configure();


const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected`);
    } catch (err) {
        console.error(`Database inactive`);
    }
}

module.exports = connectDB;