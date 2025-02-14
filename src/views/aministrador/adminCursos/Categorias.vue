<template>
    <div class="category-container">
        <div class="category-card">
            <h2>Categorias</h2>            
            <div>
                {{categorias}}
            </div>

        </div>
    </div>
</template>

<script>
import CursoService from '@/services/CategoryService.js'
export default {
    data() {
        return {
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

<style>

</style>