import { db } from '../../db'

export default defineEventHandler(() => {
  // Get total counts
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }
  const postCount = db.prepare('SELECT COUNT(*) as count FROM posts').get() as { count: number }
  const publishedPostCount = db.prepare('SELECT COUNT(*) as count FROM posts WHERE published = 1').get() as { count: number }
  const draftPostCount = db.prepare('SELECT COUNT(*) as count FROM posts WHERE published = 0').get() as { count: number }
  const todoCount = db.prepare('SELECT COUNT(*) as count FROM todos').get() as { count: number }
  const completedTodoCount = db.prepare('SELECT COUNT(*) as count FROM todos WHERE done = 1').get() as { count: number }
  const pendingTodoCount = db.prepare('SELECT COUNT(*) as count FROM todos WHERE done = 0').get() as { count: number }

  return {
    users: {
      total: userCount.count
    },
    posts: {
      total: postCount.count,
      published: publishedPostCount.count,
      draft: draftPostCount.count
    },
    todos: {
      total: todoCount.count,
      completed: completedTodoCount.count,
      pending: pendingTodoCount.count
    }
  }
})
