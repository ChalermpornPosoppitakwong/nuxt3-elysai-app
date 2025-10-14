import { db } from '../../db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Todo ID is required'
    })
  }

  // Get current todo
  const currentTodo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id) as any

  if (!currentTodo) {
    throw createError({
      statusCode: 404,
      message: 'Todo not found'
    })
  }

  // Toggle done status if no done value provided
  const done = body.done !== undefined ? (body.done ? 1 : 0) : (currentTodo.done ? 0 : 1)
  const title = body.title || currentTodo.title

  try {
    const result = db.prepare('UPDATE todos SET title = ?, done = ? WHERE id = ?').run(title, done, id)

    if (result.changes === 0) {
      throw createError({
        statusCode: 404,
        message: 'Todo not found'
      })
    }

    const updatedTodo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id)
    return updatedTodo
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to update todo'
    })
  }
})
