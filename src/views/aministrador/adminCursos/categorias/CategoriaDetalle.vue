<template>
    <div class="container">
    <div class="card p-4">
        <div class="head">
            <h1 class="fs-4">{{ name }}</h1>
            <Preloader :visible="cargando"></Preloader>
            <div class="dropdown ms-auto" >
                <button class="btn btn-danger dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Opciones 
                </button>
                <ul class="dropdown-menu" v-if="category">
                    <li class="dropdown-item" @click="editCategory(category.id)">Editar</li>
                    <li class="dropdown-item" @click="deleteCategory">Eliminar</li>
                </ul>
            </div>            
        </div>
        <card>
            <div v-if="category">
                <form @submit.prevent="updateCategory">
                    <div class="form-group">
                        <label for="name">Nombre</label>
                        <input type="text" class="form-control" id="name" v-model="category.name" :readonly="!isEditing">
                        <label for="name">Descripción</label>
                        <input type="text" class="form-control" id="name" v-model="category.description" :readonly="!isEditing">
                  
                    </div>
                    <div v-if="isEditing ">
                        <button type="submit" class="btn btn-outline-warning m-2" >Actualizar</button>
                        <button type="button" class="btn btn-outline-secondary m-2" @click="isEditing=false">Cancelar</button>
                    </div>
                </form>
                <div class="courses">
                    <h3>Cursos</h3>
                    <div v-if="category.courses && category.courses.length>0">
                        <table id="courseCategoryTable" class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Abreviación</th>
                                    <th>Descripción</th>
                                    <ht>Opciones</ht>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="course in category.courses" :key="course.id">
                                    <td @click="courseCategoryDetails(course.id)">{{ course.name_long }}</td>
                                    <td @click="courseCategoryDetails(course.id)">{{ course.name_short }}</td>
                                    <td @click="courseCategoryDetails(course.id)">{{ course.description }}</td>
                                    <td><button type="button" class="btn btn-danger" @click="deleteCourseToCategory()">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                        </svg> Elinimar</button></td>
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
</div>
</template>
<script>
import CategoryService from '@/services/CategoryService.js';
import Preloader from '../../../components/Preloader.vue';


export default {
    data() {
        return {
            name: 'Detalles de la Categoría',
            idcategoria:this.$route.params.idcategoria,
            cargando: false,
            category: null,
            isViewing: false,
            isEditing: false
        };
    },
    mounted() {
        if (this.$route.name === 'CategoriaDetalleVer') {
            this.isViewing = true;
        } else if (this.$route.name === 'CategoriaDetalleEditar') {
            this.isEditing = true;
        }
    },
    created() {
        this.getCategoryDetails();
    },
    components: {
        Preloader
    },
    methods: {
        async getCategoryDetails() {
            const id = this.$route.params.idcategoria; 
            const response = await CategoryService.getCategoryDetails(id);
            this.category = response.data.data;
            console.log(this.category)
        },
        goBack() {
            this.$router.push({ name: 'Categorias' }); 
        },
        courseCategoryDetails(id){
            this.$router.push({ name: 'CursoDetalle', params: { id: id } });
        },
        editCategory(id) {
            this.isEditing = true;
            this.$router.push({ name: 'CategoriaDetalleEditar', params: { idcategoria: id } });
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
        },
        async updateCategory() {
            const categoryId = this.$route.params.idcategoria;          
            if (categoryId) {
                await CategoryService.patchCategory(categoryId, this.category);
                console.log("actualizada", categoryId);
                this.isEditing = false;
                this.$router.replace({name: 'CategoriaDetalleVer',params: { idcategoria: categoryId },});
            }
        },
        deleteCourseToCategory(){

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
p{
    font-size: large;
    color:rgba(0, 0, 0, 0.808);
}
</style>