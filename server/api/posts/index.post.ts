import { db } from '../../db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.title || !body.content || !body.author_id) {
    throw createError({
      statusCode: 400,
      message: 'Title, content, and author_id are required'
    })
  }

  // Verify author exists
  const author = db.prepare('SELECT id FROM users WHERE id = ?').get(body.author_id)
  if (!author) {
    throw createError({
      statusCode: 404,
      message: 'Author not found'
    })
  }

  const published = body.published ? 1 : 0

  try {
    const result = db.prepare('INSERT INTO posts (title, content, author_id, published) VALUES (?, ?, ?, ?)').run(
      body.title,
      body.content,
      body.author_id,
      published
    )

    const newPost = db.prepare(`
      SELECT
        posts.*,
        users.name as author_name,
        users.email as author_email
      FROM posts
      INNER JOIN users ON posts.author_id = users.id
      WHERE posts.id = ?
    `).get(result.lastInsertRowid)

    return newPost
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to create post'
    })
  }
})
