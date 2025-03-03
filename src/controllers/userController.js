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
        return res.status(400).json({message: `All fields are mandatory!`});
    }

     // Validate role
     const validRoles = ['admin', 'doctor', 'staff', 'patient'];
     if (!validRoles.includes(role)) {
         return res.status(400).json({message: `Invalid role specified`});
     }

      // Custom validation for username length
      if (!username || username.length < 3 || username.length > 30) {
        return res.status(400).json({message: `Username must be between 3 and 30 characters`});
    }

    // Custom email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Standard regex for email
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({message: `Email is not valid`});
    }

    // Password validation
    if (!password || password.length < 8) {
        return res.status(400).json({message: `Password must be at least 8 characters long`});
    }

    //check if user already exists
    const userAvailable = await User.findOne({ where: { email } });
    if(userAvailable) {
        return res.status(400).json({message: `User already exists`});
    }

    //hashing passwords with bcrypt library
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(`Hashed password: `, hashedPassword);
    
    //create new user
    try{
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role,
        });
            return res.status(201).json({_id: user.id, username:user.username, email: user.email, role: user.role});
    } catch (error) {
        return res.status(400).json({message:`User data is invalid`});
    }
});

//Login a user
//routes POST /api/users/login
//api public access
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).json({message: `All fields are mandatory!`});
    }
    //check for a user
    const user = await User.findOne({ where: { email } });
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
        return res.status(401).json({message: `Email or password is not valid`});
    }
});

//Get current user
//routes GET /api/users/:id
// api private access
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json(user);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
};

//Update user role
//routes PUT /api/users/:id/role
//api private access
const updateUserRole = async (req, res) => {
    try {
        const { userId, newRole } = req.body;
        
        // Verify admin role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = newRole;
        await user.save();// Save the updated user

        return res.json({ message: 'Role updated successfully', user });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating role', error: error.message });
    }
};


module.exports = {registerUser, loginUser, getUserProfile, updateUserRole};