const sizeOf = require('image-size')

module.exports = (file, long = 400) => {
    const dimensions = sizeOf(file)
    const width = dimensions.width
    const height = dimensions.height

    if (width / height >= 1) {
        // 宽大与长
        return {
            cx: long,
            cy: parseInt(long * height / width)
        }
    } else {
        // 长大于宽
        return {
            cx: parseInt(long * width / height),
            cy: long
        }
    }
}