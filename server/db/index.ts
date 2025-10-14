import Database from 'better-sqlite3'
import { join } from 'path'

const dbPath = join(process.cwd(), 'database.db')
export const db = new Database(dbPath)

// Enable foreign keys
db.pragma('foreign_keys = ON')

// Initialize database tables
export function initDatabase() {
  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Create posts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      author_id INTEGER NOT NULL,
      published BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `)

  // Create todos table
  db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      done BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Check if data already exists
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }

  if (userCount.count === 0) {
    // Seed initial data
    seedData()
  }
}

function seedData() {
  console.log('Seeding database with initial data...')

  // Insert users
  const insertUser = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)')
  const users = [
    { name: 'John Doe', email: 'john@example.com' },
    { name: 'Jane Smith', email: 'jane@example.com' },
    { name: 'Bob Johnson', email: 'bob@example.com' }
  ]

  for (const user of users) {
    insertUser.run(user.name, user.email)
  }

  // Insert posts
  const insertPost = db.prepare('INSERT INTO posts (title, content, author_id, published) VALUES (?, ?, ?, ?)')
  const posts = [
    { title: 'First Post', content: 'This is my first blog post!', author_id: 1, published: 1 },
    { title: 'Draft Article', content: 'Work in progress...', author_id: 1, published: 0 },
    { title: 'Hello World', content: 'Welcome to my blog!', author_id: 2, published: 1 },
    { title: 'TypeScript Tips', content: 'Some useful TypeScript tips and tricks', author_id: 2, published: 1 },
    { title: 'Upcoming Project', content: 'Details coming soon...', author_id: 3, published: 0 }
  ]

  for (const post of posts) {
    insertPost.run(post.title, post.content, post.author_id, post.published)
  }

  // Insert todos
  const insertTodo = db.prepare('INSERT INTO todos (title, done) VALUES (?, ?)')
  const todos = [
    { title: 'Setup database', done: 1 },
    { title: 'Create API routes', done: 0 },
    { title: 'Build frontend UI', done: 0 },
    { title: 'Write documentation', done: 0 }
  ]

  for (const todo of todos) {
    insertTodo.run(todo.title, todo.done)
  }

  console.log('Database seeded successfully!')
}

// Reset database function
export function resetDatabase() {
  console.log('Resetting database...')
  db.exec('DROP TABLE IF EXISTS todos')
  db.exec('DROP TABLE IF EXISTS posts')
  db.exec('DROP TABLE IF EXISTS users')
  initDatabase()
  console.log('Database reset complete!')
}

// Initialize on import
initDatabase()
