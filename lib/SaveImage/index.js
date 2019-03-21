const fs = require('fs')
const path = require('path')
const request = require('request')

const dir = path.resolve(process.cwd(), 'cache')
console.log(dir)

module.exports = (url, name) => {
    const ext = url.slice(url.lastIndexOf('.'))
    const output = path.join(dir, name + ext)

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