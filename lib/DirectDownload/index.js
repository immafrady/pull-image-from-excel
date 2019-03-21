const fs = require('fs')
const path = require('path')
const request = require('request')

const handleDownload = (url, dir) => {
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

module.exports = (excelJson, outDir) => {
    const total = excelJson.length
    for (let i = 0; i <= total - 1; i++) {
        const item = excelJson[i]
        const target = path.join(outDir, item.name)
        fs.mkdirSync(target)
        Promise.all([handleDownload(item.pic1, target), handleDownload(item.pic2, target)]).then(() => {
            console.log(`已完成： ${i + 1}/${total}`)
        })
    }
}