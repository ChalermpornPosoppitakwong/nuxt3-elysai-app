import { db } from '../../db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.title) {
    throw createError({
      statusCode: 400,
      message: 'Title is required'
    })
  }

  const done = body.done ? 1 : 0

  try {
    const result = db.prepare('INSERT INTO todos (title, done) VALUES (?, ?)').run(body.title, done)
    const newTodo = db.prepare('SELECT * FROM todos WHERE id = ?').get(result.lastInsertRowid)
    return newTodo
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to create todo'
    })
  }
})
