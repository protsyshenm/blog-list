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

test('valid blog post should be successfully added', async () => {
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

test('if the likes is absent, likes will be set to zero', async () => {
  const newBlog = {
    title: "Blog title",
    author: "Blog author",
    url: "Blog url"
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  
  const recentBlog = response.body[response.body.length - 1]

  expect(recentBlog.likes).toBe(0)
})

test('if the title is absent, while creating new blog, 400 bad request is sent', async () => {
  const newBlog = {
    author: "Blog author",
    url: "Blog url",
    likes: 3
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)

})

test('if the url is absent, while creating new blog, 400 bad request is sent', async () => {
  const newBlog = {
    title: "Blog title",
    author: "Blog author",
    likes: 3
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)

})

test.only('blog post should be removed when correct id is passed', async () => {
  const response = await api.get('/api/blogs')
  const blogToRemove = response.body[0]
  
  await api
    .delete(`/api/blogs/${blogToRemove.id}`)
    .expect(204)

  const blogsAtEnd = await api.get('/api/blogs')
  expect(blogsAtEnd.body).toHaveLength(testHelper.blogs.length - 1)
  expect(blogsAtEnd.body).not.toContainEqual(blogToRemove)
})