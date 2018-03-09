const express = require('express')
const router = express.Router()
const { authentication } = require('../middlewares')
const helpers = require('../helpers/usersHelpers')

// Users Routes
router.route('/')
  .get(authentication.verify, helpers.getUsers)
  .post(helpers.createUser)

router.route('/enable/:token')
  .patch(helpers.enableUser)

router.route('/invitation')
  .post(helpers.invitUser)

router.route('/invitation/:token')
  .put(helpers.invitEnableUser)

router.route('/login')
  .post(authentication.login(), helpers.loginUser)

router.route('/logout')
  .get(helpers.logoutUser)

router.route('/:id')
  .get(authentication.verify, helpers.getUser)
  .put(authentication.verify, helpers.updateUser)
  .delete(authentication.verify, helpers.deleteUser)

router.route('/:id/pwd/change')
  .patch(authentication.verify, helpers.changeUserPassword)

router.route('/pwd/forgot')
  .patch(helpers.forgotUserPassword)

router.route('/pwd/reset/:token')
  .patch(helpers.resetUserPassword)

module.exports = router
