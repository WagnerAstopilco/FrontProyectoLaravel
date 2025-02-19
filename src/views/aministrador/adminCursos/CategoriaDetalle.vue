<template>
    <div class="category-details">
        <div class="head-page">
            <h2>Detalles de la Categoría</h2>
            <div class="dropdown">
                <button class="btn btn-danger dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Opciones
                </button>
                <ul class="dropdown-menu">
                    <div v-if="category">
                    <li><a class="dropdown-item" href="#" @click="editCategory(category.id)">Editar</a></li>
                    <li><a class="dropdown-item" href="#" @click="deleteCategory">Eliminar</a></li>
                </div>
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
                    <div v-if="category.courses && category.courses.length>0">
                        <table id="courseCategoryTable" class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Abreviación</th>
                                    <th>Descripción</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="course in category.courses" :key="course.id" @click="courseCategoryDetails(course.id)">
                                    <td>{{ course.name_long }}</td>
                                    <td>{{ course.name_short }}</td>
                                    <td>{{ course.description }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-else>
                        <p>Sin cursos asignados</p>
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
    created() {
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
        courseCategoryDetails(id){
            this.$router.push({ name: 'CursoDetalle', params: { id: id } });
        },
        editCategory(id) {
        this.$router.push({ name: 'EditarCategoria', params: { id: id } });
        },
        async deleteCategory() {
            const confirmed = confirm('¿Estás seguro de que deseas eliminar esta categoría?');
            if (confirmed) {
                try {
                    await CategoryService.deleteCategory(this.category.id); 
                    this.$router.push({ name: 'Categorias' });
                } catch (error) {
                    alert('Hubo un error al intentar eliminar la categoría.');
                }
            }
        }
    }
};
</script>
<style scoped>
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
.head-page{
    display: flex;
    flex-direction: row;
    align-items: center;
}
.head-page .dropdown{
    margin-left:5%;
}
p{
    font-size: large;
    color:rgba(0, 0, 0, 0.808);
}
</style>