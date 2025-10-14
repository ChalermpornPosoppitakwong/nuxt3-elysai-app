import { db } from '../../db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'User ID is required'
    })
  }

  if (!body.name || !body.email) {
    throw createError({
      statusCode: 400,
      message: 'Name and email are required'
    })
  }

  try {
    const result = db.prepare('UPDATE users SET name = ?, email = ? WHERE id = ?').run(body.name, body.email, id)

    if (result.changes === 0) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      })
    }

    const updatedUser = db.prepare('SELECT * FROM users WHERE id = ?').get(id)
    return updatedUser
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
