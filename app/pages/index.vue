<script setup lang="ts">
interface Stats {
  users: { total: number }
  posts: { total: number; published: number; draft: number }
  todos: { total: number; completed: number; pending: number }
}

interface User {
  id: number
  name: string
  email: string
  created_at: string
}

interface Post {
  id: number
  title: string
  content: string
  author_id: number
  author_name: string
  published: boolean
  created_at: string
}

interface Todo {
  id: number
  title: string
  done: boolean
  created_at: string
}

// State
const stats = ref<Stats | null>(null)
const users = ref<User[]>([])
const posts = ref<Post[]>([])
const todos = ref<Todo[]>([])
const postFilter = ref<'all' | 'published' | 'draft'>('all')

// Forms
const newUser = ref({ name: '', email: '' })
const newPost = ref({ title: '', content: '', author_id: 1, published: false })
const newTodo = ref({ title: '' })

// Load data
async function loadStats() {
  const { data } = await useFetch<Stats>('/api/stats')
  if (data.value) stats.value = data.value
}

async function loadUsers() {
  const { data } = await useFetch<User[]>('/api/users')
  if (data.value) users.value = data.value
}

async function loadPosts() {
  const url = postFilter.value === 'all'
    ? '/api/posts'
    : `/api/posts?status=${postFilter.value}`
  const { data } = await useFetch<Post[]>(url)
  if (data.value) posts.value = data.value
}

async function loadTodos() {
  const { data } = await useFetch<Todo[]>('/api/todos')
  if (data.value) todos.value = data.value
}

async function refreshAll() {
  await Promise.all([loadStats(), loadUsers(), loadPosts(), loadTodos()])
}

// User actions
async function createUser() {
  if (!newUser.value.name || !newUser.value.email) return

  await $fetch('/api/users', {
    method: 'POST',
    body: newUser.value
  })

  newUser.value = { name: '', email: '' }
  await Promise.all([loadUsers(), loadStats()])
}

async function deleteUser(id: number) {
  await $fetch(`/api/users/${id}`, { method: 'DELETE' })
  await Promise.all([loadUsers(), loadStats()])
}

// Post actions
async function createPost() {
  if (!newPost.value.title || !newPost.value.content) return

  await $fetch('/api/posts', {
    method: 'POST',
    body: newPost.value
  })

  newPost.value = { title: '', content: '', author_id: 1, published: false }
  await Promise.all([loadPosts(), loadStats()])
}

// Todo actions
async function createTodo() {
  if (!newTodo.value.title) return

  await $fetch('/api/todos', {
    method: 'POST',
    body: newTodo.value
  })

  newTodo.value = { title: '' }
  await Promise.all([loadTodos(), loadStats()])
}

async function toggleTodo(id: number) {
  await $fetch(`/api/todos/${id}`, { method: 'PUT', body: {} })
  await Promise.all([loadTodos(), loadStats()])
}

async function deleteTodo(id: number) {
  await $fetch(`/api/todos/${id}`, { method: 'DELETE' })
  await Promise.all([loadTodos(), loadStats()])
}

// Watch filter changes
watch(postFilter, () => loadPosts())

// Initial load
onMounted(() => refreshAll())
</script>

