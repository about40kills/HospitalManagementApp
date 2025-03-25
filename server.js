require("dotenv").config()
const express = require("express")
const sanitizeHtml = require('sanitize-html')
const app = express()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const port = 3000
const host = 'localhost'

// Setup Database here

const db = require("better-sqlite3")("DBmodel.db")
db.pragma("journal_mode = WAL")

const createtable = db.transaction(() => {
    db.prepare(
        `
        CREATE TABLE IF NOT EXISTS patient(
            patient_id INTEGER PRIMARY KEY AUTOINCREMENT,
            fname STRING NOT NULL UNIQUE,
            lname STRING NOT NULL UNIQUE,
            username STRING NOT NULL UNIQUE,
            password String NOT Null,
            dob TEXT  NOT NULL CHECK(dob LIKE '__/__/____'),
            gender STRING CHECK(gender IN ('Male', 'Female', 'Other')),
            phone_number TEXT Not Null,
            email TEXT Not Null,
            allergies STRING
        )
        `
    ).run()

    //Mediacl History

    db.prepare(
        `Create TABLE IF NOT EXISTS doctor (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name STRING NOT NULL UNIQUE,
        password String NOT Null,
        email TEXT NOT NULL,
        speciality STRING NOT NULL,
        experience INTEGER,
        gender TEXT CHECK(gender IN ('Male', 'FEMALE', 'OTHER')) Not Null
        )
        `
    ).run()
})

createtable()


// Database ends here

app.set("view engine", 'ejs')
app.use(express.static("public"))
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())

app.use( (req, res, next) => {
    res.locals.name = ""
    res.locals.doctors = []
    res.locals.errors = []

    // try to decode incoming cookie
    try{
        const decoded = jwt.verify(req.cookies.OurApp, process.env.JWTSECRET)
        req.user = decoded
    }catch (err) {
        req.user = false
    }

    res.locals.user = req.user;
    console.log(req.user)
    next()
})



app.get("/", (req, res) => {
    const data = db.prepare("Select * from doctor").all()
    const user =db.prepare("Select * from patient where username = ?").get(req.user.username)
    const doctors = []
    data.forEach(element => {
        doctors.push(element)
    });

    console.log(user)
    if (req.user){
        return res.render("patient-dashboard", {user:req.user, doctors:doctors})
    }
    res.render("landing")
})

app.get("/doctor-dash", (req, res) => {
    const data = db.prepare("Select * from doctor").all()
    const user =db.prepare("Select * from doctor where email = ?").get(req.user.name)
    const doctors = []
    data.forEach(element => {
        doctors.push(element)
    });
    console.log(user)
    if (req.user){
        return res.render("admin-dashboard", {user:user, doctors:doctors})
    }
    res.render("landing")
})

app.get("/login_as", (req, res) => {
    res.render("login_as", )
})
app.get("/signUp_as", (req, res) => {
    res.render("signUp_as")
})

app.get("/registerasDoc", (req, res) => {
    res.render("signupasDoc")
})
app.get("/registerasPat", (req, res) => {
    res.render("signupasPat")
})

app.get("/loginasDoc", (req, res) => {
    res.render("loginasDoc")
})
app.get("/loginasPat", (req, res) => {
    res.render("loginasPat")
})

app.get("/logout", (req, res) => {
    res.clearCookie("OurApp")
    res.redirect("/")
})

app.post("/loginasDoc", (req, res) => {
    let errors = []
    if (typeof req.body.email !== 'string') req.body.email = ""
    if (typeof req.body.password !== 'string') req.body.password = ""

    if (req.body.email.trim() == "") errors = [("Invalid username")]
    if (req.body.password == "") errors = [("Invalid password")]

    if (errors.length) {
        return res.render("login", {errors})
    }

    const userInUserInput = db.prepare("SELECT * FROM doctor WHERE email = ?")
    const userInput = userInUserInput.get(req.body.email)

    if (!userInput) {
        errors = ["Invalid Username/ Password"]
        return res.render("loginasDoc", {errors})
    }

    const matchOrNot = bcrypt.compareSync(req.body.password, userInput.password)
    if (!matchOrNot){
        errors = ["Invalid email/ Password"]
        return res.render("loginasDoc", {errors})
    }

    // give them a cookie
    const ourTokenValue = jwt.sign({exp:Math.floor(Date.now() / 1000) + 60 * 60 * 24, skyColor: 'blue', user:userInput.id, username:userInput.username}, process.env.JWTSECRET)

    res.cookie("OurApp",ourTokenValue,{
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24
    })
    
    res.redirect("/doctor-dash")


})

