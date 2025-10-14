สิ่งที่เพิ่มเข้ามา:
1. Database Setup (server/db/index.ts)

ใช้ better-sqlite3 เพื่อเชื่อมต่อ SQLite
สร้างไฟล์ database.db ใน root โปรเจกต์
สร้างตาราง 3 ตัว: users, posts, todos
มี seed data เริ่มต้นให้ทดสอบ
รองรับ foreign keys และ cascading delete

2. CRUD API Routes
✅ Users: GET all, GET by ID, POST, PUT, DELETE
✅ Posts: GET all (with filter), GET by ID, POST - รวมข้อมูล author
✅ Todos: GET all, POST, PUT (toggle done), DELETE
✅ Stats: Dashboard สรุปข้อมูลทั้งหมด
3. Frontend UI

Dashboard แสดงสถิติแบบ real-time
จัดการ Users พร้อมฟอร์มเพิ่ม/ลบ
จัดการ Posts พร้อมกรอง (published/draft)
Todo list พร้อม checkbox toggle
ดีไซน์สวยงาม responsive

วิธีใช้งาน:
bash# ติดตั้ง dependencies
bun add better-sqlite3
bun add -d @types/better-sqlite3

# รัน dev server (จะสร้าง database.db อัตโนมัติ)
bun run dev

# Reset database
bun run db:reset
เมื่อรัน dev server ไฟล์ database.db จะถูกสร้างขึ้นมาพร้อมข้อมูลตัวอย่าง! 🚀