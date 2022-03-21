const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const User = require('../models/user')
const Session = require('../models/session')

router.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })

  const passwordCorrect = body.password === 'salainen'
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const session = await Session.findOne({ where: { username: body.username } })

  if (session) {
    return response
      .status(200)
      .send({ token: session.token, username: user.username, name: user.name })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  await Session.create({ username: user.username, token: token })

  return response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = router