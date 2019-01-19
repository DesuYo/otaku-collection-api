class ValidationError extends Error {
  constructor (details) {
    super(JSON.stringify(details))
  }
}

class DuplicateDocumentError extends Error {
  constructor (details) {
    super(JSON.stringify(details))
  }
}

const handleError = err => {
  if (err.name === 'MongoError' && err.code === 11000)
    throw new DuplicateDocumentError(err)
  else throw err
}

module.exports = {
  ValidationError,
  DuplicateDocumentError,
  handleError
}