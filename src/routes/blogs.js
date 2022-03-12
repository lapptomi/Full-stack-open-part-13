const { Blog, User } = require('../models')
const { SECRET } = require('../util/config')

const jwt = require('jsonwebtoken')
const router = require('express').Router()

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      console.log(authorization.substring(7))
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch (error){
      console.log(error)
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.findAll()
    return res.json(blogs).status(200)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({ ...req.body, userId: user.id })
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