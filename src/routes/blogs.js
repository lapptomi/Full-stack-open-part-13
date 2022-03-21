const { Blog, User, Session } = require('../models')
const { SECRET } = require('../util/config')

const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')
const router = require('express').Router()

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      console.log(authorization.substring(7))

      token = authorization.substring(7)
      const session = await Session.findOne({ where: { token: token } })
      if (!session) {
        throw new Error('No session found')
      }

      const decodedToken = jwt.verify(authorization.substring(7), SECRET)
      const user = await User.findByPk(decodedToken.id)

      if (user.disabled === true || user.disabled === 'true') {
        throw new Error('User is disabled')
      }

      req.decodedToken = decodedToken
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
    const blogs = await Blog.findAll({
      include: {
        model: User,
      },
      where: {
        [Op.or]: [
          {
            title: {
              [Op.iLike]: `%${req.query.search ? req.query.search : ''}%`
            }
          },
          {
            author: {
              [Op.iLike]: `%${req.query.search ? req.query.search : ''}%`,
            }
          }
        ]
      },
      order: [
        ['likes', 'DESC']
      ]
    })
    return res.json(blogs).status(200)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

router.post('/', tokenExtractor, async (req, res, next) => {
  try {      
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({ userId: user.id, ...req.body })
    res.json(blog).status(201)
  } catch(error) {
    next(error)
  }
})

router.delete('/:id', tokenExtractor, async (req, res) => {
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