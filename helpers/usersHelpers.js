const _ = require('lodash')
const db = require('../models')

// Read All
exports.getUsers = function (req, res) {
  db.User.find()
    .then(function (Users) {
      res.json(Users)
    })
    .catch(function (err) {
      res.send(err)
    })
}

// New
exports.createUser = function (req, res) {
  const newUser = new db.User(_.omit(req.body, 'password'))
  db.User.register(newUser, req.body.password, function (err, createdUser) {
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
    .then(function (foundUser) {
      res.json(foundUser)
    })
    .catch(function (err) {
      res.send(err)
    })
}

// Update One
exports.updateUser = function (req, res) {
  db.User.findOneAndUpdate({_id: req.params.id}, req.body, {new: true})
    .then(function (User) {
      res.json(User)
    })
    .catch(function (err) {
      res.send(err)
    })
}

// Delete One
exports.deleteUser = function (req, res) {
  db.User.remove({_id: req.params.id})
    .then(function () {
      res.json({message: 'We deleted it!'})
    })
    .catch(function (err) {
      res.send(err)
    })
}

module.exports = exports
