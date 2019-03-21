const officegen = require('officegen')
const SaveImage = require('../SaveImage/index')

const myDoc = officegen('docx')

module.exports = (excelJson) => {
    return new Promise(async (resolve, reject) => {
        for (let item of excelJson) {
            const pObj = myDoc.createP()
            pObj.addText(item.name)
            pObj.addLineBreak ()
            const pic1 = await SaveImage(item.pic1, 1)
            const pic2 = await SaveImage(item.pic2, 2)
            console.log(pic1)
            console.log(pic2)
            pObj.addImage(pic1, { cx: 300 })
            pObj.addLineBreak ()
            pObj.addImage(pic2, { cx: 300 })

            myDoc.putPageBreak()
        }
        console.log('here')
        resolve(myDoc)
    })
}