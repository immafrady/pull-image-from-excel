module.exports = (raw) => {
    const length = raw.length
    let start = 0
    let end = 99
    const result = []
    do {
        const arr = raw.slice(start, end)
        const arrIterator = arr[Symbol.iterator]()
        result.push(arrIterator)
        start += 100
        end += 100
    } while (end < length)
    return result
}
