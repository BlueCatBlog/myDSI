const express = require('express')
const router = express.Router()
const helpers = require('../helpers/usersHelpers')

// Users Routes
router.route('/')
  .get(helpers.getUsers)
  .post(helpers.createUser)

router.route('/:id')
  .get(helpers.getUser)
  .put(helpers.updateUser)
  .delete(helpers.deleteUser)

module.exports = router
