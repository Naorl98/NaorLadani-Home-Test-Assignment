const log4js = require('log4js')

log4js.configure({
  appenders: {
    console: {
      type: 'stdout',
      layout: {
        type: 'pattern',
        pattern: '{"time":"%d","level":"%p","category":"%c","message":"%m"}'
      }
    }
  },
  categories: {
    default: {
      appenders: ['console'],
      level: 'info'
    }
  }
})
const logger = log4js.getLogger()

module.exports = logger
