const { ReadingList, Session, User } = require('../models');

const router = require('express').Router()

const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

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

router.post('/', async (req, res) => {
  const created = await ReadingList.create(req.body)
  res.send(created).status(201)
})

router.put('/:id', tokenExtractor, async (req, res) => {
  try {
    const list = await ReadingList.findByPk(req.params.id)

    if (req.decodedToken.id === list.userId) {
      list.read = req.body.read;
      list.save()
    }
    
    return res.json(list).status(200)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})


module.exports = router