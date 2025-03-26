const express = require('express');
const bodyParser = require("body-parser")
const { sequelize, connectDB } = require('./src/config/db');
const errorHandler = require('./src/middleware/errorHandler');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//define a port
PORT = process.env.PORT || 3000
const cors = require('cors')
dotenv = require('dotenv').config();

//initialize express
const app = express();

// app.use("/ipfs", require("./src/routes/ipfs"))
app.set('view engine', 'ejs')
app.use(cors());
app.use(express.urlencoded({ extended: false }));


app.use((req, res, next) => {
    // Initialize empty arrays for errors and success messages
    res.locals.errors = [];
    res.locals.successMessage = '';
    res.locals.formData = {};
    next();
});

// Connect to sequelize
connectDB().catch(err => {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
});

//middleware
app.use(express.json());
app.use(bodyParser.json())


//  Auth Routes
app.get("/", (req, res) => {
    return res.render("login");
});
app.get("/signup", (req, res) => {
    return res.render("signUp");
});

app.get("/api", (req, res) => {
    const User = sequelize.models.User;
    User.findAll().then(users => {
        res.json(users)
    })
})

app.post("/signup", async (req, res) => {
    try {
        // Get form data
        const { username, password, email, role, phone } = req.body;
        
        // Initialize errors array
        const errors = [];
        
        // Validate empty fields
        if (!username) errors.push("Username is required");
        if (!password) errors.push("Password is required");
        if (!email) errors.push("Email is required");
        if (!role) errors.push("Role is required");
        
        // Additional validation
        if (username && username.length < 3) errors.push("Username must be at least 3 characters");
        if (password && password.length < 6) errors.push("Password must be at least 6 characters");
        if (email && !email.includes('@')) errors.push("Please enter a valid email address");
        
        // If there are validation errors
        if (errors.length > 0) {
            console.log("Validation errors:", errors);
            return res.status(400).render("signUp", { 
                errors: errors,
                // Send back the submitted data to preserve form values
                formData: {
                    username: username || '',
                    email: email || '',
                    role: role || ''
                }
            });
        }
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const User = sequelize.models.User;
        // Create a new user in the database
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role,
            phone
        });
        
        console.log("New user created:", newUser);
        
        // Redirect to the login page with a success message
        return res.render("login", { 
            successMessage: "Registration successful! Please login with your new account."
        });
        
    } catch (error) {
        console.error("Error during signup:", error);
        return res.status(500).render("signUp", { 
            errors: ["An unexpected error occurred. Please try again."],
            formData: req.body
        });
    }
});



// Simple login route
app.post("/", async (req, res) => {
    try {
        // Get form data
        const { email, password, role } = req.body;
        
        // Initialize errors array
        const errors = [];
        
        // Validate empty fields
        if (!email) errors.push("Email is required");
        if (!password) errors.push("Password is required");
        if (!role) errors.push("Role is required");
        
        // Additional validation
        if (email && !email.includes('@')) errors.push("Please enter a valid email address");
        if (password && password.length < 6) errors.push("Password must be at least 6 characters");
        
        // If there are validation errors
        if (errors.length > 0) {
            console.log("Validation errors:", errors);
            return res.status(400).render("login", { 
                errors: errors,
                formData: { email: email || '' } // Preserve email input
            });
        }

        
        // Get User model
        const User = sequelize.models.User; 

        
        // Find user by email
        const user = await User.findOne({ where: { email } });
        
        // Check if user exists and password matches
        if (!user ) {
            console.log("Invalid credentials");
            return res.status(400).render("login", { 
                errors: ["Invalid email or password"],
                formData: { email: email || '' } // Preserve email input
            });
        }
        
        // Generate JWT token
        const token = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id,
                role: user.role
            }
        }, process.env.ACCESS_TOKEN_SECRET || 'fallback_secret', { expiresIn: "1h" });
        
        // Store token in cookie
        res.cookie('token', token, { 
            httpOnly: true,
            maxAge: 3600000 // 1 hour
        });
        
        // Redirect based on role
        switch(user.role) {
            case 'admin':
                return res.redirect(`/admin-dashboard`);
            case 'doctor':
                return res.redirect('/doctor-dashboard');
            default:
                return res.redirect('/patient-dashboard');
        }
        
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).render("login", { 
            errors: ["An error occurred during login"],
            formData: req.body
        });
    }
});

app.get("/admin-dashboard", (req, res) => {
    return res.render("admin-dashboard");
});

app.get("/patient-dashboard", (req, res) => {
    return res.render("patient-dashboard");
});
app.get("inventory", (req, res) => {
    return res.render("inventory");
});

app.get("/chats", (req, res) => {
    return res.render("chats");
});
app.get("/book-appointment", (req, res) => {
    return res.render("book-appointment");
});
app.get("/appointments", (req, res) => {
    return res.render("appointments");
});
app.get("/billings", (req, res) => {
    return res.render("billings");
});
app.get("/billing-transactions", (req, res) => {
    return res.render("billing-transactions");
});



app.use(`/api/users`,require('./src/routes/userRoutes'));
app.use(`/api/patients`,require('./src/routes/patientRoutes'));
app.use(`/api/labreports`,require('./src/routes/labReportRoutes'));
app.use(`/api/appointments`,require('./src/routes/appointmentRoutes'));
app.use(`/api/inventory`,require('./src/routes/inventoryRoutes'));
app.use('/api-docs', express.static(path.join(__dirname, 'views')));
app.get("/api/docs", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "api-docs.html"));
  });
app.use(errorHandler);

app.listen(PORT, async() => {
    console.log(`Server running on http://localhost:${PORT}`);
})