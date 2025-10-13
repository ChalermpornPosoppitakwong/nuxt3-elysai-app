
<script setup lang="ts">
const { $api } = useNuxtApp()

// Reactive data
const helloData = ref<{ message: string } | null>(null)
const userData = ref<{ id: string; name: string; email: string } | null>(null)
const postResult = ref<{ success: boolean; data: unknown } | null>(null)

// ตัวอย่างที่ 1: Simple GET
async function fetchHello() {
  const { data, error } = await $api.hello.get()
  if (error) {
    console.error('Error:', error)
    return
  }
  helloData.value = data
}

// ตัวอย่างที่ 2: GET with params
async function fetchUser() {
  const { data, error } = await $api.users({ id: '123' }).get()
  if (error) {
    console.error('Error:', error)
    return
  }
  userData.value = data
}

// ตัวอย่างที่ 3: POST request
async function createUser() {
  const { data, error } = await $api.users.post({
    name: 'Jane Doe',
    email: 'jane@example.com',
    age: 25
  })
  if (error) {
    console.error('Error:', error)
    return
  }
  postResult.value = data
}

// ตัวอย่างที่ 4: useAsyncData (สำหรับ SSR)
const { data: asyncData } = await useAsyncData(async () => {
  const { data, error } = await $api.hello.get()
  if (error) {
    throw new Error('Failed to call API')
  }
  return data
})
</script>
<template>
  <div class="container">
    <h1>Elysia + Nuxt Demo</h1>
    
    <!-- ตัวอย่างที่ 1: GET request -->
    <section>
      <h2>1. Simple GET Request</h2>
      <button @click="fetchHello">Fetch Hello</button>
      <p v-if="helloData">{{ helloData.message }}</p>
    </section>

    <!-- ตัวอย่างที่ 2: GET with params -->
    <section>
      <h2>2. GET with Params</h2>
      <button @click="fetchUser">Fetch User #123</button>
      <pre v-if="userData">{{ userData }}</pre>
    </section>

    <!-- ตัวอย่างที่ 3: POST request -->
    <section>
      <h2>3. POST Request</h2>
      <button @click="createUser">Create User</button>
      <pre v-if="postResult">{{ postResult }}</pre>
    </section>

    <!-- ตัวอย่างที่ 4: useAsyncData -->
    <section>
      <h2>4. Using useAsyncData</h2>
      <p v-if="asyncData">{{ asyncData.message }}</p>
    </section>
  </div>
</template>


<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

section {
  margin: 2rem 0;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

button {
  padding: 0.5rem 1rem;
  background: #0070f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #0051cc;
}

pre {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
}
</style>
