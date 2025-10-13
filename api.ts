// ============================================
// api.ts (ไฟล์นี้อยู่ที่ project root)
// ============================================
import { Elysia } from 'elysia'

export default () => new Elysia()
  // Route ง่ายๆ
  .get('/hello', () => ({ 
    message: 'Hello world! dd' 
  }))
  
  // Route ที่รับ params
  .get('/users/:id', ({ params }) => ({
    id: params.id,
    name: 'John Doe',
    email: 'john@example.com'
  }))
  
  // POST route พร้อม validation
  .post('/users', ({ body }) => ({
    success: true,
    data: body
  }))
  
  // Route ที่ return error
  .get('/error', () => {
    throw new Error('Something went wrong!')
  })