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
                        <button type="button" class="btn btn-outline-secondary m-2" @click="cancelEdit">Cancelar</button>
                    </div>
                </form>
                <div class="courses">
                    <h2 class="fs-5">Cursos</h2>
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
                                    <td>{{ course.name_long }}</td>
                                    <td>{{ course.name_short }}</td>
                                    <td>{{ course.description }}</td>
                                    <td><button type="button" class="btn btn-danger" @click="editCourse(course.id)">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                                            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                                        </svg> Editar Curso</button>
                                    </td>
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
        editCourse(id){
            this.$router.push({ name: 'EditarCurso', params: { id: id } });
        },
        editCategory(id) {
            this.isEditing = true;
            this.$router.push({ name: 'CategoriaDetalleEditar', params: { idcategoria: id } });
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
        cancelEdit(){
            this.isEditing = false;
            this.$router.push({ name: 'CategoriaDetalleVer', params: { idcategoria: this.category.id } });
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