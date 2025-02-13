<template>
    <div class="login-container">
        <div class="login-card">
            <h2>Login</h2>            
            <div>
                {{categorias}}
            </div>

        </div>
    </div>
</template>

<script>
import CursoService from '@/services/CursosService.js'
export default {
    data() {
        return {
            // email: '',
            // password: '',
            categorias:[]
        };          
    },
    mounted() {
        this.getsCategorias();
    },
    methods: {
        async getsCategorias(){
            const response=await CursoService.getCategorias();
            this.categorias=response.data.data;
        }
    }
};
</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5;
}

.login-card {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 300px;
    text-align: center;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
}

.form-group input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
}

button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
</style>