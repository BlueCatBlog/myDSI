const _ = require('lodash')

exports.module = module => (req, res, next) => {
  const roleIntersection = _.intersection(module, req.user.roles)
  if (roleIntersection.length > 0) {
    next()
  } else {
    res.sendStatus(403).end()
  }
}

exports.role = roles => (req, res, next) => {
  const roleIntersection = _.intersection(roles, req.user.roles)
  if (roleIntersection.length > 0) {
    next()
  } else {
    res.sendStatus(403).end()
  }
}

module.exports = exports
