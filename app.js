const path = require('path')
const fs = require('fs')
const officegen = require('officegen')
const CommandLineOutput = require('./lib/CommandLineOutput/index')
const ReadExcel = require('./lib/ReadExcel/index')
const WriteWord = require('./lib/WriteWord/index')
const SaveImage = require('./lib/SaveImage/index')
const DirectDownload = require('./lib/DirectDownload/index')

const outDir = path.resolve(process.cwd(), 'output')

async function main() {
    const filename = await CommandLineOutput.ask('文件名为？(默认：导入.xlsx)')
    const excelJson = await ReadExcel.readExcel(filename)
    // ------------------------ 导出到文件夹
    await DirectDownload(excelJson, outDir)
    console.log('Mission Completed!')
    // ------------------------ 导出到word
    // const myDoc = await WriteWord(excelJson, outDir)
    //
    // const out = fs.createWriteStream(path.join(outDir, '输出.docx'))
    // myDoc.generate(out)
    // out.on('close', () => {
    //     console.log('Mission Completed!')
    // })
}

main().catch(e => console.log(e))
