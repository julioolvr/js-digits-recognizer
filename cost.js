const math = require('mathjs')

const sigmoid = require('./sigmoid')

module.exports = function(parameters, trainingSet, expectedResults, lambda = 0.1) {
  const numberOfExamples = trainingSet.size()[0]
  const numberOfFeatures = trainingSet.size()[1]

  // TODO: Maybe move this out of here
  const examples = math.concat(math.ones(numberOfExamples, 1), trainingSet)

  // Calculate the predictions with the given parameters using matrix multiplication
  const predictions = sigmoid(math.multiply(examples, parameters))

  // Calculate the error of comparing those predictions to the actual results
  const errors = math.subtract(
    math.dotMultiply(
      math.unaryMinus(expectedResults),
      math.log(predictions)
    ),
    math.dotMultiply(
      math.subtract(1, expectedResults),
      math.log(
        math.subtract(1, predictions)
      )
    )
  )

  // Calculate the cost based on the total of errors
  const cost = math.sum(
    math.multiply(
      math.divide(
        1,
        numberOfExamples
      ),
      math.sum(errors)
    ),
    math.multiply(
      math.divide(
        math.divide(
          lambda,
          2
        ),
        numberOfExamples
      ),
      math.sum(
        math.square(
          parameters.subset(math.index(math.range(1, parameters.size()[0])))
        )
      )
    )
  )

  return cost
}
