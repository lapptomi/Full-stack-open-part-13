const Blog = require('./blog')
const ReadingList = require('./readinglist')
const User = require('./user')


User.belongsToMany(Blog, { through: ReadingList });
Blog.belongsToMany(User, { through: ReadingList });
User.hasMany(ReadingList);
ReadingList.belongsTo(User);
Blog.hasMany(ReadingList);
ReadingList.belongsTo(Blog);

module.exports = {
  Blog,
  User,
  ReadingList
}

