<template>
    <div class="login-container">
        <div class="login-card">
            <h2>Cursos</h2>            
            <div>
                {{cursos}}
            </div>

        </div>
    </div>
</template>
<script>
import CursoService from '@/services/CursosService.js'
export default {
    data() {
        return {
            cursos:[]
        };          
    },
    mounted() {
        this.getCursos();
    },
    methods: {
        async getCursos(){
            const response=await CursoService.getCursos();
            this.categorias=response.data.data;
        }
    }
};
</script>
<style>

</style>