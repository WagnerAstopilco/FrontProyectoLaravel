<template>
    <div class="container">
        <div class="card p-4">
            <div class="head d-flex">
                <h1 class="fs-4">{{ name }}</h1>
                <Preloader :visible="cargando"></Preloader>
                <div class="dropdown ms-auto">
                    <button class="btn btn-black dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Opciones
                    </button>
                    <ul class="dropdown-menu">
                        <div v-if="material">
                        <li><a class="dropdown-item" href="#" @click="goToEditMaterial(material.id)">Editar</a></li>
                        <li><a class="dropdown-item" href="#" @click="deleteMaterial">Eliminar</a></li>
                        </div>
                    </ul>
                </div>            
            </div>
                <div v-if="material" >
                    <form @submit.prevent="updateMaterial" class="w-50">
                        <!-- <div class="form-group">
                            <label for="title">Título</label>
                            <input type="text" class="form-control" id="title" v-model="material.title" :readonly="!isEditing">
                        <label for="grade">Grado</label>
                        <select name="grade" v-model="material.grade" class="form-control p-2" disabled>
                            <option value="" disabled selected>---Selecciona un grado---</option>
                            <option value="leccion">Lección</option>
                            <option value="curso">Curso</option>
                        </select>
                        <div class="form-group" v-if="material.grado === 'lesson' && !material.lesson">
                            <label for="lesson">Selecciona una Lección</label>
                            <select name="lesson" v-model="material.lesson_id" class="form-control p-2" :disabled="!isEditing" required>
                                <option value="" disabled selected>{{lessonList? "---Selecciona una lección---":"---No hay lecciones disponibles---"}}</option>
                                <option v-for="lesson in lessons" :key="lesson.id" :value="lesson.id">
                                    {{ lesson.name }}
                                </option>
                            </select>
                        </div>
                        <label for="type">Tipo</label>
                        <select name="type" v-model="material.type" class="form-control p-2" :disabled="!isEditing">
                            <option value="" disabled selected>---Selecciona un tipo---</option>
                            <option value="file">Archivo</option>
                            <option value="link">Enlace</option>
                            <option value="video">Video</option>
                            <option value="pdf">PDF</option>
                        </select>
                        <label for="link">Link</label>
                        <input type="text" id="link" v-model="material.url" class="form-control p-2" placeholder="Enlace al material" :readonly="!isEditing">
                        
                        </div>
                        <div v-if="isEditing" class="d-flex gap-3">
                            <button type="submit" class="btn btn-cyan">{{ loading ? "Actualizando..." : "Actualizar" }}</button>
                            <button type="button" class="btn btn-blue" @click="cancelEdit">Cancelar</button>
                        </div> -->

                        <div class="form-group d-flex flex-column">
                            <label for="title">Titulo</label>
                            <input type="text" id="title" class="form-control p-2" v-model="material.title" placeholder="Titulo del material" :readonly="!isEditing"/>
                        </div>
                        <div class="form-group">
                            <label for="grado">Grado</label>
                            <select name="grado" v-model="material.grade" class="form-control p-2" :disabled="!isEditing">
                                <option value="" disabled selected>---Selecciona un grado---</option>
                                <option value="leccion">Lección</option>
                                <option value="curso">Curso</option>
                            </select>
                        </div>
                        <div class="form-group d-flex flex-column" v-if="material.grade!==originalGrade&&material.grade==='curso'">
                            <label for="title">Cursos</label>
                            <Multiselect 
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
                                track-by="id" class="">
                                <template #noOptions>
                                    <span class="text-gray-500">No hay cursos disponibles</span>
                                </template>
                                <template #noResult>
                                    <span class="text-gray-500"> No se encontraron coincidencias. </span>
                                </template>
                            </Multiselect>
                        </div>
                        <div class="form-group d-flex flex-column" v-if="material.grade!==originalGrade&&material.grade==='leccion'">
                            <label for="title">Curso</label>
                            <Multiselect 
                                v-model="course" 
                                :options="availableCourses" 
                                :searchable="true" 
                                openDirection="bottom"
                                placeholder="Selecciona el curso"
                                label="name_long"
                                selectLabel="Presiona enter para seleccionar"
                                selectedLabel="Seleccionado"
                                deselectLabel="Presiona enter para quitar"
                                track-by="id" 
                                @change="getAvailableLessons()">
                                <template #noOptions>
                                    <span class="text-gray-500">No hay cursos disponibles</span>
                                </template>
                                <template #noResult>
                                    <span class="text-gray-500"> No se encontraron coincidencias. </span>
                                </template>
                            </Multiselect>
                        </div>
                        <div class="form-group d-flex flex-column" v-if="material.grade==='leccion'&&course">
                            <label for="title">Lecciones del curso</label>
                            <Multiselect 
                                v-model="selectedLesson" 
                                :options="availableLessons" 
                                :searchable="true"                             
                                openDirection="bottom"
                                placeholder="Selecciona lección para agregar"
                                label="title"
                                selectLabel="Presiona enter para seleccionar"
                                selectedLabel="Seleccionado"
                                deselectLabel="Presiona enter para quitar"
                                track-by="id" class="">
                                <template #noOptions>
                                    <span class="text-gray-500">No hay lecciones disponibles</span>
                                </template>
                                <template #noResult>
                                    <span class="text-gray-500"> No se encontraron coincidencias. </span>
                                </template>
                            </Multiselect>
                        </div>
                        <div class="form-group">
                            <label for="type">Tipo</label>
                            <select name="type" v-model="material.type" class="form-control p-2" :disabled="!isEditing">
                                <option value="" disabled selected>---Selecciona un tipo---</option>
                                <option value="file">Archivo</option>
                                <option value="link">Enlace</option>
                                <option value="video">Video</option>
                                <option value="text">Texto</option>
                            </select>
                        </div>
                        <div class="form-group" v-if="material.type==='file'">
                            <label for="file">Archivo</label>
                            <input type="file" class="form-control" id="file" @change="handleFileUpload" :readonly="!isEditing">
                        </div>
                        <div class="form-group" v-if="material.type==='link'||material.type==='video'">
                            <label for="link">Link</label>
                            <input type="text" id="link" v-model="material.url" class="form-control p-2" placeholder="Enlace al material" :readonly="!isEditing"/>
                        </div>
                        <div class="form-group" v-if="material.type==='text'">
                            <label for="content">Contenido</label>
                            <textarea id="content" v-model="material.content" class="form-control p-2" placeholder="Contenido del material" :readonly="!isEditing"></textarea>
                        </div>
                        <p v-if="error" class="error">{{ error }}</p>     
                        <div v-if="isEditing" class="d-flex justify-content-center gap-3">
                            <button type="submit" class="btn btn-cyan">{{ loading ? "Actualizando..." : "Actualizar" }}</button>
                            <button type="button" class="btn btn-blue" @click="cancelEdit">Cancelar</button>
                        </div>
                    </form>
                    
                    <div class="materialLessons" v-if="material.grade==='leccion'&&material.lesson">
                        <h3>Lección</h3>
                        <div v-if="material.lesson">
                            <table id="materialLessonsTable" class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Título</th>
                                        <th>Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{{ material.lesson.title }}</td>
                                        <td><button>Cambiar</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div> 
                    </div>
                    
                    <div class="materialCourses" v-if="material.grade==='curso'&&material.courses.length>0">
                        <div class="d-flex align-items-center gap-3">
                            <h2 class="fs-5">Cursos</h2>
                            <button type="button" class="btn btn-green" @click="showFormCourseMaterial">Vincular Curso</button>
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
                                        <td >{{ course.name_long}}</td>
                                        <td>{{ course.category_id}}</td>
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
                    <button type="button" class="btn btn-blue" @click="goBack">Volver</button>
                </div>
        </div>
        </div>
