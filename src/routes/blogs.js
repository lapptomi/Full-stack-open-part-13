const { Blog } = require('../models')

const router = require('express').Router()

router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.findAll()
    return res.json(blogs).status(200)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

router.post('/', async (req, res, next) => {
  try {
    const blog = await Blog.create(req.body)
    return res.json(blog).status(201)
  } catch(error) {
    next(error)
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const blog = await Blog.destroy({ where: { id: req.params.id } })
    return res.json(blog).status(204)
  } catch(error) {
    return res.status(400).json({ error: error.message })
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    blog.likes = req.body.likes
    await blog.save()
    return res.json(blog).status(200)
  } catch(error) {
    next(error)
  }
})

module.exports = router