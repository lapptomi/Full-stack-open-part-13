require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize')
const express = require('express')
const app = express()

app.use(express.json())

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

class Blog extends Model {}
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT,
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})

app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.findAll()
    return res.json(blogs).status(200)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

app.post('/api/blogs', async (req, res) => {
  try {
    const blog = await Blog.create(req.body)
    return res.json(blog).status(201)
  } catch(error) {
    return res.status(400).json({ error: error.message })
  }
})

app.delete('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.destroy({ where: { id: req.params.id } })
    return res.json(blog).status(204)
  } catch(error) {
    return res.status(400).json({ error: error.message })
  }
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})