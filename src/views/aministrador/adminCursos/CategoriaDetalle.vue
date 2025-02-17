<template>
    <div class="category-details">
        <div>
            <h2>Detalles de la Categoría</h2>
            <button type="button" class="btn btn-primary" @click="goBack">Volver</button>
        </div>
        <card>
            <div v-if="category">
                <div>
                    <h3>Datos</h3>
                    <p><strong>Nombre:</strong> {{ category.name }}</p>
                    <p><strong>Descripción:</strong> {{ category.description }}</p>
                </div>
                <div>
                    <table id="courseCategoryTable" class="table ">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                            </tr>
                        </thead>
                        <tbody >
                            <tr v-for="course in category.course" :key="course.id" > 
                                <td>{{ category.name }}</td>
                                <td>{{ category.description }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div v-else>
                <p>Cargando...</p>
            </div>
        </card>
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
    mounted() {
        this.getCategoryDetails();
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