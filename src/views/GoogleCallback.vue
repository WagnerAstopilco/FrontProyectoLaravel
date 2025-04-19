<script setup>
import { useRouter, useRoute } from 'vue-router'
import { onMounted } from 'vue'
import apiClient from '../axios'

const router = useRouter()
const route = useRoute()

onMounted(async () => {
    const token = route.query.token

    if (token) {
        localStorage.setItem('access_token', token)

        try {
        const response = await apiClient.get('/me', {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        })

        const user = response.data
        localStorage.setItem('user', JSON.stringify(user))

        if (user.role === 'alumno' || user.role === 'capacitador') {
            router.push({ name: 'Cursos' })
        } else {
            router.push({ name: 'Usuarios' })
        }
        } catch (err) {
        console.error('Error al obtener usuario:', err)
        router.push({ name: 'Signin' })
        }
    } else {
        router.push({ name: 'Signin' })
    }
})
</script>

<template>
    <div class="text-center">
        <p>Iniciando sesión con Google...</p>
    </div>
</template>
