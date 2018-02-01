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
      res.status(201).json({id: createdUser.id, username: createdUser.username})
    }
  })
}

// Read One
exports.getUser = (req, res) => {
  db.User.findById(req.params.id)
    .then(foundUser => res.status(200).json(foundUser))
    .catch(err => res.status(400).json(err.message))
}

// Update One
exports.updateUser = (req, res) => {
  db.User.findOneAndUpdate({_id: req.params.id}, _.omit(req.body, 'password'), {new: true})
    .then(updatedUser => res.status(200).json(updatedUser))
    .catch(err => res.status(400).json(err.message))
}

// Update One Password
exports.updateUserPassword = (req, res) => {
  db.User.findById(req.params.id)
    .then(foundUser => {
      if (foundUser) {
        foundUser.changePassword(req.body.oldPassword, req.body.newPassword, (err, updatedUser) => {
          if (err) {
            res.status(400).json(err.message)
          } else {
            res.sendStatus(200)
          }
        })
      } else {
        res.sendStatus(400)
      }
    })
    .catch(err => res.status(400).json(err.message))
}

// Delete One
exports.deleteUser = (req, res) => {
  db.User.remove({_id: req.params.id})
    .then(updatedUser => res.sendStatus(200))
    .catch(err => res.status(400).json(err.message))
}

module.exports = exports
