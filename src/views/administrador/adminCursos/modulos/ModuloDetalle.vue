<template>
    <div class="container">
        <div class="card p-4">
            <div class="head d-flex">
                <h1 class="fs-4">{{ name }}</h1>
                <Preloader :visible="cargando"></Preloader>
                <div class="dropdown ms-auto" >
                    <button class="btn btn-danger dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Opciones
                    </button>
                    <ul class="dropdown-menu">
                        <div v-if="module">
                        <li><a class="dropdown-item" href="#" @click="editModule()">Editar</a></li>
                        <li><a class="dropdown-item" href="#" @click="deleteModule(module.id)">Eliminar</a></li>
                        </div>
                    </ul>
                </div>            
            </div>
            <div v-if="module">
                <div>
                    <form @submit.prevent="updateModule" class="w-50">
                        <div class="form-group">
                            <label for="name">Nombre</label>
                            <input type="text" class="form-control" id="name" v-model="module.name" :readonly="!isEditing">
                            <label for="order">Órden</label>
                            <input type="text" class="form-control" id="order" v-model="module.order" :readonly="!isEditing">
                            <label for="description">Descripción</label>
                            <input type="text" class="form-control" id="description" v-model="module.description" :readonly="!isEditing">
                        </div>
                        <div v-if="isEditing ">
                        <button type="submit" class="btn btn-outline-warning m-2">{{ loading ? "Actualizando..." : "Actualizar" }}</button>
                        <button type="button" class="btn btn-outline-secondary m-2" @click="cancelEdit">Cancelar</button>
                    </div>
                    </form>
                </div>
                <div class="moduleLessons">
                    <div class="d-flex align-items-center">
                        <h3 class="fs-4">Lecciones</h3>
                        <button type="button" class="btn btn-info m-4" @click="showFormLessonModule">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                            </svg>
                            Nueva
                        </button>                        
                    </div>
                    <div>
                        <form v-if="showFormLesson" @submit.prevent="addLessonToModule" class="w-50">
                            <div class="form-group ">
                                <label for="lessonTitle">Título</label>
                                <input type="text" class="form-control" id="lessonTitle" v-model="lesson.title">
                                <label for="description">Descripción</label>
                                <input type="text" class="form-control" id="description" v-model="lesson.description">
                            </div>
                            <div class="d-flex">
                                <button type="submit" class="btn btn-info m-2">{{ loading ? "Agregando..." : "Agregar" }}</button>
                                <button type="button" class="btn btn-warring m-2" @click="showFormLessonModule">Cancelar</button>
                            </div>
                        </form>
                    </div>
                    <div v-if="module.lessons && module.lessons.length > 0">
                        <table id="moduleLessonsTable" class="table table-striped">
                            <thead>
                                <tr> 
                                    <th>Órden</th>
                                    <th>Título</th>
                                    <th>Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="lesson in module.lessons" :key="lesson.id">
                                    <td>{{ lesson.order }}</td>
                                    <td>{{ lesson.title }}</td>
                                    <td>
                                        <!-- <button type="button" class="btn btn-succes" @click="lessonUp(module.lesson.order)">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-circle-fill" viewBox="0 0 16 16">
                                                <path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0m-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z"/>
                                            </svg>
                                            Subir uno
                                        </button>
                                        <button type="button" class="btn btn-danger" @click="lessonDown(module.lesson.order)">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-circle-fill" viewBox="0 0 16 16">
                                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z"/>
                                            </svg>
                                            Bajar uno
                                        </button> -->
                                        <button type="button" class="btn btn-info" @click="deleteLesson(lesson.id)">Eliminar</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div> 
                    <div v-else>
                        <p>Sin lecciones vinculadas</p>
                    </div>
                </div>
                <div class="moduleCourses">
                    <div class="d-flex align-items-center">
                        <h3 class="fs-4">Cursos</h3>
                        <button type="button" class="btn btn-info m-4" @click="showFormCourseModule">Vincular Curso</button>
                    </div>
                    <form class="courses-form d-flex w-60" v-if="showSearchBar" @submit.prevent="addModuleToCourse(selectedCourse?.id)">
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
                            <button type="button" id="button-cancel" class="btn btn-warring m-2" @click="showFormCourseModule">Cancelar</button>
                        </div>
                    </form>
                    
                    <div v-if="module.courses && module.courses.length > 0">
                        <table id="moduleCoursesTable" class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Imágen</th>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="course in module.courses" :key="course.id">
                                    <td><img :src="getImagenUrl(course.image)" class="card-img img-fluid" style="max-width: 150px; max-height: 100px;" alt="CursoImagen"/></td>
                                    <td>{{ course.name_long }}</td>
                                    <td>{{ course.description}}</td>
                                    <td>
                                        <button type="button" class="btn btn-danger" @click="deleteModuleToCourse(course.id)">Elinimar</button>
                                    </td>
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
                <button type="button" class="btn btn-primary" @click="goBack">Ver Módulos</button>
            </div>
        </div>  
    </div>
</template>
<script>
import ModuleService from '@/services/ModulesService.js';
import CourseService from '@/services/CoursesService.js';
import Preloader from '../../../components/Preloader.vue';
import LessonService from '@/services/LessonsService.js';
import $ from 'jquery';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-bs4';


