const _ = require('lodash')
const db = require('../models')
const msg = require('../services/Messages')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const { config: nMailerCfg, mailTemplate } = require('../services/Mailer')

// Read All Users
exports.getUsers = (req, res) => {
  db.User.find()
    .then(users => res.status(200).json(users))
    .catch(err => res.status(400).json(err.message))
}

// New User
exports.createUser = (req, res) => {
  const newUser = new db.User(_.omit(req.body, 'password'))
  db.User.register(newUser, req.body.password, (err, createdUser) => {
    if (err) {
      res.status(400).json(err.message)
    } else {
      const website = `${process.env.REDIRECT_DOMAIN}:${process.env.PORT}/users/enable/${createdUser.enableToken}`
      // Basic information for simple email template
      const body = {
        hello: `Hello ${createdUser.username}`,
        intro: `Thank you to register on ${process.env.WEBSITE_NAME} enable your account to start using it:`,
        link: website,
        action: 'Enable account',
        complement: `If the button doesn't work, go to: <a href=${website}>${website}</a> (it will expire at ${createdUser.enableExpires})`,
        regards: 'Best regards,',
        signature: 'IT Team'
      }

      // create reusable transporter object using the default SMTP transport
      const transporter = nodemailer.createTransport(nMailerCfg)
      // setup email data with unicode symbols
      const mailOptions = {
        from: process.env.SMTP_FROM, // sender address
        to: createdUser.email, // list of receivers
        subject: 'Enable your account', // Subject line
        html: mailTemplate(body) // html body
      }

      // send mail with defined transport object
      transporter.sendMail(mailOptions)
        .catch(err => res.status(422).json(err.message))

      res.status(201).json({id: createdUser.id, username: createdUser.username, enableToken: createdUser.enableToken})
    }
  })
}

// Enable User
exports.enableUser = (req, res) => {
  db.User.findOne({enableToken: req.params.token})
    .then(foundUser => {
      if (foundUser) {
        if (foundUser.enableExpires >= Date.now()) {
          foundUser.enableToken = undefined
          foundUser.enableExpires = undefined
          foundUser.active = true
          foundUser.save()
            .catch(err => res.status(422).json(err.message))
          res.status(200).json(msg.enableUser)
        } else {
          throw res.status(400).json(msg.expiredToken)
        }
      } else {
        res.status(400).json(msg.notFoundUserToken)
      }
    }, err => res.status(400).json(err.message))
    .catch(err => res.status(400).json(err.message))
}

// Invitation User
exports.invitUser = (req, res) => {
  db.User.create({invitation: true, ...req.body})
    .then(invitedUser => {
      {
        const website = `${process.env.REDIRECT_DOMAIN}:${process.env.PORT}/users/invitation/${invitedUser.enableToken}`
        // Basic information for simple email template
        const body = {
          hello: `Hello ${invitedUser.username}`,
          intro: `You have been invited on ${process.env.WEBSITE_NAME}, just set your password and login:`,
          link: website,
          action: 'Set my password',
          complement: `If the button doesn't work, go to: <a href=${website}>${website}</a> (it will expire at ${invitedUser.enableExpires})`,
          regards: 'Best regards,',
          signature: 'IT Team'
        }

        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport(nMailerCfg)
        // setup email data with unicode symbols
        const mailOptions = {
          from: process.env.SMTP_FROM, // sender address
          to: invitedUser.email, // list of receivers
          subject: `Invitation to use ${process.env.WEBSITE_NAME}`, // Subject line
          html: mailTemplate(body) // html body
        }

        // send mail with defined transport object
        transporter.sendMail(mailOptions)
          .catch(err => res.status(422).json(err.message))
      }
      res.status(200).json(msg.forgotUserPassword)
    }, err => res.status(400).json(err.message))
    .catch(err => res.status(422).json(err.message))
}

// Invitation Enable User
exports.invitEnableUser = (req, res) => {
  db.User.findOne({enableToken: req.params.token})
    .then(foundUser => {
      if (foundUser) {
        if (foundUser.enableExpires >= Date.now()) {
          foundUser.setPassword(req.body.password, (err, updatedUser) => {
            if (err) {
              res.status(400).json(err.message)
            } else {
              updatedUser.enableToken = undefined
              updatedUser.enableExpires = undefined
              updatedUser.active = true
              updatedUser.username = req.body.username
              updatedUser.email = req.body.email
              updatedUser.save()
                .catch(err => res.status(422).json(err.message))
              res.status(200).json(msg.enableUser)
            }
          })
        } else {
          throw res.status(400).json(msg.expiredToken)
        }
      } else {
        res.status(400).json(msg.notFoundUserToken)
      }
    }, err => res.status(400).json(err.message))
    .catch(err => res.status(400).json(err.message))
}

// Login User
exports.loginUser = (req, res) => {
  res.status(200).json(msg.loginUser)
}

// Logout User
exports.logoutUser = (req, res) => {
  req.logout()
  res.status(200).json(msg.logoutUser)
}

