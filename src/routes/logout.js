const router = require('express').Router()
const Session = require('../models/session')

router.delete('/', async (req, res) => {
  try {
    await Session.destroy({
      where: {
        username: req.body.username,
        token: req.body.token
      }
    })

    return res.sendStatus(200)
  } catch (error) {
    return res.send({ error: error.message }).status(400)
  }
})

module.exports = router