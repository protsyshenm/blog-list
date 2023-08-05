const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const testHelper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = testHelper.blogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('all blogs should be returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(testHelper.blogs.length)
})

test('blog post should have id property', async () => {
  const response = await api.get('/api/blogs')
  const post = response.body[0]
  expect(post.id).toBeDefined()
})

test.only('valid blog post should be successfully added', async () => {
  const newBlog = {
    title: "Blog title",
    author: "Blog author",
    url: "Blog url",
    likes: 10
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const blogs = response.body.map(blog => {
    return {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes
    }
  })

  expect(response.body).toHaveLength(testHelper.blogs.length + 1)
  expect(blogs).toContainEqual(newBlog)
})
