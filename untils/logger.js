const log4js = require('log4js')
const path = require('path')
const logName = 'robot'

log4js.configure({
  appenders: {
    console: {
      type: 'console'
    },

    log_file: {
      type: 'file',
      filename: path.resolve(__dirname, `../logs/${logName}`),
      maxLogSize: 20971520,
      backups: 3,
      encoding: 'utf-8'
    },

    data_file: {
      type: 'dateFile',
      filename: path.resolve(__dirname, `../logs/${logName}`),
      alwaysIncludePattern: true,
      daysToKeep: 15,
      pattern: '-yyyy-MM-dd.log',
      encoding: 'utf-8'
    },

    error_file: {
      type: 'dateFile',
      filename: path.resolve(__dirname, `../logs/${logName}_error`),
      alwaysIncludePattern: true,
      daysToKeep: 15,
      pattern: '-yyyy-MM-dd.log',
      encoding: 'utf-8'
    }
  },

  categories: {
    default: {
      appenders: ['data_file', 'console', 'log_file'],
      level: 'info'
    },

    production: {
      appenders: ['data_file'],
      level: 'warn'
    },

    console: {
      appenders: ['console'],
      level: 'debug'
    },

    debug: {
      appenders: ['console', 'log_file'],
      level: 'debug'
    },

    error_log: {
      appenders: ['error_file'],
      level: 'error'
    }
  }
})

module.exports = log4js.getLogger('production')
