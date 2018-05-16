const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const crypto = require('crypto')

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  invitation: Boolean,
  enableToken: { type: String, default: crypto.randomBytes(12).toString('hex') },
  enableExpires: { type: Date, default: Date.now() + 24 * 60 * 60 * 1000 }, // 1 Day
  active: { type: Boolean, default: false }
})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema)
