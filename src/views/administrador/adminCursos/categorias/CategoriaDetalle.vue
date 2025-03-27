<template>
    <div class="container">
    <div class="card p-md-4 p-0">
        <Preloader :visible="cargando"></Preloader>
        <div class="card-header d-flex align-items-center">
            <h1 class="fs-4">{{ name }}</h1>
            <div class="dropdown ms-auto" v-if="category">
                <button class="btn dropdown-toggle ms-auto btn-black" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Opciones 
                </button>
                <ul class="dropdown-menu">
                    <li class="dropdown-item" @click="goToEditCategory(category.id)">Editar</li>
                    <li class="dropdown-item" @click="deleteCategory">Eliminar</li>
                </ul>
            </div>            
        </div>
        <div class="card-body" v-if="category">
            <form @submit.prevent="updateCategory" class="w-md-50 w-100">
                <fieldset>
                    <div class="form-group">
                        <label for="name">Nombre</label>
                        <input type="text" class="form-control" id="name" v-model="category.name" :readonly="!isEditing">
                    </div>
                    <div class="form-group">
                        <label for="name">Descripción</label>
                        <input type="text" class="form-control" id="name" v-model="category.description" :readonly="!isEditing">
                    </div>
                    <div class="form-group">
                        <label for="color">Color</label>
                        <input type="color" class="form-control w-lg-30 w-md-40 w-20 p-0" id="color" v-model="category.color" :disabled="!isEditing">
                    </div>
                    <div v-show="error" class="error text-danger mt-2" role="alert">
                        <small>{{ error }}</small>
                    </div>
                </fieldset>
                <div v-show="isEditing ">
                    <button type="submit" class="btn m-2 btn-green">{{ loadingCategory ? "Actualizando..." : "Actualizar" }}</button>
                    <button type="button" class="btn m-2 btn-blue" @click="cancelEditCategory">Cancelar</button>
                </div>
            </form>
            <div>
                <div class="d-flex align-items-center">
                    <h2 class="fs-5">Cursos</h2>
                    <button class="btn btn-green m-4" @click="showSearchCourses=!showSearchCourses">Agregar</button>
                </div>
                <!-- buscador de cursos -->
                <form v-show="showSearchCourses" class="w-lg-50 w-md-60 w-100 mb-4" @submit.prevent="addCoursesToCategory" >
                    <fieldset>
                        <multiselect 
                            v-model="selectedCourses" 
                            :options="availableCourses" 
                            :multiple="true"
                            :searchable="true" 
                            openDirection="bottom"
                            placeholder="Selecciona cursos para agregar"
                            label="name_long"
                            selectLabel="Presiona enter para seleccionar"
                            selectedLabel="Seleccionado"
                            deselectLabel="Presiona enter para quitar"
                            track-by="id" class="mb-3">
                            <template #noOptions>
                                <span class="text-gray-500">No hay cursos disponibles</span>
                            </template>
                            <template #noResult>
                                <span class="text-gray-500"> No se encontraron coincidencias. </span>
                            </template>
                        </multiselect>
                    </fieldset>
                    <div>
                        <button type="submit" class="btn m-2 btn-cyan" >{{this.loadingCourse?'Agregando....':'Agregar'}}</button>
                        <button type="button" class="btn m-2 btn-black" @click="showSearchCourses=false">Cancelar</button>
                    </div>
                </form>
                <!-- tabla cursos de la categoria -->
                <div class="table-responsive" v-show="category.courses.length>0">
                    <table id="courseCategoryTable" class="table table-striped table-hover">
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
                                <td >{{ course.name_long }}</td>
                                <td>{{ course.name_short }}</td>
                                <td>{{ course.description }}</td>
                                <td><button type="button" class="btn btn-outline-danger mb-0 p-1" @click="goToEditCourse(course.id)">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                                        <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                                    </svg> Editar Curso</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div v-show="category.courses.length===0 && !showSearchCourses">
                    <p>Sin cursos en esta categoría</p>
                </div>
            </div>
        </div>
        <div class="card-footer mx-auto p-3">
            <button type="button" class="btn btn-blue" @click="goBack">Volver</button>
        </div>
    </div>
