const passport = require('passport')
const db = require('../models')

// Passport Config
passport.use(db.User.createStrategy())
passport.serializeUser(db.User.serializeUser())
passport.deserializeUser(db.User.deserializeUser())