app.post("/loginasPat", (req, res) => {
    let errors = []
    if (typeof req.body.email !== 'string') req.body.email = ""
    if (typeof req.body.password !== 'string') req.body.password = ""

    if (req.body.email.trim() == "") errors = [("Invalid username")]
    if (req.body.password == "") errors = [("Invalid password")]

    if (errors.length) {
        return res.render("loginasPat", {errors})
    }

    const userInUserInput = db.prepare("SELECT * FROM patient WHERE email = ?")
    const userInput = userInUserInput.get(req.body.email)

    if (!userInput) {
        errors = ["Invalid Username/ Password"]
        return res.render("loginasPat", {errors})
    }

    const matchOrNot = bcrypt.compareSync(req.body.password, userInput.password)
    if (!matchOrNot){
        errors = ["Invalid email/ Password"]
        return res.render("loginasPat", {errors})
    }

    // give them a cookie
    const ourTokenValue = jwt.sign({exp:Math.floor(Date.now() / 1000) + 60 * 60 * 24, skyColor: 'blue', user:userInput.id, username:userInput.username}, process.env.JWTSECRET)

    res.cookie("OurApp",ourTokenValue,{
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24
    })

    const data = db.prepare("Select * from doctor").all()
    const user =db.prepare("Select * from patient where username = ?").get(req.user.username)
    const doctors = []
    data.forEach(element => {
        doctors.push(element)
    });
    console.log(doctors)
    
    res.redirect("/")


})