</div>
</template>
<script>
import CategoryService from '@/services/CategoryService.js';
import CourseService from '@/services/CoursesService.js';
import Preloader from '../../../components/Preloader.vue';
import $ from 'jquery';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-bs4';
import Multiselect from "vue-multiselect";


export default {
    data() {
        return {
            name: 'Detalles de la Categoría',
            idcategoria:this.$route.params.idcategoria,
            category: null,        
            loadingCategory:false,
            loadingCourse:false,
            cargando: false,
            isViewing: false,
            isEditing: false,
            error:'',
            showSearchCourses:false,
            availableCourses: [],
            selectedCourses:[],
        };
    },
    mounted() {
        if (this.$route.name === 'CategoriaDetalleVer') {
            this.isViewing = true;
        } else if (this.$route.name === 'CategoriaDetalleEditar') {
            this.isEditing = true;
        };
    },
    async created(){
        await this.getCategoryDetails();
    },
    beforeUnmount() {
        if ($.fn.dataTable && $.fn.dataTable.isDataTable('#courseCategoryTable')) {
            $('#courseCategoryTable').DataTable().clear().destroy();
        }
    },
    components: {
        Preloader,
        Multiselect
    },
    methods: {
        async getCategoryDetails() {
            try {
                this.cargando=true;                
                const response = await CategoryService.getCategoryDetails(this.idcategoria);
                this.category = response.data.data;                
                this.getAvailableCourses();
                this.$nextTick(() => {       
                    if ($.fn.dataTable.isDataTable('#courseCategoryTable')) {
                        $('#courseCategoryTable').DataTable().destroy();
                    }             
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
        goToEditCourse(id){
            this.$router.push({ name: 'CursoDetalleEditar', params: { idcurso: id } });
        },
        goToEditCategory() {
            this.isEditing = true;
            this.$router.push({ name: 'CategoriaDetalleEditar', params: { idcategoria: this.idcategoria } });
        },
        async updateCategory() {
            try {
                this.error = "";
                this.loading = true;
                await CategoryService.patchCategory(this.idcategoria, this.category);
                this.isEditing = false;
                this.$router.replace({name: 'CategoriaDetalleVer',params: { idcategoria: this.idcategoria },});
            }catch(err){
                this.error = Object.values(err.response.data.errors).flat().join(" ");
            }     
            finally{
                this.loading=false;
            }
        },
        async deleteCategory() {
            const confirmed = confirm('¿Estás seguro de que deseas eliminar esta categoría?');
            if (confirmed) {
                try {
                    await CategoryService.deleteCategory(this.idcategoria); 
                    this.$router.push({ name: 'Categorias' });
                } catch (error) {
                    alert('Hubo un error al intentar eliminar la categoría.');
                }
            }
        },
        cancelEditCategory(){
            this.isEditing = false;
            this.$router.push({ name: 'CategoriaDetalleVer', params: { idcategoria: this.idcategoria} });
            this.getCategoryDetails();
            this.error='';
        },
        async getAvailableCourses() {
            try {
                const response = await CourseService.getCourses();
                const allCourses = response.data.data;
                if (this.category && this.category.courses) {
                    const categoryCourseIds = this.category.courses.map(course => course.id);
                    this.availableCourses = allCourses.filter(course => !categoryCourseIds.includes(course.id));
                } else {
                    this.availableCourses = allCourses;
                }
            } catch (error) {
                console.log(error);
            }
        },
        async addCoursesToCategory(){
            try {
                const requestData = {
                    courses_ids: this.selectedCourses.map(course => course.id)
                };
                await CategoryService.postCoursesToCategory(this.idcategoria, requestData);
                this.selectedCourses = [];
                this.showSearchCourses=false;
                this.getCategoryDetails();
            } catch (error) {
                console.error("Error al agregar cursos:", error); 
            } finally {
                this.loadingCourse = false;
            }
        },
    }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
