require("dotenv").config()
const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")
const CookieParser = require("cookie-parser")
const bcrypt = require('bcrypt')
const port = 5050
const host = 'localhost'

// Database setup here

const db = require("better-sqlite3")("DBtesting.db");
db.pragma("journal_mode = WAL")

const createtable = () => {
    db.prepare(
        `CREATE TABLE IF NOT EXISTS users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username STRING NOT NULL UNIQUE,
            password STRING NOT NULL
        )
        `
    ).run()
}

createtable()

// Database setup ends here



app.set("view engine", 'ejs') // specifying engine to use
app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))
app.use(CookieParser())


// Middleware
app.use((req, res, next) => {
    res.locals.name = ""
    res.locals.errors = []
    

    try{
        const decoded = jwt.verify(req.cookies.TestApp, process.env.JWTSECRET)
        req.user_key = decoded
    }catch(err){
        req.user_key = err
    }

    res.locals.user_key = req.user_key
    console.log(req.user_key)
    next()
})

app.get("/", (req, res) => {
    res.render("hometest")
})

app.post("/register", (req, res) => {
    let name = req.body.username;
    const errors = [];

    if (typeof req.body.username !== 'string') req.body.username = ""
    if (typeof req.body.password !== 'string') req.body.password = ""

    req.body.username = req.body.username.trim()

    if (!req.body.username) errors.push("You need to enter your username");
    if (req.body.username && req.body.username.length < 3) errors.push("Your username must be at least 3 characters");
    if (req.body.username && req.body.username.length > 10) errors.push("Your username must be at most 10 characters");
    if (req.body.username && !req.body.username.match(/^[a-zA-Z0-9]+$/)) errors.push("Invalid Username");

    if (!req.body.password) errors.push("You need to enter your password");
    if (req.body.password && req.body.password.length < 8) errors.push("Your password must be at least 8 characters");
    if (req.body.password && req.body.password.length > 70) errors.push("Your password must be at most 70 characters");

    if (errors.length){
        return res.render("hometest", {errors})
    }
    try{
        const salt = bcrypt.genSaltSync(10)
        req.body.password = bcrypt.hashSync(req.body.password, salt)
        const executer = db.prepare("INSERT INTO users(username, password) values(?,?)")
        const result = executer.run(req.body.username, req.body.password)

        const rowId = db.prepare("SELECT * FROM users WHERE ROWID = ?")
        const user = rowId.get(result.lastInsertRowid)

        const ourTokenValue = jwt.sign({exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, favColor:'brown', userid:user.id, username: user.username},process.env.JWTSECRET)

        res.cookie("TestApp",ourTokenValue,{
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24
        })
        res.render("welcome", {name})
    }catch(err){
        console.log(err)
    }
})

app.listen(port, host, () => {
    console.log(`Server started at http://${host}:${port}`)
})