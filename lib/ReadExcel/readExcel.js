const XLSX = require('xlsx')
const path = require('path')

module.exports = (filename) => {
    filename = filename && filename.trim() || '导入.xlsx'
    const pwd = path.resolve(`${process.cwd()}/input`, filename)

    console.log(pwd)
    return new Promise((resolve, reject) => {
        try {
            const workBook = XLSX.readFile(pwd)
            const sheetNames = workBook.SheetNames
            const worksheet = workBook.Sheets[sheetNames[0]]

            resolve(XLSX.utils.sheet_to_json(worksheet))
        } catch (e) {
            reject(e)
        }
    })
}