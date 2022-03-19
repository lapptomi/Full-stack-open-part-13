const Blog = require('./blog')
const ReadingList = require('./readinglist')
const User = require('./user')

User.hasMany(Blog)
Blog.belongsTo(User)

module.exports = {
  Blog,
  User,
  ReadingList
}