const fs = require('fs')
const path = require('path')
const request = require('request')
const logger = require('../LoggerService/index')

const handleDownload = (url, dir, count = 0) => {
    const name = url.slice(url.lastIndexOf('/') + 1)
    const output = path.join(dir, name)
    const handledUrl = url + (count ? `?r=${(Math.random()*10000).toFixed(0)}` : '')
    count && logger.toLog.warn(`第${count}次重试：下载路径： ${output}；下载地址: ${handledUrl}`)
    if (fs.existsSync(output)) {
        fs.unlinkSync(output)
    }

    return new Promise((resolve, reject) => {
        request
            .get(handledUrl, {
                pool: {
                    maxSockets: Infinity
                },
                timeout: 5000
            })
            .on('response', (res) => {
                if (res.statusCode !== 200) {
                    logger.toLog.error(`请求失败错误码：${res.statusCode} - 下载路径： ${output}；下载地址: ${handledUrl}`)
                    handleDownload(url, dir, ++count)
                }
            })
            .on('error', e => {
                if (e.code === 'ESOCKETTIMEDOUT') {
                    logger.toMeltdown.fatal('请求失败', e)
                    logger.toError.error(`文件下载失败: ${url} - ${dir}`)
                    reject(e)
                } else {
                    logger.toLog.warn(`请求超时： 下载路径： ${output}；下载地址: ${handledUrl}`)
                    handleDownload(url, dir, ++count)
                }
            })
            .pipe(fs.createWriteStream(output))
            .on('finish', () => {
                resolve(output)
            })
            .on('error', e => {
                logger.toMeltdown.fatal('写入失败', e)
                logger.toLog.warn(`文件写入失败: ${url} - ${dir}`)
                handleDownload(url, dir, ++count)
                reject(e)
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
            logger.toLog.warn(`第${i+1}条路径已存在 -  ${item.name}， 重复了！`)
        }
        await Promise.all([handleDownload(item.pic1, target), handleDownload(item.pic2, target)]).then(() => {
            logger.toLog.info(`完成： ${i + 1}/${total} - ${item.name}`)
        }).catch(e => {
            logger.toMeltdown.fatal(e)
            logger.toLog.error(`失败： ${i + 1}/${total} - ${item.name}`)
        })
    } else {
        logger.toLog.warn(`第${i+1}条已跳过 - ${item.name}`)
    }
}

module.exports = async (excelJson, outDir) => {
    const total = excelJson.length
    for (let i = 0; i <= total - 1; i += 10) {
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
            downloadMethods(outDir, excelJson, total, i + 9)
        ])
    }
}
