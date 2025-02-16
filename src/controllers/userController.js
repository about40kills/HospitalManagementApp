//Authentication
const asyncHandler = require("express-async-handler");
const bcrypt = require(`bcrypt`);
const jwt = require(`jsonwebtoken`);
const User = require("../models/userModel");
//Register a user
//routes POST /api/users/register
//api public access
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password,role } = req.body;
    if(!username || !email || !password || !role) {
        res.status(400).json({message: `All fields are mandatory!`});
        throw new Error(`All fields are mandatory!`);
    }

     // Validate role
     const validRoles = ['admin', 'doctor', 'staff', 'patient'];
     if (!validRoles.includes(role)) {
         res.status(400);
         throw new Error("Invalid role specified");
     }

      // Custom validation for username length
      if (!username || username.length < 3 || username.length > 30) {
        res.status(400);
        throw new Error("Username must be between 3 and 30 characters");
    }

    // Custom email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Standard regex for email
    if (!email || !emailRegex.test(email)) {
        res.status(400);
        throw new Error("Email is not valid");
    }

    // Password validation
    if (!password || password.length < 8) {
        res.status(400).json({message: `Password must be at least 8 characters long`});
        throw new Error("Password must be at least 8 characters long");
    }

    //check if user already exists
    const userAvailable = await User.findOne({email});
    if(userAvailable) {
        res.status(400).json({message: `User already exists`});
        throw new Error(`User already exists`)
    }

    //hashing passwords with bcrypt library
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(`Hashed password: `, hashedPassword);
    //create new user
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
        role
    });
    if(user){
        res.status(201).json({_id: user.id, username:user.username, email: user.email, role: user.role});
    }else {
        res.status(400).json({message:`User data is invalid`});
        throw new Error(`User data is not valid`)
    }
    res.json({message: 'Register the user'});
});

//Login a user
//routes POST /api/users/login
//api public access
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        res.status(400).json({message: `All fields are mandatory!`});
        throw new Error(`All fields are mandatory!`);
    }
    //check for a user
    const user = await User.findOne({email});
    //compare password with hashed password
    if( user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id,
                role: user.role
            },
        }, 
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "20m"}
    );
        res.status(200).json({accessToken});
    } else {
        res.status(401).json({message: `Email or password is not valid`});
        throw new Error(`Email or password is not valid`);
    }
});

//Current user info
//routes GET /api/users/current
//api private access
const currentUser = asyncHandler(async (req, res) => {
    res.json({message: 'Current user information'})
});

module.exports = {registerUser, loginUser, currentUser}