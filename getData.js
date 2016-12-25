const fs = require('fs')
const http = require('http')
const zlib = require('zlib')

const URLS = {
  TRAINING_IMAGES: 'http://yann.lecun.com/exdb/mnist/train-images-idx3-ubyte.gz',
  TRAINING_LABELS: 'http://yann.lecun.com/exdb/mnist/train-labels-idx1-ubyte.gz'
}

const DATA_PATH = './data'

module.exports = {
  getTrainingImages: () => readOrDownloadFile(`${DATA_PATH}/trainingImages`, URLS.TRAINING_IMAGES),
  getTrainingLabels: () => readOrDownloadFile(`${DATA_PATH}/trainingLabels`, URLS.TRAINING_LABELS)
}

function readFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => err ? reject(err) : resolve(data))
  }).then(uncompressFile)
}

function uncompressFile(buffer) {
  return new Promise((resolve, reject) => {
    zlib.unzip(buffer, (err, uncompressed) => err ? reject(err) : resolve(uncompressed))
  })
}

function readOrDownloadFile(filePath, url) {
  return readFile(filePath).catch(err => {
    const file = fs.createWriteStream(filePath)

    return new Promise((resolve, reject) => {
      console.log(`Downloading ${url}...`)

      http.get(url, response => {
        console.log(`Downloaded ${url}, saving to file...`)

        response.pipe(file)
        response.on('end', () => resolve(readFile(filePath)))
      })
    })
  })
}
