const listHelper = require('../utils/list_helper')
const testHelper = require('./test_helper')

test('dummy returns 1', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)

  expect(result).toBe(1)
})

describe('totalLikes', () => {

  test('of empty list is 0', () => {
    const blogs = []

    const result = listHelper.totalLikes(blogs)

    expect(result).toBe(0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const blog = testHelper.blog

    const result = listHelper.totalLikes(blog)

    expect(result).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    const blogs = testHelper.blogs

    const result = listHelper.totalLikes(blogs)

    expect(result).toBe(36)
  })

})

describe('favoriteBlog', () => {

  test('of empty list is null', () => {
    const blogs = []

    const result = listHelper.favoriteBlog(blogs)

    expect(result).toBe(null)
  })

  test('of one blog returns that blog', () => {
    const blog = testHelper.blog

    const result = listHelper.favoriteBlog(blog)

    const expectedResult = {
      title : 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5
    }

    expect(result).toEqual(expectedResult)
  })

  test('of a bigger list finds right one', () => {
    const blogs = testHelper.blogs

    const result = listHelper.favoriteBlog(blogs)

    const expectedResult = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12
    }

    expect(result).toEqual(expectedResult)
  })

})

describe('mostBlogs', () => {

  test('of zero blogs is null', () => {
    const blogs = []

    const result = listHelper.mostBlogs(blogs)

    expect(result).toBe(null)
  })

  test('of one blog returns that blog`s author and blogs: 1' , () => {
    const blog = testHelper.blog

    const result = listHelper.mostBlogs(blog)

    const expectedResult = {
      author: 'Edsger W. Dijkstra',
      blogs: 1
    }

    expect(result).toEqual(expectedResult)
  })

  test('of many blogs returns correct author with most blogs and quantity of his blogs', () => {
    const blogs = testHelper.blogs

    const result = listHelper.mostBlogs(blogs)

    const expectedResult = {
      author: "Robert C. Martin",
      blogs: 3
    }

    expect(result).toEqual(expectedResult)
  })

})

describe('mostLikes', () => {

  test('of zero blogs is null', () => {
    const blogs = []

    const result = listHelper.mostLikes(blogs)

    expect(result).toBe(null)
  })

  test('of one blog returns that blog`s author and appropriate like count', () => {
    const blog = testHelper.blog

    const result = listHelper.mostLikes(blog)

    const expectedResult = {
      author: 'Edsger W. Dijkstra',
      likes: 5
    }

    expect(result).toEqual(expectedResult)
  })

  test('of many blogs returns correct author with most likes and quantity of his likes', () => {
    const blogs = testHelper.blogs

    const result = listHelper.mostLikes(blogs)

    const expectedResult = {
      author: "Edsger W. Dijkstra",
      likes: 17
    }

    expect(result).toEqual(expectedResult)
  })


})