<template>
  <div class="dashboard">
    <header class="header">
      <h1>Dashboard</h1>
      <button @click="refreshAll" class="btn-refresh">Refresh All</button>
    </header>

    <!-- Stats Cards -->
    <section class="stats-section" v-if="stats">
      <div class="stat-card">
        <h3>Users</h3>
        <div class="stat-number">{{ stats.users.total }}</div>
      </div>
      <div class="stat-card">
        <h3>Posts</h3>
        <div class="stat-number">{{ stats.posts.total }}</div>
        <div class="stat-detail">
          <span class="badge badge-success">{{ stats.posts.published }} Published</span>
          <span class="badge badge-warning">{{ stats.posts.draft }} Draft</span>
        </div>
      </div>
      <div class="stat-card">
        <h3>Todos</h3>
        <div class="stat-number">{{ stats.todos.total }}</div>
        <div class="stat-detail">
          <span class="badge badge-success">{{ stats.todos.completed }} Done</span>
          <span class="badge badge-info">{{ stats.todos.pending }} Pending</span>
        </div>
      </div>
    </section>

    <div class="grid">
      <!-- Users Section -->
      <section class="card">
        <h2>Users</h2>
        <form @submit.prevent="createUser" class="form">
          <input v-model="newUser.name" placeholder="Name" required class="input" />
          <input v-model="newUser.email" placeholder="Email" type="email" required class="input" />
          <button type="submit" class="btn btn-primary">Add User</button>
        </form>
        <div class="list">
          <div v-for="user in users" :key="user.id" class="list-item">
            <div>
              <div class="list-title">{{ user.name }}</div>
              <div class="list-subtitle">{{ user.email }}</div>
            </div>
            <button @click="deleteUser(user.id)" class="btn btn-danger btn-sm">Delete</button>
          </div>
        </div>
      </section>

      <!-- Posts Section -->
      <section class="card">
        <h2>Posts</h2>
        <div class="filter-tabs">
          <button
            @click="postFilter = 'all'"
            :class="['tab', { active: postFilter === 'all' }]"
          >
            All
          </button>
          <button
            @click="postFilter = 'published'"
            :class="['tab', { active: postFilter === 'published' }]"
          >
            Published
          </button>
          <button
            @click="postFilter = 'draft'"
            :class="['tab', { active: postFilter === 'draft' }]"
          >
            Draft
          </button>
        </div>
        <form @submit.prevent="createPost" class="form">
          <input v-model="newPost.title" placeholder="Title" required class="input" />
          <textarea v-model="newPost.content" placeholder="Content" required class="textarea"></textarea>
          <select v-model.number="newPost.author_id" class="input">
            <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
          </select>
          <label class="checkbox-label">
            <input v-model="newPost.published" type="checkbox" />
            <span>Published</span>
          </label>
          <button type="submit" class="btn btn-primary">Add Post</button>
        </form>
        <div class="list">
          <div v-for="post in posts" :key="post.id" class="list-item post-item">
            <div>
              <div class="list-title">
                {{ post.title }}
                <span v-if="post.published" class="badge badge-success">Published</span>
                <span v-else class="badge badge-warning">Draft</span>
              </div>
              <div class="list-subtitle">{{ post.content }}</div>
              <div class="list-meta">by {{ post.author_name }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Todos Section -->
      <section class="card">
        <h2>Todo List</h2>
        <form @submit.prevent="createTodo" class="form">
          <input v-model="newTodo.title" placeholder="New todo..." required class="input" />
          <button type="submit" class="btn btn-primary">Add Todo</button>
        </form>
        <div class="list">
          <div v-for="todo in todos" :key="todo.id" class="list-item todo-item">
            <label class="todo-checkbox">
              <input
                type="checkbox"
                :checked="todo.done"
                @change="toggleTodo(todo.id)"
              />
              <span :class="{ 'todo-done': todo.done }">{{ todo.title }}</span>
            </label>
            <button @click="deleteTodo(todo.id)" class="btn btn-danger btn-sm">Delete</button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2rem;
  color: #1a202c;
}

.btn-refresh {
  padding: 0.5rem 1rem;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.btn-refresh:hover {
  background: #3182ce;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-card h3 {
  font-size: 0.875rem;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.stat-detail {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-success {
  background: #c6f6d5;
  color: #22543d;
}

.badge-warning {
  background: #feebc8;
  color: #744210;
}

.badge-info {
  background: #bee3f8;
  color: #2c5282;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card h2 {
  font-size: 1.25rem;
  color: #1a202c;
  margin-bottom: 1rem;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tab {
  padding: 0.5rem 1rem;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.tab:hover {
  background: #edf2f7;
}

.tab.active {
  background: #4299e1;
  color: white;
  border-color: #4299e1;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.input,
.textarea {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.875rem;
}

.input:focus,
.textarea:focus {
  outline: none;
  border-color: #4299e1;
}

.textarea {
  resize: vertical;
  min-height: 80px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.btn {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary {
  background: #4299e1;
  color: white;
}

.btn-primary:hover {
  background: #3182ce;
}

.btn-danger {
  background: #fc8181;
  color: white;
}

.btn-danger:hover {
  background: #f56565;
}

.btn-sm {
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
  transition: all 0.2s;
}

.list-item:hover {
  background: #edf2f7;
}

.list-title {
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.25rem;
}

.list-subtitle {
  font-size: 0.875rem;
  color: #718096;
  margin-bottom: 0.25rem;
}

.list-meta {
  font-size: 0.75rem;
  color: #a0aec0;
}

.post-item {
  align-items: flex-start;
}

.todo-item {
  padding: 0.75rem 1rem;
}

.todo-checkbox {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  flex: 1;
}

.todo-checkbox input {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.todo-done {
  text-decoration: line-through;
  color: #a0aec0;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .dashboard {
    padding: 1rem;
  }
}
</style>
