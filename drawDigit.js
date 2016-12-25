function* forEachGroup(groupSize, array) {
  let group = []

  for (let i = 0; i < array.length; i++) {
    if (i % groupSize === 0) {
      yield group
      group = [array[i]]
    } else {
      group.push(array[i])
    }
  }
}

module.exports = function drawDigit(digit, numberOfColumns) {
  for (row of forEachGroup(numberOfColumns, digit)) {
    console.log(row.map(column => column >= 128 ? '.' : ' ').join(''))
  }
}
