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

router.route('/:id/pwd/change')
  .patch(helpers.changeUserPassword)

router.route('/pwd/forgot')
  .patch(helpers.forgotUserPassword)

router.route('/pwd/reset/:token')
  .patch(helpers.resetUserPassword)

module.exports = router
