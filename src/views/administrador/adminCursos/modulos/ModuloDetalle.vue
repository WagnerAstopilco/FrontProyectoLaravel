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
                        <li><a class="dropdown-item" href="#" @click="goToEditModule()">Editar</a></li>
                        <li><a class="dropdown-item" href="#" @click="deleteModule(module.id)">Eliminar</a></li>
                        </div>
                    </ul>
                </div>            
            </div>
            <div v-if="module">
                <div >
                    <form @submit.prevent="updateModule()" class="w-lg-50 w-md-70 w-100">
                        <div class="form-group">
                            <label for="name">Nombre</label>
                            <input type="text" class="form-control" id="name" v-model="module.name" :readonly="!isEditing">
                            <label for="description">Descripción</label>
                            <input type="text" class="form-control" id="description" v-model="module.description" :readonly="!isEditing">
                        </div>
                        <div v-if="isEditing ">
                            <button type="submit" class="btn btn-cyan m-2">{{ loading ? "Actualizando..." : "Actualizar" }}</button>
                            <button type="button" class="btn btn-black m-2" @click="cancelEditModule">Cancelar</button>
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
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="newLessonModalLabel">Nueva Lección</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <form @submit.prevent="addLessonToModule()">
                                    <div class="form-group">
                                        <label for="title">Título</label>
                                        <input type="text" class="form-control" id="title" v-model="lesson.title" placeholder="título de la lección">
                                        <label for="description">Descripción</label>
                                        <textarea id="description" class="form-control" v-model="lesson.description" placeholder="Descripción de la lección"></textarea>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-blue" data-bs-dismiss="modal">Cancelar</button>
                                        <button type="submit" class="btn btn-green" data-bs-dismiss="modal">Crear</button>
                                    </div>
                                </form>
                            </div>
                            </div>
                        </div>
                        </div>                       
                    </div>
                    <div v-if="module.lessons && module.lessons.length > 0">
                        <div class="table-responsive">
                            <table id="moduleLessonsTable" class="table table-striped">
                                <thead>
                                    <tr> 
                                        <th class="text-center">Órden</th>
                                        <th class="text-center">Título</th>
                                        <th class="text-center">Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="lesson in module.lessons" class="table-pointer" :key="lesson.id">
                                        <td @click="goToLessonDetails(lesson.id,this.module.id)" class="text-center">{{ lesson.order }}</td>
                                        <td @click="goToLessonDetails(lesson.id,this.module.id)">{{ lesson.title }}</td>
                                        <td class="d-flex justify-content-center gap-2">
                                            <button type="button" class="btn btn-success" @click="lessonUp(lesson.id)">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-circle-fill" viewBox="0 0 16 16">
                                                    <path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0m-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z"/>
                                                </svg>
                                                Subir
                                            </button>
                                            <button type="button" class="btn btn-info" @click="lessonDown(lesson.id)">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-circle-fill" viewBox="0 0 16 16">
                                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z"/>
                                                </svg>
                                                Bajar
                                            </button>
                                            <button type="button" class="btn btn-danger" @click="deleteLesson(lesson.id)">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                                                    <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                                                </svg>
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div> 
                    <div v-else>
                        <p>Sin lecciones vinculadas</p>
                    </div>
                </div>
                <div class="moduleCourses">
                    <div class="d-flex align-items-center">
                        <h3 class="fs-4">Cursos</h3>
                        <button type="button" class="btn btn-blue m-4" @click="showSearchCourse=!showSearchCourse">Vincular</button>
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
                                <button type="submit" class="btn m-2 btn-cyan" >{{this.loading?'Agregando...':'Agregar'}}</button>
                                <button type="button" class="btn m-2 btn-black" @click="showSearchCourse=false">Cancelar</button>
                            </div>
                        </form>
                    
                    <div v-if="coursesToModule && coursesToModule.length > 0">
                        <div class="table-responsive">
                            <table id="moduleCoursesTable" class="table table-striped">
                                <thead>
                                    <tr>
                                        <th class="text-center">Orden</th>
                                        <th class="text-center d-none d-md-table-cell">Imágen</th>
                                        <th class="text-center">Nombre</th>
                                        <th class="text-center d-none d-md-table-cell">Descripción</th>
                                        <th class="text-center">Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="courseModule in coursesToModule"  class="table-pointer" :key="courseModule.id">
                                        <td class="text-center">{{ courseModule.order }}</td>
                                        <td class="text-center d-none d-md-table-cell"><img :src="getImagenUrl(courseModule.course.image)" class="card-img img-fluid" style="max-width: 150px; max-height: 100px;" alt="CursoImagen"/></td>
                                        <td>{{ courseModule.course.name_long }}</td>
                                        <td class="d-none d-md-table-cell">{{ courseModule.course.description}}</td>
                                        <td class="text-center">
                                            <button type="button" class="btn btn-danger" @click="deleteCourseToModule(courseModule.id)">Desvincular</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div> 
                    <div v-else>
                        <p>Sin cursos vinculados</p>
                    </div>
                </div>                
            </div>
            <div v-else>
                <p>Cargando...</p>
            </div>
            <div class="d-flex justify-content-center p-3">
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
                state:'activo',
                module_id: '',
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
        async getModuleDetails(){
            try{
                this.cargando=true;
                const response = await ModuleService.getModuleDetails(this.idmodulo);
                this.module = response.data.data;
                this.getCoursesToModule();
                this.getAvailableCourses();
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
        async getAvailableCourses() {
            const response = await CourseService.getCourses();
            const allCourses = response.data.data;
            this.availableCourses = allCourses.filter(course => 
                !this.coursesToModule.some(courseModule => courseModule.course_id === course.id)
            );

            console.log("Cursos disponibles:", this.availableCourses);
        },
        async getCoursesToModule(){
            const allCourseModule=await CourseModuleService.getCourseModules();
            this.coursesToModule = allCourseModule.data.data.filter(courseModule => courseModule.module_id === this.module.id);
            console.log("cursos del modulo",this.coursesToModule);
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
        goBack(){
            this.$router.push({name:'Modulos'});
        },
        goToEditModule(){
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
        async addCourseToModule(){
                for(let course of this.selectedCourses){
                    let newCourseModule = {
                        module_id:this.module.id,
                        course_id:course.id,
                        order:course.modules.length+1
                    }
                    console.log("curso", newCourseModule);
                    await CourseModuleService.postCourseModule(newCourseModule);
                }
                this.selectedCourses = [];
                this.$router.push({name: 'ModuloDetalleVer',params: { idmodulo: this.idmodulo },});
        },
        async deleteCourseToModule(courseId){
            const confirmed = confirm('¿Estás seguro de que deseas eliminar este curso del módulo?');
        if (confirmed) {
                try {
                    await CourseModuleService.deleteCourseToModule(this.module.id,courseId); 
                    this.getModuleDetails(); 
                } catch (error) {
                    alert('Hubo un error al intentar eliminar el curso.');
                }
            }   
        },
        cancelEditModule(){
            this.isEditing = false;
            this.$router.push({ name: 'ModuloDetalleVer', params: { idmodulo: this.idmodulo} });
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
            this.lesson.module_id = this.module.id;
            try{
                this.loading = true;
                console.log(this.lesson);
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
        },
        async lessonUp(lessonId) {
            try {
                this.cargando=true;
                const { data } = await LessonService.getLessonDetails(lessonId);
                const lessonToUp = data.data;

                if (lessonToUp.order === 1) {
                    alert("Esta lección ya tiene N° de orden 1");
                    return;
                }
                const { data: lessonsData } = await LessonService.getLessons();
                const lessonToDown = lessonsData.data.find(lesson => lesson.order === (lessonToUp.order - 1));
                await LessonService.patchLesson(lessonToDown.id, { order: lessonToUp.order });
                await LessonService.patchLesson(lessonToUp.id, { order: lessonToUp.order - 1 });

                this.getModuleDetails();
            } catch (error) {
                console.error("Error en lessonUp:", error);
            }finally{
                this.cargando=false;
            }
        },
        async lessonDown(lessonId) {
            try {
                this.cargando = true;
                const { data } = await LessonService.getLessonDetails(lessonId);
                const lessonToDown = data.data;
                const { data: lessonsData } = await LessonService.getLessons();
                const allLessons = lessonsData.data;
                const maxOrder = Math.max(...allLessons.map(l => l.order));
                if (lessonToDown.order === maxOrder) {
                    alert("Esta lección ya tiene el último N° de orden");
                    return;
                }
                const lessonToUp = allLessons.find(lesson => lesson.order === (lessonToDown.order + 1));
                await LessonService.patchLesson(lessonToUp.id, { order: lessonToDown.order });
                await LessonService.patchLesson(lessonToDown.id, { order: lessonToDown.order + 1 });

                this.getModuleDetails();
            } catch (error) {
                console.error("Error en lessonDown:", error);
            } finally {
                this.cargando = false;
            }
        },
        goToLessonDetails(lessonId,moduleId){
            this.$router.push({ name: 'LeccionDetallesVer', params: { idleccion: lessonId ,idmodulo:moduleId} });
        }
    }
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>