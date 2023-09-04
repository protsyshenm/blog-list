const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1})
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  if (!body.title || !body.url || !body.author)  {
    return response.status(400).json({ error: 'Missing content'})
  }
  if (!body.likes) {
    body.likes = 0
  }

  const newBlog = ({
    ...body,
    user: user.id
  })

  const blog = new Blog(newBlog)
  const createdBlog = await blog.save()
  user.blogs = user.blogs.concat(createdBlog._id)
  await user.save()
  response.status(201).json(createdBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const user = request.user

  if (blog.user && user.id === blog.user.toString()) {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } else {
    response.status(401).json({
      error: "OOPS, something went wrong"
    })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true})
  response.json(updatedBlog)
})

module.exports = blogsRouter