</template>
<script>
import MaterialService from '@/services/MaterialsService.js';
import CourseService from '@/services/CoursesService.js';
import CourseMaterialService from '@/services/CourseMaterialService.js';
import ModuleService from '@/services/ModulesService.js';
import Preloader from '../../../components/Preloader.vue';
import $ from 'jquery';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-bs4';
import Multiselect from 'vue-multiselect';

export default {
    data() {
        return {
            name:'Detalles del Material',
            material: null,
            originalGrade:'',
            originalType:'',
            idmaterial: this.$route.params.idmaterial,
            courses: [], 
            filteredCourses: [],
            loading:"",
            newCourseMaterial:{
                order:'',
                material_id:'',
                course_id:'',
            },
            selectedCourse: null,
            availableCourses:[],
            selectedCourses:[],
            course:null,
            modulesToCourse:[],
            availableLessons:[],
            selectedLesson:null,
            isViewing: false,
            isEditing: false,
            error:'',
            cargando:false,
        };
    },
    mounted() {
        if (this.$route.name === 'MaterialDetalleVer') {
            this.isViewing = true;
        } else if (this.$route.name === 'MaterialDetalleEditar') {
            this.isEditing = true;
        };
        this.getMaterialDetails();
        this.getAvailableCourses();
    },
    beforeUnmount() {
        if ($.fn.dataTable.isDataTable('#materialCoursesTable')) {
            $('#materialCoursesTable').DataTable().destroy();
        }
    },
    watch: {
        course(newCourse) {
            if (newCourse) {
                this.getAvailableLessons();
            }
        },
    },

    components:{
        Preloader,
        Multiselect
    },
    methods: {
        async getMaterialDetails() {
            try{
                this.cargando=true;
                const response = await MaterialService.getMaterialDetails(this.idmaterial);
                this.material = response.data.data;
                this.originalGrade=this.material.grade;
                this.originalType=this.material.type;
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
        goBack() {
            this.$router.push({ name: 'Materiales' }); 
        },
        goToEditMaterial(id){
            this.isEditing = true;
            this.isViewing=false;
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
            const formData = new FormData();
            try            
            {
                this.loading = true;
                if(this.originalGrade==='curso'&&this.material.grade==='leccion'){
                    this.material.order_in_lesson=this.selectedLesson.materials.length+1;
                    this.material.lesson_id=this.selectedLesson.id;
                    formData.append("order_in_lesson", this.material.order_in_lesson);
                    formData.append("lesson_id", this.material.lesson_id);
                    formData.append("type", this.material.type);
                    for(let course of this.material.courses){
                        await CourseMaterialService.deleteCourseToMaterial(course.id);
                    }
                    if(this.originalType==='file'&&this.material.type!==this.originalType){
                        formData.append("_delete_file", "true");
                        if(this.material.type==='text'){
                            formData.append("content", this.material.content);
                            await MaterialService.patchMaterial(this.material.id,formData);
                        }
                        if(this.material.type==='link'||this.material.type==='video'){
                            formData.append("url", this.material.url);
                            await MaterialService.patchMaterial(this.material.id,formData);
                        }
                    } else if(this.originalType!=='file'&&this.material.type==='file'){
                        formData.append("type", this.material.type);
                        formData.append("url", null);
                        formData.append("content", null);
                        
                        formData.append("file", this.material.file);
                        await MaterialService.patchMaterial(this.material.id,formData);
                    }
                    else if(this.originalType!=='file'&&this.material.type!=='file'&&this.material.type!==this.originalType){
                        formData.append("type", this.material.type);
                        formData.append("file", null);
                        if(this.material.type==='text'){
                            formData.append("content", this.material.content);
                            await MaterialService.patchMaterial(this.material.id,formData);
                        }
                        if(this.material.type==='link'||this.material.type==='video'){
                            formData.append("url", this.material.url);
                            await MaterialService.patchMaterial(this.material.id,formData);
                        }
                    }                    
                    await MaterialService.patchMaterial(this.material.id,formData);
                    this.$router.push({name: 'MaterialDetalleVer',params: { idmaterial: this.material.id },});
                }else if(this.originalGrade==='leccion'&&this.material.grade==='curso'){
                    this.material.order_in_lesson="";
                    this.material.lesson_id="";
                    formData.append("type", this.material.type);
                    for(let course of this.material.courses){
                        await CourseMaterialService.deleteCourseToMaterial(course.id);
                    }
                    if(this.originalType==='file'&&this.material.type!==this.originalType){
                        formData.append("_delete_file", "true");
                        if(this.material.type==='text'){
                            formData.append("content", this.material.content);
                            await MaterialService.patchMaterial(this.material.id,formData);
                        }
                        if(this.material.type==='link'||this.material.type==='video'){
                            formData.append("url", this.material.url);
                            await MaterialService.patchMaterial(this.material.id,formData);
                        }
                    } else if(this.originalType!=='file'&&this.material.type==='file'){
                        formData.append("type", this.material.type);
                        formData.append("url", null);
                        formData.append("content", null);
                        
                        formData.append("file", this.material.file);
                        await MaterialService.patchMaterial(this.material.id,formData);
                    }
                    else if(this.originalType!=='file'&&this.material.type!=='file'&&this.material.type!==this.originalType){
                        formData.append("type", this.material.type);
                        formData.append("file", null);
                        if(this.material.type==='text'){
                            formData.append("content", this.material.content);
                            await MaterialService.patchMaterial(this.material.id,formData);
                        }
                        if(this.material.type==='link'||this.material.type==='video'){
                            formData.append("url", this.material.url);
                            await MaterialService.patchMaterial(this.material.id,formData);
                        }
                    }                    
                    await MaterialService.patchMaterial(this.material.id,formData);
                    this.$router.push({name: 'MaterialDetalleVer',params: { idmaterial: this.material.id },});
                }
                else{
                    await MaterialService.patchMaterial(this.material.id,formData);
                    this.isEditing = false;
                    this.$router.replace({name: 'MaterialDetalleVer',params: { idmaterial: this.material.id },});
                }
            }catch(err){
                if (err.response && err.response.data) {
        if (err.response.data.errors) {
            this.error = Object.values(err.response.data.errors).flat().join(" ");
        } else if (err.response.data.message) {
            this.error = err.response.data.message; // Captura errores generales del backend
        } else {
            this.error = "Error desconocido al actualizar el material.";
        }
    } else {
        this.error = "No se pudo conectar con el servidor.";
    }
            }     
            finally{
                this.loading=false;
            }
            
        },
        cancelEdit(){
            this.isEditing = false;
            this.isViewing=true;
            this.$router.push({ name: 'MaterialDetalleVer', params: { idmaterial: this.material.id } });
            this.getMaterialDetails();
            this.error='';
        },
        getImagenUrl(image) {
            if (image) {
                return process.env.VUE_APP_API_URL + "/storage/" + image; 
            }
        },
        async getAvailableCourses(){
            const response=await CourseService.getCourses();
            this.availableCourses=response.data.data;
        },
        async getAvailableLessons(){
            if(!this.course){
                alert("No se ha seleccionado ningun curso")
                return
            }
            try {
            let response = await CourseService.getCourseDetails(this.course.id);
            this.modulesToCourse = response.data.data.modules;
            for (let module of this.modulesToCourse) {
                response = await ModuleService.getModuleDetails(module.module_id);
                if (response.data.data.lessons) {
                    this.availableLessons.push(...response.data.data.lessons);
                }
            }
            } catch (error) {
                console.error("Error al obtener las lecciones:", error);
            }
        },
        handleFileUpload(event) {
            const file = event.target.files[0];  
            if (file) {
                this.newMaterial.file=file; 
            }
        },
    },
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
