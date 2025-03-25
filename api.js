const express = require("express")
const db = require("better-sqlite3")("DBmodel.db")
const app = express()
const host = "localhost"
const port = 5000


app.use(express.json())

app.get("/api",(req, res) => {
    const data = db.prepare("SELECT * FROM users")
    res.json(data.columns())
})

app.listen(port, host, () => {
    console.log(`Server listening at http://${host}:${port}/api`)
})