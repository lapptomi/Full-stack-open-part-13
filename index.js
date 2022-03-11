const express = require('express')
const app = express()

const { PORT } = require('./src/util/config')
const { connectToDatabase } = require('./src/util/db')

const blogsRouter = require('./src/routes/blogs')

app.use(express.json())

app.use('/api/blogs', blogsRouter)

const startServer = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

startServer()