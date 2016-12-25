module.exports = function drawDigit(digit) {
  digit.forEach(row => {
    console.log(row.map(column => column >= 128 ? '.' : ' ').join(''))
  })
}
