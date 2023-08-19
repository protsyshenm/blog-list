const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const testHelper = require('./test_helper')

beforeEach(async () => {
  await User.deleteMany({})

  const userObjects = testHelper.users.map(user => new User(user))
  const promiseArray = userObjects.map(user => user.save())
  await Promise.all(promiseArray)
})

test('all users should be returned', async () => {
  const response = await api.get('/api/users')
  expect(response.body).toHaveLength(testHelper.users.length)
})

test('user with valid unique username and valid password should be created', async () => {
  const newUser = {
    username: 'UncleBob',
    name: 'Robert Martin',
    password: 'SomePass'
  }
  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/users')

  const users = response.body.map(user => {
    return {
      username: user.username,
      name: user.name
    }
  })

  delete newUser.password

  expect(response.body).toHaveLength(testHelper.users.length + 1)
  expect(users).toContainEqual(newUser)
})

test.only('user with valid not unique username and valid password should not be created', async () => {
  const newUser = {
    username: 'jdoe',
    name: 'Robert Martin',
    password: 'SomePass'
  }
  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/users')

  const users = response.body.map(user => {
    return {
      username: user.username,
      name: user.name
    }
  })

  delete newUser.password

  expect(response.body).toHaveLength(testHelper.users.length)
  expect(users).not.toContainEqual(newUser)
})

test('user with invalid username and valid password should not be created', async () => {
  const newUser = {
    username: 'Un',
    name: 'Robert Martin',
    password: 'SomePass'
  }
  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  const response = await api.get('/api/users')

  const users = response.body.map(user => {
    return {
      username: user.username,
      name: user.name
    }
  })

  delete newUser.password

  expect(response.body).toHaveLength(testHelper.users.length)
  expect(users).not.toContainEqual(newUser)
})

test('user with valid username and invalid password should not be created', async () => {
  const newUser = {
    username: 'UncleBob',
    name: 'Robert Martin',
    password: 'So'
  }
  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  const response = await api.get('/api/users')

  const users = response.body.map(user => {
    return {
      username: user.username,
      name: user.name
    }
  })

  delete newUser.password

  expect(response.body).toHaveLength(testHelper.users.length)
  expect(users).not.toContainEqual(newUser)
})