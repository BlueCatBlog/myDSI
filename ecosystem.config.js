// Target server username
const TARGET_SERVER_USER = process.env.TARGET_SERVER_USER ? process.env.TARGET_SERVER_USER.trim() : ''
// Target server hostname or IP address
const TARGET_SERVER_HOST = process.env.TARGET_SERVER_HOST ? process.env.TARGET_SERVER_HOST.trim() : ''
// Target server port
const TARGET_SERVER_PORT = process.env.TARGET_SERVER_PORT ? process.env.TARGET_SERVER_PORT.trim() : 22
// Your repository
const REPO = process.env.REPO
// Target server application path
const TARGET_SERVER_APP_PATH = `/home/${TARGET_SERVER_USER}/myDSI`

// Environnement Variables

module.exports = {
  /// / Application configuration section
  // http://pm2.keymetrics.io/docs/usage/application-declaration/
  apps: [{
    name: 'myDSI',
    script: 'app.js'
  }],

  /// / Deployment section
  // http://pm2.keymetrics.io/docs/usage/deployment/
  deploy: {
    development: {
      user: TARGET_SERVER_USER,
      host: [{
        host: TARGET_SERVER_HOST,
        port: TARGET_SERVER_PORT
      }],
      ref: 'origin/dev',
      repo: REPO,
      ssh_options: 'StrictHostKeyChecking=no',
      path: `${TARGET_SERVER_APP_PATH}/dev`,
      'pre-setup': `rm -r ${TARGET_SERVER_APP_PATH}/dev -f`,
      'post-deploy': 'if [ ! -f .env ]' +
        ` ; then echo "MONGO_URI_FULL=${process.env.MONGO_URI_FULL}" > .env` +
        ` && "echo EXPRESS_SECRET=${process.env.EXPRESS_SECRET}" >> .env` +
        ` && "echo EXPRESS_HTTPS=${process.env.EXPRESS_HTTPS}" >> .env` +
        ` && "echo REDIRECT_DOMAIN=${process.env.REDIRECT_DOMAIN}" >> .env` +
        ` && "echo SMTP_HOST=${process.env.SMTP_HOST}" >> .env` +
        ` && "echo STMP_PORT=${process.env.STMP_PORT}" >> .env` +
        ` && "echo SMTP_SECURE=${process.env.SMTP_SECURE}" >> .env` +
        ` && "echo SMTP_USERNAME=${process.env.SMTP_USERNAME}" >> .env` +
        ` && "echo SMTP_PWD=${process.env.SMTP_PWD}" >> .env` +
        ` && "echo SMTP_FROM=${process.env.SMTP_FROM}" >> .env` +
        ` && "echo WEBSITE_NAME=${process.env.WEBSITE_NAME}" >> .env` +
        ' ; fi' +
        ' && npm install' +
        ' && npm install --prefix client' +
        ' && npm run build --prefix client' +
        ' && pm2 startOrRestart ecosystem.config.js --env development' +
        ' && pm2 save',
      env: {
        NODE_ENV: 'development',
        PORT: 3001
      }
    }
  }
}
