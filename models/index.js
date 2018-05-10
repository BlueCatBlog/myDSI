const mongoose = require('mongoose')
const Base64 = require('js-base64').Base64

// Mongoose config
mongoose.connect(Base64.decode(process.env.MONGO_URI_FULL))
  .then(
    () => {},
    (err) => {
      console.log(err)
    }
  )

mongoose.Promise = Promise

module.exports.User = require('./User')
