const express = require('express')
const app = express()

const { PORT } = require('./src/util/config')
const { connectToDatabase } = require('./src/util/db')

const blogsRouter = require('./src/routes/blogs')
const usersRouter = require('./src/routes/users')
const loginRouter = require('./src/routes/login')

app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.log(`Error message = [${error.message}]`)
  console.log(`Error name = [${error.name}]`)

  if (error.name === 'SequelizeValidationError') {
    return response.status(400).send({ error: error.message })
  } else if (error.name === 'SequelizeDatabaseError') {
    return response.status(400).send({ error: 'Invalid data type' })
  }

  next(errorHandler)
}

app.use(unknownEndpoint)
app.use(errorHandler)

const startServer = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

startServer()