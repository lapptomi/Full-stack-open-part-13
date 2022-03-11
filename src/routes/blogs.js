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

router.post('/', async (req, res) => {
  try {
    const blog = await Blog.create(req.body)
    return res.json(blog).status(201)
  } catch(error) {
    return res.status(400).json({ error: error.message })
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

router.put('/:id', async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    if (!req.body.likes) {
      throw new Error('Invalid or missing likes:', req.body.likes)
    }

    blog.likes = req.body.likes
    await blog.save()
    return res.json(blog).status(200)
  } catch(error) {
    return res.status(400).json({ error: error.message })
  }
})

module.exports = router