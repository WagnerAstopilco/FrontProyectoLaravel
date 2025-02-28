<template>
    <div class="container">
        <div class="card p-4">
            <div class="head d-flex">
                <h1 class="fs-4">{{ name }}</h1>
                <Preloader :visible="cargando"></Preloader>
                <div class="dropdown ms-auto">
                    <button class="btn btn-danger dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Opciones
                    </button>
                    <ul class="dropdown-menu">
                        <div v-if="material">
                        <li><a class="dropdown-item" href="#" @click="editMaterial(material.id)">Editar</a></li>
                        <li><a class="dropdown-item" href="#" @click="deleteMaterial">Eliminar</a></li>
                        </div>
                    </ul>
                </div>            
            </div>
                <div v-if="material" >
                    <form @submit.prevent="updateMaterial" class="w-50">
                        <div class="form-group">
                        <label for="title">Título</label>
                        <input type="text" class="form-control" id="title" v-model="material.title" :readonly="!isEditing">
                        <label for="grado">Grado</label>
                        <select name="grado" v-model="material.grado" class="form-control p-2" :readonly="!isEditing">
                            <option value="" disabled selected>---Selecciona un grado---</option>
                            <option value="lesson">Lección</option>
                            <option value="course">Curso</option>
                        </select>
                        <div class="form-group" v-if="material.grado === 'lesson'">
                            <label for="lesson">Selecciona una Lección</label>
                            <select name="lesson" v-model="material.lesson_id" class="form-control p-2" :readonly="!isEditing" required>
                                <option value="" disabled selected>{{lessonList? "---Selecciona una lección---":"---No hay lecciones disponibles---"}}</option>
                                <option v-for="lesson in lessons" :key="lesson.id" :value="lesson.id">
                                    {{ lesson.name }}
                                </option>
                            </select>
                        </div>
                        <label for="type">Tipo</label>
                        <select name="type" v-model="material.type" class="form-control p-2" :readonly="!isEditing">
                            <option value="" disabled selected>---Selecciona un tipo---</option>
                            <option value="file">Archivo</option>
                            <option value="link">Enlace</option>
                            <option value="video">Video</option>
                            <option value="pdf">PDF</option>
                        </select>
                        <label for="link">Link</label>
                        <input type="text" id="link" v-model="material.url" class="form-control p-2" placeholder="Enlace al material" :readonly="!isEditing">
                        <label for="content">Contenido</label>
                        <input type="text" class="form-control" id="content" v-model="material.content" :readonly="!isEditing">
                  
                    </div>
                    <div v-if="isEditing ">
                        <button type="submit" class="btn btn-outline-warning m-2">{{ loading ? "Actualizando..." : "Actualizar" }}</button>
                        <button type="button" class="btn btn-outline-secondary m-2" @click="cancelEdit">Cancelar</button>
                    </div>
                    </form>
                    
                    <div class="materialLessons" v-if="material.grado==='lesson'">
                        <h3>Lección</h3>
                        <div v-if="material.lessons && material.lessons.length > 0">
                            <table id="materialLessonsTable" class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{{ material.lesson.name }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div> 
                        <div v-else>
                            <p>Sin lección vinculada</p>
                        </div>
                    </div>
                    
                    <div class="materialCourses" v-if="material.grado==='course'">
                        <div class="d-flex align-items-center">
                            <h2 class="fs-5">Cursos</h2>
                            <button type="button" class="btn btn-info m-4" @click="showFormCourseMaterial">Vincular Curso</button>
                        </div>
    
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
                        
                        <div v-if="material.courses && material.courses.length > 0">
                            <table id="materialCoursesTable" class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Imagen</th>
                                        <th>Nombre</th>
                                        <th>Categoría</th>
                                        <th>Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="course in material.courses" :key="course.id">
                                        <td><img :src="getImagenUrl(course.image)" class="card-img img-fluid" style="max-width: 150px; max-height: 100px;" alt="CursoImagen"/></td>
                                        <td>{{ course.name_long }}</td>
                                        <td >{{ course.category_id}}</td>
                                        <td><button type="button" class="btn btn-danger" @click="deleteCourseToMaterial(course.id)">Elinimar</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div> 
                        <div v-else>
                            <p>Sin cursos vinculados</p>
                        </div>
                    </div>                
                </div>
                <div v-else>
                    <p>Cargando...</p>
                </div> 
                <div class="d-flex justify-content-center">
                    <button type="button" class="btn btn-primary" @click="goBack">Volver</button>
                </div>
        </div>
        </div>
</template>
<script>
import MaterialService from '@/services/MaterialsService.js';
import CourseService from '@/services/CoursesService.js';
import Preloader from '../../../components/Preloader.vue';
import $ from 'jquery';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-bs4';

export default {
    data() {
        return {
            name:'Detalles del Material',
            material: null,
            showSearchBar: false,
            searchQuery: '', 
            idmaterial: this.$route.params.idmaterial,
            courses: [], 
            filteredCourses: [],
            loading:"",
            inputFocus:false,
            selectedCourse: null,
        };
    },
    mounted() {
        this.getMaterialDetails();
        this.getCourses(); 
    },
    beforeUnmount() {
        if ($.fn.dataTable.isDataTable('#materialCoursesTable')) {
            $('#materialCoursesTable').DataTable().destroy();
        }
    },
    components:{
        Preloader
    },
    methods: {
        async getMaterialDetails() {
            try{
                this.cargando=true;
                const response = await MaterialService.getMaterialDetails(this.idmaterial);
                this.material = response.data.data;
                this.$nextTick(() => {
                    if (this.material && this.material.courses && this.material.courses.length > 0) {
                            $('#materialCoursesTable').DataTable();  
                        }
                });
            }
            catch (error) {
                console.log(error);
            }finally{
                this.cargando=false;
            }
        },
        async getCourses() {
            const response = await CourseService.getCourses();
            this.courses = response.data.data;  
        },
        goBack() {
            this.$router.push({ name: 'Materiales' }); 
        },
        editMaterial(id){
            this.isEditing = true;
            this.$router.push({ name: 'MaterialDetalleEditar', params: { idmaterial: id } });
        },
        async deleteMaterial(){
            const confirmed = confirm('¿Estás seguro de que deseas eliminar este material?');
            if (confirmed) {
                try {
                    await MaterialService.deleteMaterial(this.material.id); 
                    this.$router.push({ name: 'Materiales' });
                } catch (error) {
                    alert('Hubo un error al intentar eliminar el material.');
                }
            }   
        },
        async updateMaterial() {
            try
            {
                this.loading = true;
                await MaterialService.patchMaterial(this.material.id, this.material);
                this.isEditing = false;
                this.$router.replace({name: 'MaterialDetalleVer',params: { idmaterial: this.material.id },});
            }catch(error){
                console.log(error);
            }     
            finally{
                this.loading=false;
            }
            
        },
        showFormCourseMaterial() {
            this.showSearchBar = !this.showSearchBar; 
        },
        async addCourseToMaterial(courseId){
            if (!courseId) {
            alert("Por favor, selecciona un curso antes de agregar.");
            return;
            }
            const isCourseAlreadyAdded = this.material.courses.some(course => course.id === courseId);
    
            if (isCourseAlreadyAdded) {
                alert("Este curso ya está vinculado a este material.");
                return; 
            }
            const materialId = this.$route.params.idmaterial; 
            try {
                this.loading = true;
                 await MaterialService.postCourseToMaterial(materialId,courseId);
                 this.getMaterialDetails(); 
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
        async deleteCourseToMaterial(courseId){
            const confirmed = confirm('¿Estás seguro de que deseas eliminar este curso de este material?');
            if (confirmed) {
                try {
                    const materialId = this.$route.params.idmaterial; 
                    await MaterialService.deleteCourseToMaterial(materialId,courseId); 
                    this.getMaterialDetails(); 
                } catch (error) {
                    alert('Hubo un error al intentar eliminar el curso.');
                }
            }   
        },
        cancelEdit(){
            this.isEditing = false;
            this.$router.push({ name: 'MaterialDetalleVer', params: { idmaterial: this.material.id } });
        },
        getImagenUrl(image) {
            if (image) {
                return process.env.VUE_APP_API_URL + "/storage/" + image; 
            }
        },
    },
}
</script>
<style scoped>
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