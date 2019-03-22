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
                    console.log(`failed: ${url} - ${output}`)
                    if (!fs.existsSync(output)) {
                        // 不存在就请求
                        handleDownload(url, dir)
                    }
                }
            })
            .on('error', e => {
                console.log('request error:', e)
            })
            .pipe(fs.createWriteStream(output))
            .on('finish', () => {
                resolve(output)
            })
            .on('error', e => {
                console.log('fs error:', e)
            })

    })
}

module.exports = async (excelJson, outDir) => {
    const total = excelJson.length
    for (let i = 0; i <= total - 1; i++) {
        const item = excelJson[i]
        if (item.pic1 && item.pic2) {
            const target = path.join(outDir, `${item.name}${item.id && ` - ${item.id}`}`)

            fs.mkdirSync(target)
            await Promise.all([handleDownload(item.pic1, target), handleDownload(item.pic2, target)]).then(() => {
                console.log(`已完成： ${i + 1}/${total} - ${item.name}`)
            })
        } else {
            console.log(`第${i+1}条已跳过 - ${item.name}`)
        }
    }
}
