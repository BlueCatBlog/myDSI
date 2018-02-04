const express = require('express')
const router = express.Router()
const { authentication } = require('../middlewares')
const helpers = require('../helpers/usersHelpers')

// Users Routes
router.route('/')
  .get(authentication.verify, helpers.getUsers)
  .post(helpers.createUser)

router.route('/login')
  .post(authentication.login(), helpers.loginUser)

router.route('/logout')
  .get(helpers.logoutUser)

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
