const readline = require('readline')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

rl.on('line', line => {
    console.log(line)
})

module.exports = {
    ask: question => {
        return new Promise((resolve, reject) => {
            try {
                rl.question(`${question}: `, res => {
                    resolve(res)
                })
            } catch (e) {
                reject(e)
            }
        })
    },
    write: msg => {
      rl.write(msg)
    },
    quit: () => {
        rl.close()
    }
}