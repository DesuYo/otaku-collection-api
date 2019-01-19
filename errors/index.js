class ValidationError extends Error {
  constructor (details) {
    super('Validation error is occurred')
    this.details = details
  }
}

class DuplicateDocumentError extends Error {
  constructor (details) {
    super('Duplicate document error is occurred')
    this.details = details
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