export default {
    data(){
        return{
            name: 'Detalles del Módulo',
            cargando:false,
            idmodulo: this.$route.params.idmodulo,
            module: null,
            showSearchBar: false,
            showFormLesson: false,
            searchQuery: '', 
            courses: [], 
            filteredCourses: [],
            lesson:{
                title: '',
                description: '',
                order:'',
                course_id: '',
            },
            inputFocus:false,
            selectedCourse: null,
            isViewing: false,
            isEditing: false,
            loading:false,
        }
    },
    mounted() {        
        if (this.$route.name === 'CategoriaDetalleVer') {
            this.isViewing = true;
        } else if (this.$route.name === 'CategoriaDetalleEditar') {
            this.isEditing = true;
        }
    },
    created(){
        this.getModuleDetails();
        this.getCourses();
    },
    beforeUnmount() {
        if ($.fn.dataTable.isDataTable('#moduleLessonsTable')) {
            $('#moduleLessonsTable').DataTable().destroy();
        }
        if ($.fn.dataTable.isDataTable('#moduleCoursesTable')) {
            $('#moduleCoursesTable').DataTable().destroy();
        }
    },
    components:{
        Preloader
    },
    methods:{
        goBack(){
            this.$router.push({name:'Modulos'});
        },
        async getModuleDetails(){
            try{
                this.cargando=true;
                const response = await ModuleService.getModuleDetails(this.idmodulo);
                this.module = response.data.data;
                console.log(module);
                // this.$nextTick(() => {
                //     $('#moduleLessonsTable').DataTable({
                //         "ordering": false,
                //     });
                //     $('#moduleCoursesTable').DataTable();
                // });           
            }catch(error){
                console.log(error);
            }finally{
                this.cargando=false;
            }            
        },
        async deleteModule(id){
            const confirmed = confirm('¿Estás seguro de que deseas eliminar este módulo?');
            if (confirmed) {
                try {
                    await ModuleService.deleteModule(id); 
                    this.$router.push({ name: 'Modulos' });
                } catch (error) {
                    alert('Hubo un error al intentar eliminar el Módulo.');
                }
            }   
        },
        editModule(){
            this.isEditing = true;
            this.$router.push({ name: 'ModuloDetalleEditar', params: { idmodulo: this.idmodulo } });
        },
        async addModuleToCourse(courseId){
            if (!courseId) {
            alert("Por favor, selecciona un curso antes de agregar.");
            return;
            }
            const isCourseAlreadyAdded = this.module.courses.some(course => course.id === courseId);
    
            if (isCourseAlreadyAdded) {
                alert("Este curso ya está vinculado a este modulo.");
                return; 
            };
            try {
                this.loading = true;
                await ModuleService.postCourseToModule(this.idmodulo,courseId);
                this.getModuleDetails(); 
            } catch (error) {
                alert("Hubo un error al agregar el curso.");
            } finally {
                this.loading = false;
                this.showSearchBar = false;
            }          
        },
        showFormCourseModule() {
            this.showSearchBar = !this.showSearchBar; 
        },
        showFormLessonModule() {
            this.showFormLesson = !this.showFormLesson; 
        },
        async getCourses() {
            const response = await CourseService.getCourses();
            this.courses = response.data.data;  
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
        async deleteModuleToCourse(courseId){
            const confirmed = confirm('¿Estás seguro de que deseas eliminar este curso del módulo?');
        if (confirmed) {
                try {
                    await ModuleService.deleteCourseToModule(this.idmodulo,courseId); 
                    this.getModuleDetails(); 
                } catch (error) {
                    alert('Hubo un error al intentar eliminar el curso.');
                }
            }   
        },
        cancelEdit(){
            this.isEditing = false;
            this.$router.push({ name: 'ModuloDetalleVer', params: { idmodulo: this.idmodulo} });
        },
        async updateModule() {
            try
            {
                this.loading = true;
                await ModuleService.patchModule(this.idmodulo, this.module);
                this.$router.replace({name: 'ModuloDetalleVer',params: { idmodulo: this.idmodulo },});
            }catch(error){
                console.log(error);
            }     
            finally{
                this.loading=false;
                this.isEditing = false;
            }
        },
        getImagenUrl(imagen) {
            if (imagen) {
                return process.env.VUE_APP_API_URL + "/storage/" + imagen; 
            }
        },
        async addLessonToModule(){
            const isDuplicate = this.module.lessons.some(lesson => lesson.title === this.lesson.title);
            console.log(isDuplicate);
            if (isDuplicate) {
                alert('Ya existe una lección con este nombre. Por favor, elige otro.');
                return; 
            }
            if(this.module.lessons.length > 0){
                this.lesson.order = this.module.lessons.length + 1;
            }else{
                this.lesson.order = 1;
            }  
            this.lesson.module_id = this.idmodulo;
            try{
                this.loading = true;
                await LessonService.postLesson(this.lesson);
                this.getModuleDetails();
            }catch(error){
                console.log(error);
            }finally{
                this.loading = false;
                this.showFormLesson = false;                
            }
        },
        async deleteLesson(id){
            const confirmed = confirm('¿Estás seguro de que deseas eliminar esta lección?');
            const response= await LessonService.getLessonDetails(id);
            const orderlesson = response.data.data.order;
            if (confirmed) {
                try {                    
                    this.cargando=true;
                    await LessonService.deleteLesson(id); 
                    for (let lesson of this.module.lessons) {
                        if (lesson.order > orderlesson) {
                            lesson.order = lesson.order - 1;
                            await LessonService.patchLesson(lesson.id, lesson);
                        }
                    }
                    this.getModuleDetails();
                } catch (error) {
                    alert('Hubo un error al intentar eliminar la lección.');
                }finally{
                    this.cargando=false;
                }
            }   
        }

    }
};
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