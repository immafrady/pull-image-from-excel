const fs = require('fs')
const path = require('path')
const request = require('request')
const logger = require('../LoggerService/index')

const handleDownload = (url, dir) => {
    const name = url.slice(url.lastIndexOf('/') + 1)
    const output = path.join(dir, name)
    if (fs.existsSync(output)) {
        fs.unlinkSync(output)
    }
    return new Promise((resolve, reject) => {
        request
            .get(url)
            .on('response', (res) => {
                if (res.statusCode !== 200) {
                    logger.toLog.error(`请求失败错误码：${res.statusCode}`)
                    handleDownload(url, dir)
                }
            })
            .on('error', e => {
                logger.toError.error(`文件下载失败: ${url} - ${dir}`)
                reject()
            })
            .pipe(fs.createWriteStream(output))
            .on('finish', () => {
                resolve(output)
            })
            .on('error', e => {
                logger.toError.error(`文件写入失败: ${url} - ${dir}`)
                reject()
            })

    })
}

const downloadMethods = async (outDir, excelJson, total, i) => {
    const item = excelJson[i]
    if (item && item.pic1 && item.pic2) {
        const target = path.join(outDir, `${item.name}${item.id && ` - ${item.id}`}`)

        if (!fs.existsSync(target)) {
            fs.mkdirSync(target)
        } else {
            logger.toLog.info(`第${i+1}条路径已存在 -  ${item.name}， 重复了！`)
        }
        await Promise.all([handleDownload(item.pic1, target), handleDownload(item.pic2, target)]).then(() => {
            logger.toLog.info(`完成： ${i + 1}/${total} - ${item.name}`)
        }).catch(e => {
            logger.toLog.info(`失败： ${i + 1}/${total} - ${item.name}`)
        })
    } else {
        logger.toLog.info(`第${i+1}条已跳过 - ${item.name}`)
    }
}

module.exports = async (excelJson, outDir) => {
    const total = excelJson.length
    for (let i = 0; i <= total - 1; i += 20) {
        await Promise.all([
            downloadMethods(outDir, excelJson, total, i),
            downloadMethods(outDir, excelJson, total, i + 1),
            downloadMethods(outDir, excelJson, total, i + 2),
            downloadMethods(outDir, excelJson, total, i + 3),
            downloadMethods(outDir, excelJson, total, i + 4),
            downloadMethods(outDir, excelJson, total, i + 5),
            downloadMethods(outDir, excelJson, total, i + 6),
            downloadMethods(outDir, excelJson, total, i + 7),
            downloadMethods(outDir, excelJson, total, i + 8),
            downloadMethods(outDir, excelJson, total, i + 9),
            downloadMethods(outDir, excelJson, total, i + 10),
            downloadMethods(outDir, excelJson, total, i + 11),
            downloadMethods(outDir, excelJson, total, i + 12),
            downloadMethods(outDir, excelJson, total, i + 13),
            downloadMethods(outDir, excelJson, total, i + 14),
            downloadMethods(outDir, excelJson, total, i + 15),
            downloadMethods(outDir, excelJson, total, i + 16),
            downloadMethods(outDir, excelJson, total, i + 17),
            downloadMethods(outDir, excelJson, total, i + 18),
            downloadMethods(outDir, excelJson, total, i + 19)
        ])
    }
}
