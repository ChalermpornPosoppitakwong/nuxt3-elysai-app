import { db } from '../../db'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Post ID is required'
    })
  }

  const post = db.prepare(`
    SELECT
      posts.*,
      users.name as author_name,
      users.email as author_email
    FROM posts
    INNER JOIN users ON posts.author_id = users.id
    WHERE posts.id = ?
  `).get(id)

  if (!post) {
    throw createError({
      statusCode: 404,
      message: 'Post not found'
    })
  }

  return post
})
