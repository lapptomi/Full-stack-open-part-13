const { Sequelize } = require('sequelize')
const { Blog } = require('../models')

const router = require('express').Router()

router.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.findAll({
      group: ['author'],
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('likes')), 'likes'],
        'author',
        [Sequelize.fn('COUNT', Sequelize.col('author')), 'blogs'],
      ],
    })

    return res.send(blogs).status(200)
  } catch (error) {
    next(error)
  }
})

module.exports = router