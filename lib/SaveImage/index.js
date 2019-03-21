const fs = require('fs')
const path = require('path')
const request = require('request')

const dir = path.resolve(process.cwd(), 'cache')

module.exports = (url) => {
    const name = url.slice(url.lastIndexOf('/') + 1)
    const output = path.join(dir, name)

    return new Promise((resolve, reject) => {
        request(url)
            .pipe(fs.createWriteStream(output))
            .on('finish', () => {
                resolve(output)
            })
            .on('error', e => {
                reject(e)
            })
    })
}