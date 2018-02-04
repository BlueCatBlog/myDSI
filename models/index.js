const mongoose = require('mongoose')

// Mongoose config
mongoose.connect(process.env.MONGO_URI_FULL)
  .then(
    () => {},
    (err) => {
      console.log(err)
    }
  )

mongoose.Promise = Promise

module.exports.User = require('./User')
