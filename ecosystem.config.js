// Target server username
const TARGET_SERVER_USER = process.env.TARGET_SERVER_USER ? process.env.TARGET_SERVER_USER.trim() : ''
// Target server hostname or IP address
const TARGET_SERVER_HOST = process.env.TARGET_SERVER_HOST ? process.env.TARGET_SERVER_HOST.trim() : ''
// Target server port
const TARGET_SERVER_PORT = process.env.TARGET_SERVER_PORT ? process.env.TARGET_SERVER_PORT.trim() : 22
// Your repository
const REPO = process.env.REPO

// Application Environment Variable
const TARGET_SERVER_APP_PATH = `/home/${TARGET_SERVER_USER}/myDSI`

module.exports = {
  /// / Application configuration section
  // http://pm2.keymetrics.io/docs/usage/application-declaration/
  apps: [
    {
      name: 'myDSI',
      script: 'app.js'
    }
  ],

  /// / Deployment section
  // http://pm2.keymetrics.io/docs/usage/deployment/
  deploy: {
    development: {
      user: TARGET_SERVER_USER,
      host:
        [{
          host: TARGET_SERVER_HOST,
          port: TARGET_SERVER_PORT
        }],
      ref: 'origin/dev',
      repo: REPO,
      ssh_options: 'StrictHostKeyChecking=no',
      path: `${TARGET_SERVER_APP_PATH}/dev`,
      'post-deploy': 'npm install' +
        ' && npm install --prefix client' +
        ' && npm run build --prefix client' +
        ' && pm2 startOrRestart ecosystem.config.js --env development' +
        ' && pm2 save',
      env: {
        NODE_ENV: 'development',
        PORT: 3001,
        MONGO_URI_FULL: process.env.MONGO_URI_FULL,
        EXPRESS_SECRET: process.env.EXPRESS_SECRET,
        EXPRESS_HTTPS: false,
        REDIRECT_DOMAIN: process.env.REDIRECT_DOMAIN,
        SMTP_HOST: process.env.SMTP_HOST,
        STMP_PORT: process.env.STMP_PORT,
        SMTP_SECURE: process.env.SMTP_SECURE,
        SMTP_USERNAME: process.env.SMTP_USERNAME,
        SMTP_PWD: process.env.SMTP_PWD,
        SMTP_FROM: process.env.SMTP_FROM,
        WEBSITE_NAME: process.env.WEBSITE_NAME
      }
    }
  }
}
