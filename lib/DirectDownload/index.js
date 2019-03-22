const fs = require('fs')
const path = require('path')
const request = require('request')
const log4js = require('log4js')

log4js.configure({
    appenders: {
        log_file:{//记录器2：输出到文件
            type : 'file',
            filename: process.cwd() + `/logs/log.log`,//文件目录，当目录文件或文件夹不存在时，会自动创建
            maxLogSize : 20971520,//文件最大存储空间（byte），当文件内容超过文件存储空间会自动生成一个文件test.log.1的序列自增长的文件
            backups : 3,//default value = 5.当文件内容超过文件存储空间时，备份文件的数量
            //compress : true,//default false.是否以压缩的形式保存新文件,默认false。如果true，则新增的日志文件会保存在gz的压缩文件内，并且生成后将不被替换，false会被替换掉
            encoding : 'utf-8',//default "utf-8"，文件的编码
        }
    },
    categories: {
        default: {
            appenders: ['log_file'],
            level: 'info'
        }
    }
})

const logger = log4js.getLogger('log_file')


const handleDownload = (url, dir) => {
    const name = url.slice(url.lastIndexOf('/') + 1)
    const output = path.join(dir, name)
    if (fs.existsSync(output)) {
        logger.info(`文件已存在： ${output}`)
        fs.unlinkSync(output)
    }
    return new Promise((resolve, reject) => {
        request
            .get(url)
            .on('response', (res) => {
                if (res.statusCode !== 200) {
                    logger.error(`failed: ${url} - ${output}`)
                    handleDownload(url, dir)
                }
            })
            .on('error', e => {
                logger.error('fs error:', e)
                console.log('request error:', e)
            })
            .pipe(fs.createWriteStream(output))
            .on('finish', () => {
                resolve(output)
            })
            .on('error', e => {
                logger.error('fs error:', e)
                console.log('fs error:', e)
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
            console.log(`第${i+1}条路径已存在 -  ${item.name}， 重复了！`)
        }
        await Promise.all([handleDownload(item.pic1, target), handleDownload(item.pic2, target)]).then(() => {
            console.log(`已完成： ${i + 1}/${total} - ${item.name}`)
        })
    } else {
        console.log(`第${i+1}条已跳过 - ${item.name}`)
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
