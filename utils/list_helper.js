const _ = require('lodash')

const dummy = blogs => {
  return 1
}

const totalLikes = blogs => {
  return blogs.reduce((sum, blog) => {
    return sum + blog.likes
  }, 0)
}

const favoriteBlog = blogs => {
  if (blogs.length === 0) {
    return null
  }

  const reducer = (mostLikedBlog, blog) => {
    return blog.likes > mostLikedBlog.likes
      ? blog
      : mostLikedBlog
  }

  const mostLikedBlog = blogs.reduce(reducer, blogs[0])

  return {
    title: mostLikedBlog.title,
    author: mostLikedBlog.author,
    likes: mostLikedBlog.likes
  }
}

const mostBlogs = blogs => {
  if (blogs.length === 0) {
    return null
  }

  const groupedBlogs = _.groupBy(blogs, blog => {
    return blog.author
  })

  let author = ''
  let maxBlogsQuantity = 0
  
  for (const authorName in groupedBlogs) {
    const blogsQuantity = groupedBlogs[authorName].length
    if (blogsQuantity > maxBlogsQuantity) {
      maxBlogsQuantity = blogsQuantity
      author = authorName
    }
  }

  return {
    author: author,
    blogs: maxBlogsQuantity
  }
}

const mostLikes = blogs => {
  if (blogs.length === 0) {
    return null
  }

  const groupedBlogs = _.groupBy(blogs, blog => {
    return blog.author
  })

  let maxLikes = 0;
  let author = ''

  for (const authorName in groupedBlogs) {
    const currentLikes = groupedBlogs[authorName].reduce((likes, blog) => {
      return likes + blog.likes
    }, 0)

    if (currentLikes > maxLikes) {
      maxLikes = currentLikes
      author = authorName
    }
  }

  return {
    author: author,
    likes: maxLikes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}