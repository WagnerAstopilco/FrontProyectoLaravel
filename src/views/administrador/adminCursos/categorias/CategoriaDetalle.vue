<template>
    <div class="container">
    <div class="card p-4">
        <div class="head d-flex">
            <h1 class="fs-4">{{ name }}</h1>
            <Preloader :visible="cargando"></Preloader>
            <div class="dropdown ms-auto" >
                <button class="btn btn-info dropdown-toggle ms auto" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Opciones 
                </button>
                <ul class="dropdown-menu" v-if="category">
                    <li class="dropdown-item" @click="editCategory(category.id)">Editar</li>
                    <li class="dropdown-item" @click="deleteCategory">Eliminar</li>
                </ul>
            </div>            
        </div>
            <div v-if="category">
                <form @submit.prevent="updateCategory" class="w-50">
                    <div class="form-group">
                        <label for="name">Nombre</label>
                        <input type="text" class="form-control" id="name" v-model="category.name" :readonly="!isEditing">
                        <label for="name">Descripción</label>
                        <input type="text" class="form-control" id="name" v-model="category.description" :readonly="!isEditing">
                    </div>
                    <div v-if="isEditing ">
                        <button type="submit" class="btn btn-outline-warning m-2">{{ loading ? "Actualizando..." : "Actualizar" }}</button>
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
                                    <th>Opciones</th>
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
        <div class="volver mx-auto">
            <button type="button" class="btn btn-primary" @click="goBack">Volver</button>
        </div>
    </div>
</div>
</template>
<script>
import CategoryService from '@/services/CategoryService.js';
import Preloader from '../../../components/Preloader.vue';
import $ from 'jquery';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-bs4';



export default {
    data() {
        return {
            name: 'Detalles de la Categoría',
            idcategoria:this.$route.params.idcategoria,
            cargando: false,
            category: null,
            isViewing: false,
            isEditing: false,
            loading:false,
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
    beforeUnmount() {
        if ($.fn.dataTable.isDataTable('#categoryTable')) {
            $('#categoryTable').DataTable().destroy();
        }
    },
    components: {
        Preloader
    },
    methods: {
        async getCategoryDetails() {
            try {
                this.cargando=true;
                const id = this.$route.params.idcategoria; 
                const response = await CategoryService.getCategoryDetails(id);
                this.category = response.data.data;
                this.$nextTick(() => {
                if (this.category && this.category.courses && this.category.courses.length > 0) {
                        $('#courseCategoryTable').DataTable();  
                    }
                });
            } catch (error) {
                console.log(error);
                
            }finally{
                this.cargando=false
            }
        },
        goBack() {
            this.$router.push({ name: 'Categorias' }); 
        },
        editCourse(id){
            this.$router.push({ name: 'CursoDetalleEditar', params: { idcurso: id } });
        },
        editCategory(id) {
            this.isEditing = true;
            this.$router.push({ name: 'CategoriaDetalleEditar', params: { idcategoria: id } });
        },
        async updateCategory() {
            try
            {
                this.loading = true;
                await CategoryService.patchCategory(this.category.id, this.category);
                this.isEditing = false;
                this.$router.replace({name: 'CategoriaDetalleVer',params: { idcategoria: this.category.id },});
            }catch(error){
                console.log(error);
            }     
            finally{
                this.loading=false;
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
