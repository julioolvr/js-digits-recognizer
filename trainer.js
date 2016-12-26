const math = require('mathjs')
const readline = require('readline')

const { getTrainingImages, getTrainingLabels } = require('./getData')
const drawDigit = require('./drawDigit')

const cost = require('./cost')

Promise.all([getTrainingImages(), getTrainingLabels()])
  .then(([trainingSetImages, trainingSetLabels]) => {
    if (trainingSetImages.readInt32BE(0) !== 0x00000803) {
      console.log('Incorrect magic number in training set images file');
      return;
    }

    if (trainingSetLabels.readInt32BE(0) !== 0x00000801) {
      console.log('Incorrect magic number in training set labels file');
      return;
    }

    const numberOfImages = trainingSetImages.readInt32BE(4)
    const numberOfLabels = trainingSetLabels.readInt32BE(4)

    if (numberOfImages !== numberOfLabels) {
      console.log('Number of images and labels in the files must match')
      return;
    }

    const rows = trainingSetImages.readInt32BE(8)
    const columns = trainingSetImages.readInt32BE(12)

    console.log(`Found ${numberOfImages} ${rows}x${columns} images in the training set`)

    const IMAGES_OFFSET = 16
    const LABELS_OFFSET = 8
    const IMAGE_SIZE = rows * columns

    const images = new Array(numberOfImages)

    for (let n = 0; n < numberOfImages; n++) {
      let image = []

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
          image[columns * i + j] = trainingSetImages.readUInt8(IMAGES_OFFSET + n * IMAGE_SIZE + i * columns + j)
        }
      }

      images[n] = image

      if (n < 10) {
        console.log(`Label: ${trainingSetLabels.readUInt8(LABELS_OFFSET + n)}`)

        drawDigit(image, columns)
      }
    }

    console.log('Done loading images')

    const labels = new Array(numberOfLabels)

    for (let n = 0; n < numberOfLabels; n++) {
      labels[n] = trainingSetLabels.readUInt8(LABELS_OFFSET + n)
    }

    console.log('Done loading images and labels')

    return [math.matrix(images), math.matrix(labels)]
  }).then(([images, labels]) => {
    math.forEach(labels, label => {
      console.log('Calculating cost for label', label)
      const initialParameters = math.zeros(images.size()[1] + 1)
      const initialCost = cost(initialParameters, images, labels.map(x => x === 1 ? 1 : 0))

      console.log('initialCost for number', label, initialCost)
    })

  }).catch(err => {
    console.log('Error:', err)
  })
