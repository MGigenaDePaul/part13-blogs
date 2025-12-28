const router = require('express').Router()
const { ReadingList } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.post('/', async (req, res, next) => {
  try {
    const readingList = await ReadingList.create(req.body)
    res.json(readingList)
  } catch(error) {
    next(error)
  }
})

router.put('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const readingList = await ReadingList.findByPk(req.params.id)
    
    if (!readingList) {
      return res.status(404).json({ error: 'reading list entry not found' })
    }

    if (readingList.userId !== req.decodedToken.id) {
      return res.status(403).json({ error: 'only the owner can update this reading list entry' })
    }

    readingList.read = req.body.read
    await readingList.save()
    res.json(readingList)
  } catch(error) {
    next(error)
  }
})

module.exports = router