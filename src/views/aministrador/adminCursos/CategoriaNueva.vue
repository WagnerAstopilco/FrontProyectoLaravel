<template>
<div class="category-details">
        <div>
            <h2>Nueva Categoría</h2>
            <button type="button" class="btn btn-primary" @click="goBack">Volver</button>
        </div>
</div>
</template>
<script>
import CategoryService from '@/services/CategoryService.js';

export default {
    data() {
        return {
            category: null
        };
    },
    
    methods: {
        async getCategoryDetails() {
            const id = this.$route.params.id; 
            const response = await CategoryService.getCategoryDetails(id);
            this.category = response.data.data;
        },
        goBack() {
            this.$router.push({ name: 'Categorias' }); 
        }
    }
};
</script>
<style>
</style>