const log4js = require('log4js')

log4js.configure({
    appenders: {
        log_file:{//记录器2：输出到文件
            type : 'file',
            filename: process.cwd() + `/.logs/log.log`,//文件目录，当目录文件或文件夹不存在时，会自动创建
            maxLogSize : 20971520,//文件最大存储空间（byte），当文件内容超过文件存储空间会自动生成一个文件test.log.1的序列自增长的文件
            backups : 3,//default value = 5.当文件内容超过文件存储空间时，备份文件的数量
            //compress : true,//default false.是否以压缩的形式保存新文件,默认false。如果true，则新增的日志文件会保存在gz的压缩文件内，并且生成后将不被替换，false会被替换掉
            encoding : 'utf-8',//default "utf-8"，文件的编码
        },
        error_file: {
            type: 'file',
            filename: process.cwd() + '/.logs/error.log',
            maxLogSize : 20971520,//文件最大存储空间（byte），当文件内容超过文件存储空间会自动生成一个文件test.log.1的序列自增长的文件
            backups : 3,//default value = 5.当文件内容超过文件存储空间时，备份文件的数量
            //compress : true,//default false.是否以压缩的形式保存新文件,默认false。如果true，则新增的日志文件会保存在gz的压缩文件内，并且生成后将不被替换，false会被替换掉
            encoding : 'utf-8',//default "utf-8"，文件的编码
        }
    },
    categories: {
        default: {
            appenders: ['log_file', 'error_file'],
            level: 'ALL'
        }
    }
})

module.exports = {
    toLog: log4js.getLogger('log_file'),
    toError: log4js.getLogger('error_file')
}