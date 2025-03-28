<template>
    <div class="container">
        <div class="card p-4">
            <div class="head d-flex">
                <h1 class="fs-4">{{ name }}</h1>
                <Preloader :visible="cargando"></Preloader>
                <div class="dropdown ms-auto" >
                    <button class="btn btn-black dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
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
                    <form @submit.prevent="updateModule()" class="w-50">
                        <div class="form-group">
                            <label for="name">Nombre</label>
                            <input type="text" class="form-control" id="name" v-model="module.name" :readonly="!isEditing">
                            <label for="description">Descripción</label>
                            <input type="text" class="form-control" id="description" v-model="module.description" :readonly="!isEditing">
                        </div>
                        <div v-if="isEditing ">
                        <button type="submit" class="btn btn-cyan m-2">{{ loading ? "Actualizando..." : "Actualizar" }}</button>
                        <button type="button" class="btn btn-black m-2" @click="cancelEdit">Cancelar</button>
                    </div>
                    </form>
                </div>
                <div class="moduleLessons">
                    <div class="d-flex align-items-center">
                        <h3 class="fs-4">Lecciones</h3>
                        <button type="button" class="btn btn-green m-4" @click="showFormLessonModule" data-bs-toggle="modal" data-bs-target="#newLessonModal">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                            </svg>
                            Nueva
                        </button> 
                        <!-- Modal -->
                        <div class="modal fade" id="newLessonModal" tabindex="-1" aria-labelledby="newLessonModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="newLessonModalLabel">Nueva Lección</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                ...
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="createLesson()">Crear</button>
                            </div>
                            </div>
                        </div>
                        </div>                       
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
                                        <button type="button" class="btn btn-succes" @click="lessonUp(module.lesson.order)">
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
                                        </button>
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
                        <button type="button" class="btn btn-blue m-4" @click="showSearchCourse=!showSearchCourse">Vincular Curso</button>
                    </div>
                    <form v-show="showSearchCourse" class="w-lg-50 w-md-60 w-100 mb-4" @submit.prevent="addCourseToModule()" >
                            <fieldset>
                                <multiselect 
                                    v-model="selectedCourses" 
                                    :options="availableCourses" 
                                    :multiple="true"
                                    :searchable="true" 
                                    openDirection="bottom"
                                    placeholder="Seleccionar cursos"
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
                                <button type="submit" class="btn m-2 btn-cyan" >{{this.loadingMaterial?'Agregando...':'Agregar'}}</button>
                                <button type="button" class="btn m-2 btn-black" @click="showSearchCourse=false">Cancelar</button>
                            </div>
                        </form>
                    
                    <div v-if="coursesToModule && coursesToModule.length > 0">
                        <table id="moduleCoursesTable" class="table table-striped">
                            <thead>
                                <tr>
                                    <th class="text-center">Orden</th>
                                    <th class="text-center">Imágen</th>
                                    <th class="text-center">Nombre</th>
                                    <th class="text-center">Descripción</th>
                                    <th class="text-center">Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="courseModule in coursesToModule" :key="courseModule.id">
                                    <td class="text-center">{{ courseModule.order }}</td>
                                    <td class="text-center"><img :src="getImagenUrl(courseModule.course.image)" class="card-img img-fluid" style="max-width: 150px; max-height: 100px;" alt="CursoImagen"/></td>
                                    <td>{{ courseModule.course.name_long }}</td>
                                    <td>{{ courseModule.course.description}}</td>
                                    <td class="text-center">
                                        <button type="button" class="btn btn-danger" @click="deleteCourseToModule(course.id)">Desvincular</button>
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
                <button type="button" class="btn btn-blue" @click="goBack()">Ver Módulos</button>
            </div>
        </div>  
    </div>
</template>
<script>
import ModuleService from '@/services/ModulesService.js';
import CourseService from '@/services/CoursesService.js';
import CourseModuleService from '@/services/CourseModuleService.js'
import Preloader from '../../../components/Preloader.vue';
import LessonService from '@/services/LessonsService.js';
import $ from 'jquery';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-bs4';
import Multiselect from "vue-multiselect";


export default {
    data(){
        return{
            name: 'Detalles del Módulo',
            cargando:false,
            idmodulo: this.$route.params.idmodulo,
            module: null,
            availableCourses: [], 
            selectedCourses:[],
            showSearchCourse:false,
            lesson:{
                title: '',
                description: '',
                order:'',
                course_id: '',
            },
            isViewing: false,
            isEditing: false,
            loading:false,
            coursesToModule:[],
        }
    },
    mounted() {        
        if (this.$route.name === 'ModuloDetalleVer') {
            this.isViewing = true;
        } else if (this.$route.name === 'ModuloDetalleEditar') {
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
        Preloader,
        Multiselect 
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
                this.getCoursesToModule();
                this.$nextTick(() => {
                    $('#moduleLessonsTable').DataTable({  
                    });
                    $('#moduleCoursesTable').DataTable();
                });           
            }catch(error){
                console.log(error);
            }finally{
                this.cargando=false;
            }            
        },
        async getCoursesToModule(){
            const allCourseModule=await CourseModuleService.getCourseModules();
            this.coursesToModule = allCourseModule.data.data.filter(courseModule => courseModule.module_id === this.module.id);
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
        showFormLessonModule() {
            this.showFormLesson = !this.showFormLesson; 
        },
        async getCourses() {
            const response = await CourseService.getCourses();
            this.availableCourses = response.data.data;  
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
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>