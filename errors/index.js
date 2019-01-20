class AwesomeError extends Error {
  constructor (details) {
    super(JSON.stringify(details))
  }
}

class ValidationError extends AwesomeError {}

class NotFoundError extends AwesomeError {}

class DuplicateDocumentError extends AwesomeError {}

const handleError = err => {
  if (err.name === 'MongoError' && err.code === 11000)
    throw new DuplicateDocumentError(err)
  else throw err
}

module.exports = {
  ValidationError,
  NotFoundError,
  DuplicateDocumentError,
  handleError
}