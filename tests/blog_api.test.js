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
