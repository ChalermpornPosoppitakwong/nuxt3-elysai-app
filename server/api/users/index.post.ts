import { db } from '../../db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.name || !body.email) {
    throw createError({
      statusCode: 400,
      message: 'Name and email are required'
    })
  }

  try {
    const result = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)').run(body.name, body.email)
    const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid)
    return newUser
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      throw createError({
        statusCode: 409,
        message: 'Email already exists'
      })
    }
    throw error
  }
})
