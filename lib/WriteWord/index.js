const officegen = require('officegen')
const SaveImage = require('../SaveImage/index')
const fs = require('fs')
const myDoc = officegen('docx')
const HandleImage = require('../HandleImage/index')

module.exports = (excelJson) => {
    const total = excelJson.length

    return new Promise(async (resolve, reject) => {
        for (let i = 0; i <= total - 1; i++) {
            const item = excelJson[i]
            const pObj = myDoc.createP()
            pObj.addText(item.name)
            pObj.addLineBreak ()
            await Promise.all([SaveImage(item.pic1), SaveImage(item.pic2)]).then(response => {
                pObj.addImage(response[0], HandleImage(response[0]))
                pObj.addLineBreak ()
                pObj.addImage(response[1], HandleImage(response[1]))
                myDoc.putPageBreak()
            })
            console.log(`已完成： ${i + 1}/${total}`)
        }
        resolve(myDoc)
    })
}