app.post("/registerasPat", (req, res) => {
    const errors = []
    const name = req.body.username
    if (typeof req.body.fname !== 'string') req.body.fname = ""
    if (typeof req.body.lname !== 'string') req.body.lname = ""
    if (typeof req.body.password !== 'string') req.body.password = ""

    req.body.username = req.body.username.trim()
    req.body.fname = req.body.fname.trim()
    req.body.lname = req.body.lname.trim()

    if (!req.body.username) errors.push("You need to input your username")
    if (req.body.username && req.body.username.length < 3) errors.push("You must at least enter 3 characters as your username")
    if (req.body.username && req.body.username.length > 10) errors.push("You must at meast enter 10 characters as your username")
    if (req.body.username && !req.body.username.match(/^[a-zA-Z0-9]+$/)) errors.push("Invalid Username")

    const usernameFromDB = db.prepare("SELECT * FROM patient WHERE username = ?")
    const usernameExist = usernameFromDB.get(req.body.username)
    if (usernameExist) errors.push("This Username already exist")

    if (!req.body.password) errors.push("You need to input your password")
    if (req.body.password && req.body.password.length < 8) errors.push("You must at least enter 8 characters as your password")
    if (req.body.password && req.body.password.length > 70) errors.push("You must at meast enter 70 characters as your password")

    if (errors.length) {
        return res.render("home", {errors})
    }

    // Save the new user into a database

    // Hashing the password
    const salt = bcrypt.genSaltSync(10)
    req.body.password = bcrypt.hashSync(req.body.password, salt)
    const OurDb = db.prepare(`INSERT INTO patient (username, password, dob, email, phone_number, lname,fname, allergies, gender) VALUES(?,?,?,?,?,?,?,?,?)`)
    const result = OurDb.run(req.body.username, req.body.password, req.body.dob, req.body.email, req.body.phone, req.body.lname, req.body.fname, req.body.allergies, req.body.gender)

    const lookUp = db.prepare("Select * FROM patient WHERE ROWID = ?")
    const Ouruser = lookUp.get(result.lastInsertRowid)

    // Log the user in by giving them a cookie

    const ourTokenValue = jwt.sign({exp:Math.floor(Date.now() / 1000) + 60 * 60 * 24, skyColor: 'blue', userid:Ouruser.id, username:Ouruser.username}, process.env.JWTSECRET)

    res.cookie("OurApp",ourTokenValue,{
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24
    })

    const data = db.prepare("Select * from doctor").all()
    // const user =db.prepare("Select * from patient where username = ?").get(req.user.username)
    const doctors = []
    data.forEach(element => {
        doctors.push(element)
    });
    console.log(doctors)
    
    res.redirect("/")
})
app.post("/registerasDoc", (req, res) => {
    const errors = []
    const email = req.body.email
    if (typeof req.body.email !== 'string') req.body.email = ""
    if (typeof req.body.password !== 'string') req.body.password = ""

    req.body.email = req.body.email.trim()

    if (!req.body.email) errors.push("You need to input your email")
    if (!req.body.name) errors.push("You need to input your name")
    if (!req.body.specialty) errors.push("You need to input your special")
    if (!req.body.experience) errors.push("You need to input your experience")
    

    const usernameFromDB = db.prepare("SELECT * FROM doctor WHERE email = ?")
    const usernameExist = usernameFromDB.get(email)
    if (usernameExist) errors.push("This Username already exist")

    if (!req.body.password) errors.push("You need to input your password")
    if (req.body.password && req.body.password.length < 8) errors.push("You must at least enter 8 characters as your password")
    if (req.body.password && req.body.password.length > 70) errors.push("You must at meast enter 70 characters as your password")

    if (errors.length) {
        return res.render("signupasDoc", {errors})
    }

    // Save the new user into a database

    // Hashing the password
    const salt = bcrypt.genSaltSync(10)
    req.body.password = bcrypt.hashSync(req.body.password, salt)
    const OurDb = db.prepare(`INSERT INTO doctor (name, email, speciality, password, experience, gender) VALUES(?,?,?,?,?,?)`)
    const result = OurDb.run(req.body.name, req.body.email, req.body.specialty, req.body.password, req.body.experience, req.body.gender)

    const lookUp = db.prepare("Select * FROM doctor WHERE ROWID = ?")
    const Ouruser = lookUp.get(result.lastInsertRowid)

    // Log the user in by giving them a cookie

    const ourTokenValue = jwt.sign({exp:Math.floor(Date.now() / 1000) + 60 * 60 * 24, skyColor: 'blue', userid:Ouruser.id, username:Ouruser.email}, process.env.JWTSECRET)

    res.cookie("OurApp",ourTokenValue,{
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24
    })
    
    res.send("Done")
})

const loggedin = (req, res, next) => {
    if (req.user){
        next()
    }
    return  res.redirect("/doctor-dash")
}

app.get("/create-post",loggedin, (req, res) => {
    res.render("create-post")
})

function sharedPostsValidation(req) {
    const errors = []

    if (typeof req.body.title !== 'string') req.body.title = ""
    if (typeof req.body.text !== 'string') req.body.text = ""

    // sanitize html
    req.body.title = sanitizeHtml(req.body.title.trim(),{allowedTags:[], allowedAttributes : {}})
    req.body.text = sanitizeHtml(req.body.text.trim(),{allowedTags:[], allowedAttributes : {}})

    if (!req.body.title) errors.push("You must provide a title")
    if (!req.body.text) errors.push("No Content was provided")

    return errors
}

app.post("/create-post", loggedin, (req,res) => {
    const errors = sharedPostsValidation(req)
    if (errors.length){
        return res.render("create-post", {errors})
    }

    // Save it into the database
    const OurStatement = db.prepare("INSERT INTO posts(title,text,authorid,created_at) VALUES(?,?,?,?)")
    const result = OurStatement.run(req.body.title, req.body.text, req.user.userid, new Date().toISOString())
})





app.listen(port, host , () => {
    console.log(`Server started at http://${host}:${port}`)
})