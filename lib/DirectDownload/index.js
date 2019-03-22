const fs = require('fs')
const path = require('path')
const request = require('request')

const handleDownload = (url, dir) => {
    const name = url.slice(url.lastIndexOf('/') + 1)
    const output = path.join(dir, name)

    return new Promise((resolve, reject) => {
        request
            .get(url)
            .on('response', (res) => {
                if (res.statusCode !== 200) {
                    console.log('failed:', url)
                    handleDownload(url, dir)
                }
            })
            .on('error', e => {
                handleDownload(url, dir)
            })
            .pipe(fs.createWriteStream(output))
            .on('finish', () => {
                resolve(output)
            })

    })
}

const DirectDownload = (arrayIterator, outDir) => {
    const iterator = arrayIterator.next()
    const item = iterator.value
    const target = path.join(outDir, `${item.name}${item.id && ` - ${item.id}`}`)

    fs.mkdirSync(target)
    Promise.all([handleDownload(item.pic1, target), handleDownload(item.pic2, target)]).then(() => {
        console.log(`已完成： ${item.name}`)
        if (!iterator.done) {
            DirectDownload(arrayIterator, outDir)
        }
    })
}


module.exports = DirectDownload
