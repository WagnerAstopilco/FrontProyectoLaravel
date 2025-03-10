<template>
    <div class="container">
    <div class="card p-4">
        <div class="head d-flex">
            <h1 class="fs-4">{{ name }}</h1>
            <Preloader :visible="cargando"></Preloader>
            <div class="dropdown ms-auto" >
                <button class="btn btn-secondary dropdown-toggle ms auto p-2 m-2" style="background-color: rgb(29,29,27); color: white;" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Opciones 
                </button>
                <ul class="dropdown-menu" v-if="category">
                    <li class="dropdown-item" @click="editCategory(category.id)">Editar</li>
                    <li class="dropdown-item" @click="deleteCategory">Eliminar</li>
                </ul>
            </div>            
        </div>
            <div v-if="category">
                <form @submit.prevent="updateCategory" class="w-md-50 w-100">
                    <div class="form-group">
                        <label for="name">Nombre</label>
                        <input type="text" class="form-control" id="name" v-model="category.name" :readonly="!isEditing">
                        <label for="name">Descripción</label>
                        <input type="text" class="form-control" id="name" v-model="category.description" :readonly="!isEditing">
                    </div>
                    <div v-if="isEditing ">
                        <button type="submit" class="btn m-2 p-2" style="background-color:rgb(88,176,49);color:white">{{ loading ? "Actualizando..." : "Actualizar" }}</button>
                        <button type="button" class="btn m-2 p-2" style="background-color:rgb(0,87,163);color:white;" @click="cancelEdit">Cancelar</button>
                    </div>
                </form>
                <div class="courses" >
                    <div class="d-flex align-items-center m-3">
                        <h2 class="fs-5">Cursos</h2>
                        <button type="button" class="btn m-2 p-2 ms-4" style="background-color:rgb(88,176,49);color:white;" @click="showFormCourseMaterial">Agregar</button>
                    </div>
                    <div>
                        <form class="courses-form d-flex w-60" v-if="showSearchBar" @submit.prevent="addCourseToMaterial(selectedCourse?.id)">
                            <div class="form-group">
                                <div class="search-bar">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                                    </svg>
                                    <input v-model="searchQuery" type="text" class=" search-bar-input" placeholder="Buscar cursos..." @click="filterCourses" @input="filterCourses" @focus="inputFocus = true" @blur="handleBlur"/>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16" @click="reset">
                                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                                    </svg>
                                </div>
                                <div class="courses-container"  v-if="inputFocus && (filteredCourses.length > 0 || searchQuery)" >
                                    <ul class="coursesList">
                                        <li v-for="course in filteredCourses" :key="course.id" 
                                        @click="addCourseToInput(course)">
                                        {{ course.name_long }}
                                        </li>
                                        <li v-if="searchQuery && filteredCourses.length ===0">Sin resultados.</li>
                                    </ul>
                            </div> 
                            </div>
                            <div class="">
                                <button type="submit" class="btn btn-info m-2">{{ loading ? "Agregando..." : "Agregar" }}</button>
                                <button type="button" id="button-cancel" class="btn btn-warring m-2" @click="showFormCourseMaterial">Cancelar</button>
                            </div>
                        </form>
                    </div>
                    <div class="table-responsive" v-if="category.courses && category.courses.length>0" >
                        <table id="courseCategoryTable" class="table table-bordered">
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
                                    <td><button type="button" class="btn btn-outline-danger mb-0 p-1" @click="editCourse(course.id)">
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
        <div class="volver mx-auto p-3">
            <button type="button" class="btn btn-primary py-1" style="background-color:rgb(0,87,163);color:white;" @click="goBack">Volver</button>
        </div>
    </div>
</div>
</template>
<script>
import CategoryService from '@/services/CategoryService.js';
import CourseService from '@/services/CoursesService.js'
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
            showSearchBar:false,
            courses:[],
            courseModified:null,
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
        },
        async getCourses() {
            const response = await CourseService.getCourses();
            this.courses = response.data.data;
        },
        showFormCourseMaterial() {
            this.showSearchBar = !this.showSearchBar; 
        },
        async addCourseToMaterial(courseId){
            if (!courseId) {
            alert("Por favor, selecciona un curso antes de agregar.");
            return;
            }
            const isCourseAlreadyAdded = this.category.courses.some(course => course.id === courseId);
    
            if (isCourseAlreadyAdded) {
                alert("Este curso ya está vinculado a este material.");
                return; 
            }
            try {
                this.loading = true;
                const response =await CourseService.getCourseDetails(courseId);
                this.courseModified=response.data.data;
                this.courseModified.category_id=this.$route.params.idcategoria;
                await CourseService.patchCourse(this.courseModified.id,this.courseModified);
                this.getCategoryDetails();
            } catch (error) {
                alert("Hubo un error al agregar el curso.");
            } finally {
                this.loading = false;
                this.showSearchBar = false;
            }          
        },
        filterCourses() {
            if (this.searchQuery) {
                const results = this.courses.filter(course => 
                    course.name_long.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
                this.filteredCourses = results.length > 0 ? results : [];
            } else {
                this.filteredCourses = this.courses;
            }
        },

        reset(){
            this.filteredCourses=[];
            this.searchQuery="";
        },
        handleBlur() {
            setTimeout(() => {
                this.inputFocus = false;
            }, 200); 
        },
        addCourseToInput(course){
            this.selectedCourse = course; 
            this.searchQuery = course.name_long;
        },
    }
};
</script>
<style scoped>
table tbody tr:hover {
    background-color: rgb(29, 176, 215);
    color: white;
}

.search-bar{
    display: flex;
    flex-direction: row;
    align-items: center;
    border:3px solid rgb(19, 136, 103);
    border-radius: 10px;
    padding:5px;
}
.search-bar-input {
    background-color: transparent; 
    border: none; 
    outline: none; 
    padding: 8px 12px; 
    font-size: 16px;  
    color: #333;
    width: 100%;
}
.search-bar-input:focus {
    outline: none; 
}


.form-group {
    flex: 1;
    min-width: 250px;
    position: relative;
}

.search-bar {
    display: flex;
    align-items: center;
    border: 3px solid rgb(19, 136, 103);
    border-radius: 10px;
    padding: 5px;
    width: 100%;
}

.courses-container {
    position: absolute;
    top: 100%; 
    left: 0;
    width: 100%;
    background: white;
    border: 1px solid #ccc;
    max-height: 200px; 
}

.coursesList {
    list-style: none;
    padding: 0;
    margin: 0;
}

.coursesList li {
    padding: 8px;
    cursor: pointer;
}

.coursesList li:hover {
    background-color: #f1f1f1;
}

</style>
