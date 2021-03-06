// Environment Variable
require('dotenv').config()
// Requirements
// - General
const express = require('express')
const app = express()
const port = process.env.PORT
const fs = require('fs')
const path = require('path')
const https = require('https')
const assert = require('assert')
const helmet = require('helmet')
const RateLimit = require('express-rate-limit')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
// - Module
const bodyParser = require('body-parser')
const yn = require('yn')
// - Passport
const passport = require('passport')
require('./services/Passport')

// Express Session Config
const store = new MongoDBStore( // https://github.com/mongodb-js/connect-mongodb-session
  {
    uri: process.env.MONGO_URI_FULL, // test
    collection: 'sessions'
  })
store.on('error', function (error) {
  assert.ifError(error)
  assert.ok(false)
})
app.set('trust proxy', 1) // trust first proxy
app.use(require('express-session')({ // https://www.npmjs.com/package/express-session
  secret: process.env.EXPRESS_SECRET,
  name: 'session',
  store: store,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }
}))

// App Config
// - Express
app.use(express.static(path.join(__dirname, 'public')))
// - Helmet
app.use(helmet())
// - BodyParser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// - RateLimit
const apiLimiter = new RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  delayMs: 0 // disabled
})
app.use('/api/', apiLimiter) // only apply to requests that begin with /api/
// - Passport
app.use(passport.initialize())
app.use(passport.session())

// App Routes
app.get('/health-check', (req, res) => res.sendStatus(200))
app.use('/api/users', require('./routes/usersRoutes'))
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

// App Listen
if (yn(process.env.EXPRESS_HTTPS)) {
  const httpsOpt = { // https://nodejs.org/docs/latest-v8.x/api/https.html#https_https_createserver_options_requestlistener
    // Self-Signed Certificate
    // openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
    key: fs.readFileSync(path.join(__dirname, 'config', 'certs', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'config', 'certs', 'cert.pem'))
  }
  https.createServer(httpsOpt, app) // http://expressjs.com/en/api.html#app.listen
    .listen(port, function () {
      console.log(`APP IS RUNNING ON PORT https://${process.env.IP}:${process.env.PORT}`)
    })
} else {
  app.listen(port, () => console.log(`APP IS RUNNING AT http://${process.env.IP}:${process.env.PORT}`))
}
