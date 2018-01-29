const mongoose = require('mongoose')

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

mongoose.Promise = Promise

module.exports.User = require('./User')
