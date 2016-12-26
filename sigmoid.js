const math = require('mathjs')

module.exports = function(z) {
  // g = 1 ./ (1 + e .^ -z)
  return math.dotDivide(
    1,
    math.add(
      1,
      math.dotPow(
        math.e,
        math.unaryMinus(z)
      )
    )
  )
}
