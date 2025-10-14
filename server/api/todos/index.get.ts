import { db } from '../../db'

export default defineEventHandler(() => {
  const todos = db.prepare('SELECT * FROM todos ORDER BY created_at DESC').all()
  return todos
})