// Read One User
exports.getUser = (req, res) => {
  db.User.findById(req.params.id)
    .then(foundUser => res.status(200).json(foundUser))
    .catch(err => res.status(400).json(err.message))
}

// Update One User
exports.updateUser = (req, res) => {
  db.User.findOneAndUpdate({_id: req.params.id}, _.omit(req.body, 'password'))
    .then(updatedUser => res.status(200).json(msg.updateUser))
    .catch(err => res.status(400).json(err.message))
}

// Patch One User Password
exports.changeUserPassword = (req, res) => {
  db.User.findById(req.params.id)
    .then(foundUser => {
      if (foundUser) {
        foundUser.changePassword(req.body.oldPassword, req.body.newPassword, (err, updatedUser) => {
          if (err) {
            res.status(400).json(err.message)
          } else {
            res.status(200).json(msg.changeUserPassword)
          }
        })
      } else {
        res.status(400).json(msg.notFoundUserId)
      }
    })
    .catch(err => res.status(400).json(err.message))
}

// Patch Forgot One User Password
exports.forgotUserPassword = (req, res) => {
  db.User.findOne({email: req.body.email})
    .then(foundUser => {
      if (foundUser) {
        foundUser.resetPasswordToken = crypto.randomBytes(48).toString('hex')
        foundUser.resetPasswordExpires = Date.now() + 60 * 60 * 1000 // 1 hour
        foundUser.save()
          .catch(err => res.status(422).json(err.message))

        return foundUser
      } else {
        throw res.status(400).json(msg.notFoundUserEmail)
      }
    }, err => res.status(400).json(err.message))
    .then(foundUser => {
      {
        const website = `${process.env.REDIRECT_DOMAIN}:${process.env.PORT}/users/pwd/reset/${foundUser.resetPasswordToken}`
        // Basic information for simple email template
        const body = {
          hello: `Hello ${foundUser.username}`,
          intro: 'Forgot your password? Reset it below:',
          link: website,
          action: 'Reset password',
          complement: `If the button doesn't work, go to: <a href=${website}>${website}</a> (it will expire at ${foundUser.resetPasswordExpires})`,
          regards: 'Best regards,',
          signature: 'IT Team'
        }

        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport(nMailerCfg)
        // setup email data with unicode symbols
        const mailOptions = {
          from: process.env.SMTP_FROM, // sender address
          to: foundUser.email, // list of receivers
          subject: 'Forgot password', // Subject line
          html: mailTemplate(body) // html body
        }

        // send mail with defined transport object
        transporter.sendMail(mailOptions)
          .catch(err => res.status(422).json(err.message))
      }
      res.status(200).json(msg.forgotUserPassword)
    }, err => res.status(400).json(err.message))
    .catch(err => res.status(400).json(err.message))
}

// Patch Reset One User Password
exports.resetUserPassword = (req, res) => {
  db.User.findOne({resetPasswordToken: req.params.token})
    .then(foundUser => {
      if (foundUser) {
        if (foundUser.resetPasswordExpires >= Date.now()) {
          return foundUser
        } else {
          throw res.status(400).json(msg.expiredToken)
        }
      } else {
        throw res.status(400).json(msg.notFoundUserToken)
      }
    }, err => res.status(400).json(err.message))
    .then(foundUser => {
      foundUser.setPassword(req.body.password, (err, updatedUser) => {
        if (err) {
          res.status(400).json(err.message)
        } else {
          updatedUser.resetPasswordToken = undefined
          updatedUser.resetPasswordExpires = undefined
          updatedUser.save()
            .catch(err => res.status(422).json(err.message))
        }
      })
      return foundUser
    }, err => res.status(400).json(err.message))
    .then(foundUser => {
      {
        console.log(foundUser)
        const website = `${process.env.REDIRECT_DOMAIN}:${process.env.PORT}/users/pwd/forgot/`
        // Basic information for simple email template
        const body = {
          hello: `Hello ${foundUser.username}`,
          intro: 'Your password has been changed, reset it if it\'s not your doing :',
          link: website,
          action: 'Ask a new password',
          complement: `If the button doesn't work, go to: <a href=${website}>${website}</a>`,
          regards: 'Best regards,',
          signature: 'IT Team'
        }

        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport(nMailerCfg)
        // setup email data with unicode symbols
        const mailOptions = {
          from: '"myDSI" <notifications@my.dsi>', // sender address
          to: foundUser.email, // list of receivers
          subject: 'Password changed', // Subject line
          html: mailTemplate(body) // html body
        }

        // send mail with defined transport object
        transporter.sendMail(mailOptions)
          .catch(err => res.status(422).json(err.message))
      }
      res.status(200).json(msg.resetUserPassword)
    }, err => res.status(400).json(err.message))
    .catch(err => res.status(400).json(err.message))
}

// Delete One User
exports.deleteUser = (req, res) => {
  db.User.remove({_id: req.params.id})
    .then(updatedUser => res.status(200).json(msg.deleteUser))
    .catch(err => res.status(400).json(err.message))
}

module.exports = exports
