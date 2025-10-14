import { db } from '../../db'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const status = query.status as string | undefined

  let sql = `
    SELECT
      posts.*,
      users.name as author_name,
      users.email as author_email
    FROM posts
    INNER JOIN users ON posts.author_id = users.id
  `

  const params: any[] = []

  if (status === 'published') {
    sql += ' WHERE posts.published = 1'
  } else if (status === 'draft') {
    sql += ' WHERE posts.published = 0'
  }

  sql += ' ORDER BY posts.created_at DESC'

  const posts = db.prepare(sql).all(...params)
  return posts
})
