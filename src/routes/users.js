const { User, Blog, ReadingList } = require('../models')
const { Op } = require('sequelize')

const router = require('express').Router()

router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      include: {
        model: Blog
      }
    })
    return res.json(users).status(200)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    if (req.query.read === undefined) {
      const user = await User.findByPk(req.params.id, {
        include: {
          model: ReadingList,
          include: [Blog]  
        }
      })
      return res.json(user).status(200)
    }

    const user = await User.findByPk(req.params.id, {
      include: {
        model: ReadingList,
        include: [Blog],
        where: {
          read: req.query.read
        },
      }
    })
    return res.json(user).status(200)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    return res.json(user).status(201)
  } catch(error) {
    next(error)
  }
})

router.put('/:username', async (req, res, next) => {
  try {
    const user = await User.findOne({ 
      where: { username: req.params.username },
    })
    user.username = req.body.username
    await user.save()
    return res.json(user).status(200)
  } catch(error) {
    next(error)
  }
})

module.exports = router