import { db } from '../../db'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Todo ID is required'
    })
  }

  const result = db.prepare('DELETE FROM todos WHERE id = ?').run(id)

  if (result.changes === 0) {
    throw createError({
      statusCode: 404,
      message: 'Todo not found'
    })
  }

  return { success: true, message: 'Todo deleted successfully' }
})
