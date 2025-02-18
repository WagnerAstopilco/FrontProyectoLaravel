<template>
    <div class="category-details">
        <div class="head">
            <h2>Detalles del Curso</h2>
            <div class="dropdown">
                <button class="btn btn-danger dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Opciones
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#" >Editar</a></li>
                    <li><a class="dropdown-item" href="#">Eliminar</a></li>
                </ul>
            </div>            
        </div>
        <card>
            <div v-if="category">
                <div>
                    <p><strong>Nombre:</strong> {{ category.name }}</p>
                    <p><strong>Descripción:</strong> {{ category.description }}</p>
                </div>
                <div class="courses">
                    <h3>Cursos</h3>
                    <div v-if="category.courses">
                        <table>
                            <thead>
                                <tr>Nombre</tr>
                                <tr>Abreviación</tr>
                                <tr>Descripcion</tr>
                            </thead>
                            <tbody>
                                <tr v-for="course in category.courses" :key="course.id" @click="goToCourseDetail(course.id)">
                                    <td>{{ course.name_long }}</td>
                                    <td>{{ course.name_short }}</td>
                                    <td>{{ course.description }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div v-else>
                <p>Cargando...</p>
            </div>
        </card>
    </div>
    <div class="volver">
        <button type="button" class="btn btn-primary" @click="goBack">Volver</button>
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
        },
        goToCourseDetail(id){
            this.$router.push({ name: 'CusrsoDetalle', params: { id: id } });
        }
    }
};
</script>
<style>
#courseCategoryTable{
    justify-self: center;
    max-width: 95%;
}
.volver{
    justify-self: center;
}
.head{
    display: flex;
    justify-content: space-between;
}
</style>