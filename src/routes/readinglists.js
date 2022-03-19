const { ReadingList } = require('../models');

const router = require('express').Router()

router.post('/', async (req, res) => {
  console.log(req.body)
  const created = await ReadingList.create(req.body)
  res.send(created).status(201)
})

module.exports = router