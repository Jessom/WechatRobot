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
      filename: path.resolve(__dirname, `../logs/${logName}.log`),
      maxLogSize: 20971520,
      backups: 3,
      encoding: 'utf-8'
    },

    data_file: {
      type: 'dateFile',
      filename: path.resolve(__dirname, `../logs/${logName}.log`),
      alwaysIncludePattern: true,
      daysToKeep: 15,
      pattern: '-yyyy-MM-dd-hh.log',
      encoding: 'utf-8'
    },

    error_file: {
      type: 'dateFile',
      filename: path.resolve(__dirname, `../logs/${logName}_error.log`),
      alwaysIncludePattern: true,
      daysToKeep: 15,
      pattern: '_yyyy-MM-dd-hh.log',
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

module.exports = log4js.getLogger('default')
