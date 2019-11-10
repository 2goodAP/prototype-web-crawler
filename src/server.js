"use strict"

const path = require("path")
const express = require("express")

const app = express()

const pubDir = path.join(__dirname, "../public")
const viewDir = path.join(__dirname, "templates/views")

app.use(express.static(path.join(__dirname, pubDir)))
app.set("view engine", "ejs")
app.set("views", viewDir)

app.get("/", (req, res) => {
  res.send("Hello world!")
})

app.listen(3000, () => {
  console.log("Server listening at port 3000")
})
