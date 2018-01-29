// Environment variable
require('dotenv').config()
// Requirements
const express = require('express')
const app = express()
const port = process.env.PORT

const mongoose = require('mongoose')
const bodyParser = require('body-parser')

// Mongoose config
const mongoOpt = {
  user: process.env.MONGO_USER,
  pass: process.env.MONGO_PWD
}
mongoose.connect(process.env.MONGO_URI, mongoOpt)
  .then(
    () => {},
    (err) => {
      console.log(err)
    }
  )

// App config
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// App routes
app.get('/', function (req, res) {
  res.send('index')
})

// App listen
app.listen(port, function () {
  console.log(`APP IS RUNNING ON PORT ${process.env.PORT}`)
})
