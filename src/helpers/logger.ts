import * as log4js from 'log4js'
import fs from 'fs'

log4js.configure({
    appenders: {
        stdout: { type: 'stdout' },
        file: { type: 'file', filename: 'logs/out.log' }
    },
    categories: {
        default:  { appenders: [ 'stdout', 'file' ], level: 'info' },
        app:  { appenders: [ 'stdout', 'file' ], level: 'info' }
    }
})

export const logger = log4js.getLogger('app')

export const readLog = () => {
    return new Promise((resolve, reject) => {
        const log = fs.readFile('logs/out.log','utf8', (error, content) => {
            if (error) {
                logger.error(error)
                reject(error)
            }

            resolve(content)
        })
    
        return log
    })
}