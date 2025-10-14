import { db } from '../../db'

export default defineEventHandler(() => {
  const users = db.prepare('SELECT * FROM users ORDER BY created_at DESC').all()
  return users
})
