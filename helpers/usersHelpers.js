const _ = require('lodash')
const db = require('../models')

// Read All
exports.getUsers = (req, res) => {
  db.User.find()
    .then(users => res.status(200).json(users))
    .catch(err => res.status(400).json(err.message))
}

// New
exports.createUser = (req, res) => {
  const newUser = new db.User(_.omit(req.body, 'password'))
  db.User.register(newUser, req.body.password, (err, createdUser) => {
    if (err) {
      res.status(400).json(err.message)
    } else {
      res.status(201).json(createdUser)
    }
  })
}

// Read One
exports.getUser = function (req, res) {
  db.User.findById(req.params.id)
    .then(foundUsers => res.status(200).json(foundUsers))
    .catch(err => res.status(400).json(err.message))
}

// Update One
exports.updateUser = function (req, res) {
  const updateUser = _.omit(req.body, 'password')
  db.User.findOneAndUpdate({_id: req.params.id}, updateUser, {new: true})
    .then(updatedUser => res.status(200).json(updatedUser))
    .catch(err => res.status(400).json(err.message))
}

// Delete One
exports.deleteUser = function (req, res) {
  db.User.remove({_id: req.params.id})
    .then(updatedUser => res.sendStatus(200))
    .catch(err => res.status(400).json(err.message))
}

module.exports = exports
