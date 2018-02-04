const passport = require('passport')

exports.verify = (req, res, next) => {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.sendStatus(401)
  }
}

exports.login = () => {
  return passport.authenticate('local')
}

module.exports = exports
