const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'SequelizeValidationError') {
    return response.status(400).json({ error: error.message })
  }

  if (error.name === 'SequelizeDatabaseError') {
    return response.status(400).json({ error: error.message })
  }

   if (error.name === 'SequelizeUniqueConstraintError') {
    return response.status(400).json({ 
      error: error.errors.map(e => e.message) 
    })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

module.exports = {
  errorHandler,
  unknownEndpoint
}