const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')
const { Session, User } = require('../models')

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const token = authorization.substring(7)
      req.decodedToken = jwt.verify(token, SECRET)
      
      const session = await Session.findOne({
        where: { token }
      })
      
      if (!session) {
        return res.status(401).json({ error: 'token expired or invalid' })
      }

      const user = await User.findByPk(req.decodedToken.id)
      if (user.disabled) {
        return res.status(401).json({ error: 'account disabled' })
      }

    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}


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
  unknownEndpoint,
  tokenExtractor
}