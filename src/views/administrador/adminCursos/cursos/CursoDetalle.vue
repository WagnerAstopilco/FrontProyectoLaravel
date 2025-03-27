<template>
    <div class="container">
        <div class="card p-4">
            <Preloader :visible="cargando"></Preloader>
            <div class="card-header d-flex pb-0">
                <h1 class="fs-4">{{ name }}</h1>
                <div class="dropdown ms-auto">
                    <button class="btn btn-secondary dropdown-toggle btn-black" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Opciones
                    </button>
                    <ul class="dropdown-menu">
                        <div v-if="course">
                        <li><a class="dropdown-item" @click="editCourse()">Editar</a></li>
                        <li><a class="dropdown-item" @click="deleteCourse">Eliminar</a></li>
                        </div>
                    </ul>
                </div>            
            </div>
            <div v-if="course" class="card-body">
                <!-- datos del curso -->
                <div class="container d-flex flex-md-row flex-column justify-content-between mb-3">
                    <div class="w-md-50 w-100">
                        <form @submit.prevent="updateCourse">
                            <div class="form-group">
                                <label for="start_date_course">Fecha de inicio</label>
                                <input type="date" class="form-control" id="start_date_course" v-model="course.start_date" :readonly="!isEditing"/>
                            </div>
                            <div class="form-group">
                                <label for="end_date_course">Fecha de fin</label>
                                <input type="date" class="form-control p-2" id="end_date_course" v-model="course.end_date" :readonly="!isEditing"/>
                            </div>
                            <div class="form-group">
                                <label for="name_long">Nombre</label>
                                <input type="text" class="form-control" id="name_long" v-model="course.name_long" :readonly="!isEditing">
                                <label for="name_short">Abreviación</label>
                                <input type="text" class="form-control" id="name_short" v-model="course.name_short" :readonly="!isEditing">
                                <label for="duration_in_hours">Duración</label>
                                <input type="text" class="form-control" id="duration_in_hours" v-model="course.duration_in_hours" :readonly="!isEditing">
                                <label for="category">Categoria</label>
                                <select name="category" class="form-control p-2" v-model="course.category_id" :readonly="!isEditing">
                                    <option value="" disabled selected>---Selecciona una Categoría---</option>
                                    <option v-for="category in categories" :key="category.id" :value="category.id">
                                        {{ category.name }}
                                    </option>
                                </select>
                                <label for="price">Precio</label>
                                <input type="number" class="form-control" id="price" v-model="course.price" :readonly="!isEditing">
                                <label for="discount">Descuento</label>
                                <input type="number" class="form-control" id="discount" v-model="course.discount" :readonly="!isEditing">
                                <label for="store">Tienda</label>
                                <input type="text" class="form-control p-2" id="store" v-model="course.store_id" placeholder="Tienda" :readonly="!isEditing">
                                <label for="name">Descripción</label>
                                <input type="text" class="form-control" id="name" v-model="course.description" :readonly="!isEditing">
                                <div v-if="isEditing">
                                    <label for="image">Imagen</label>
                                    <input type="file" class="form-control" id="image" @change="handleImageUpload">
                                    <div v-if="imagePreview">
                                        <img :src="imagePreview" alt="Vista previa" class="img-fluid mt-2" />
                                    </div>
                                </div>
                            </div>
                            <div v-if="error" class="error text-danger mt-2" role="alert">
                                <small>{{ error }}</small>
                            </div>
                            <div v-if="isEditing ">
                                <button type="submit" class="btn btn m-2" style="background-color:rgb(88,176,49);color:white">{{ loading ? "Actualizando..." : "Actualizar" }}</button>
                                <button type="button" class="btn btn m-2" style="background-color:rgb(0,87,163);color:white;" @click="cancelEdit">Cancelar</button>
                            </div>
                        </form>                        
                    </div>
                    <div class="w-lg-50 w-md-50 w-100 p-md-4 p-0" v-if="isViewing">
                        <label class="d-md-none">Imagen del curso</label>
                        <img :src="getImagenUrl(course.image)" class="card-img mb-3" alt="CursoImagen"/>
                    </div>
                </div>
                <!-- capacitadores -->
                <section class="mb-3">
                    <div class="d-flex ">
                        <h3>Capacitadores</h3>
                        <button class="btn btn-green ms-3" @click="showSearchTrainers=!showSearchTrainers">Vincular</button>
                    </div>
                    <form v-show="showSearchTrainers" class="w-lg-50 w-md-60 w-100 mb-4" @submit.prevent="addTrainersToCourse" >
                        <fieldset>
                            <Multiselect 
                                v-model="selectedTrainers" 
                                :options="availableTrainers" 
                                :multiple="true"
                                :searchable="true" 
                                :custom-label="fullName" 
                                openDirection="bottom"
                                placeholder="Seleccionar capacitadores"
                                label="names"
                                selectLabel="Presiona enter para seleccionar"
                                selectedLabel="Seleccionado"
                                deselectLabel="Presiona enter para quitar"
                                track-by="id" class="mb-3">
                                <template #noOptions>
                                    <span class="text-gray-500">No hay capacitadores disponibles</span>
                                </template>
                                <template #noResult>
                                    <span class="text-gray-500"> No se encontraron coincidencias. </span>
                                </template>
                            </Multiselect>
                        </fieldset>
                        <div>
                            <button type="submit" class="btn m-2 btn-cyan" >{{this.loadingTrainer?'Agregando...':'Agregar'}}</button>
                            <button type="button" class="btn m-2 btn-black" @click="showSearchTrainers=false">Cancelar</button>
                        </div>
                    </form>                    
                    <div v-if="course.trainers.length > 0" class="table-responsive">
                        <table id="courseTrainersTable" class="table table-striped table-hover table-bordered">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Apellidos</th>
                                    <td>Opciones</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="trainer in trainers" :key="trainer.id">
                                    <td>{{ trainer.user.names }}</td>
                                    <td>{{ trainer.user.last_names }}</td>
                                    <td><button type="button" class="btn btn-outline-danger" @click="deleteTrainerToCourse(trainer.id)">Elinimar</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div> 
                    <div v-if="course.trainers.length===0&&!showSearchTrainers">
                        <p>Sin capacitadores en el curso</p>
                    </div>
                </section>
                <!-- modulos -->
                <section class="mb-3">
                    <div class="d-flex gap-md-3 gap-2">
                        <h3>Modulos</h3>
                        <button type="button" class="btn btn-blue" data-bs-toggle="modal" data-bs-target="#newModule">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                            </svg>
                            Nuevo
                        </button>
                        <button class="btn btn-green" @click="showNewModule=false;showSearchModule=!showSearchModule;">Vincular</button>
                    </div>
                    <!-- modal nuevo modulo -->
                    <div class="modal fade" id="newModule" tabindex="-1" aria-labelledby="newModuleLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="newModuleLabel">Nuevo módulo</h1>
                                    <button type="button" class="btn-close btn-black" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <form @submit.prevent="createNewModule">
                                        <fieldset>
                                            <div class="form-group">
                                                <label for="name">Nombre</label>
                                                <input type="text" class="form-control" id="name" v-model="newModule.name" placeholder="Nombre del módulo"/>
                                            </div>
                                            <div class="form-group">
                                                <label for="description">Fecha de inicio</label>
                                                <textarea id="description" class="form-control p-2" v-model="newModule.description" placeholder="Descripción del módulo"></textarea> 
                                            </div>
                                        </fieldset>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-cyan" @click="createNewModule">{{loadingModule?'Creando...':'Crear'}}</button>
                                            <button type="button" class="btn btn-black" data-bs-dismiss="modal">Cerrar</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- fin modal nuevo modulo -->
                    
                    <!-- agregar modulo -->
                    <div>
                        <form v-show="showSearchModule" class="w-lg-50 w-md-60 w-100" @submit.prevent="addModulesToCourse" >
                            <fieldset>
                                <multiselect 
                                    v-model="selectedModules" 
                                    :options="availableModules" 
                                    :multiple="true"
                                    :searchable="true" 
                                    openDirection="bottom"
                                    placeholder="Seleccionar módulos"
                                    label="name"
                                    selectLabel="Presiona enter para seleccionar"
                                    selectedLabel="Seleccionado"
                                    deselectLabel="Presiona enter para quitar"
                                    track-by="id" class="mb-3">
                                    <template #noOptions>
                                        <span class="text-gray-500">No hay módulos disponibles</span>
                                    </template>
                                    <template #noResult>
                                        <span class="text-gray-500"> No se encontraron coincidencias. </span>
                                    </template>
                                </multiselect>
                            </fieldset>
                            <div>
                                <button type="submit" class="btn me-2 btn-cyan" >{{this.loadingModule?'Agregando...':'Agregar'}}</button>
                                <button type="button" class="btn ms-2 btn-black" @click="showSearchModule=false">Cancelar</button>
                            </div>
                        </form>
                    </div>
                    <div v-if="course.modules">
                        <table id="courseModulesTable" class="table table-striped table-hover table-bordered">
                            <thead>
                                <tr>
                                    <th>Órden</th>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="module in course.modules" :key="module.id" >
                                    <td>{{ module.order }}</td>
                                    <td>{{ module.name }}</td>
                                    <td>{{ module.description }}</td>
                                    <td >
                                        <button type="button" class="btn btn-succes m-1" @click="lessonUp(module.lesson.order)">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-circle-fill" viewBox="0 0 16 16">
                                            <path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0m-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z"/>
                                        </svg>
                                        Subir
                                    </button>
                                    <button type="button" class="btn btn-danger m-1" @click="lessonDown(module.lesson.order)">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-circle-fill" viewBox="0 0 16 16">
                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z"/>
                                        </svg>
                                        Bajar
                                    </button>
                                        <button type="button" class="btn btn-outline-danger m-1" @click="editmodule(module.id)">Editar</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div> 
                    <div v-show="course.modules.length === 0 && !showSearchModule&&!showNewModule">
                        <p>Sin módulos en el curso</p>
                    </div>
                </section>
                <!-- evaluaciones -->
                <section class="mb-3">
                    <div class="d-flex gap-3">
                        <h3>Evaluaciones</h3>
                        <button type="button" class="btn btn-blue" data-bs-toggle="modal" data-bs-target="#newEvaluation">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                            </svg>
                            Nuevo
                        </button> 
                    </div>
                    <!-- Modal evaluación-->
                    <div class="modal fade" id="newEvaluation" tabindex="-1" aria-labelledby="newEvaluationLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="newEvaluationLabel">Nueva evaluación</h1>
                                    <button type="button" class="btn-close btn-black" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <form @submit.prevent="createNewEvaluation">
                                        <fieldset>
                                            <div class="d-flex flex-md-row flex-column gap-3 w-100">
                                                <div class="form-group flex-grow-1">
                                                    <label for="title">Título</label>
                                                    <input type="text" class="form-control" id="title" v-model="newEvaluation.title" placeholder="Título de la evaluación"/>
                                                </div>
                                                <div class="form-group flex-grow-1">
                                                    <label for="state">Estado</label>
                                                    <select name="state" class="form-control" id="state" v-model="newEvaluation.state">
                                                        <option value="" disabled selected>---Selecciona un estado---</option>
                                                        <option value="activo">Activo</option>
                                                        <option value="inactivo">Inactivo</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="d-flex flex-md-row flex-column gap-3">
                                                <div class="form-group flex-grow-1">
                                                    <label for="start_date">Fecha de inicio</label>
                                                    <input type="date" class="form-control" id="start_date" v-model="newEvaluation.start_date"/>
                                                </div>
                                                <div class="form-group flex-grow-1">
                                                    <label for="end_date">Fecha de fin</label>
                                                    <input type="date" class="form-control" id="end_date" v-model="newEvaluation.end_date"/>
                                                </div>
                                            </div>
                                            <div class="d-flex flex-md-row flex-column gap-3">
                                                <div class="form-group flex-grow-1">
                                                    <label for="duration">Duración</label>
                                                    <input type="time" class="form-control" id="duration" v-model="newEvaluation.duration"/>
                                                </div>
                                                <div class="form-group flex-grow-1">
                                                    <label for="attempts_allowed">N° Intentos</label>
                                                    <input type="number" class="form-control" id="attempts_allowed" v-model="newEvaluation.attempts_allowed"/>
                                                </div>
                                            </div>
                                        </fieldset>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-cyan" @click="createNewEvaluation">{{loadingEvaluation?'Creando...':'Crear'}}</button>
                                            <button type="button" class="btn btn-black" data-bs-dismiss="modal">Cerrar</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- fin modal evaluación-->
                    <div v-show="course.evaluations && course.evaluations.length > 0">
                        <table id="courseEvaluationsTable" class="table ">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="evaluation in course.evaluations" :key="evaluation.id" @click="evaluationDetail(evaluation.id)">
                                    <td>{{ evaluation.name }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div> 
                    <div v-show="course.evaluations.length===0">
                        <p>Sin evaluaciones en el curso</p>
                    </div>
                </section>
                <!-- materiales -->
                <section>
                    <div class="d-flex gap-3">
                        <h3>Materiales</h3> 
                        <button type="button" class="btn btn-blue" data-bs-toggle="modal" data-bs-target="#newMaterial">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                            </svg>
                            Nuevo
                        </button>
                        <button class="btn btn-green" @click="showSearchMaterial=!showSearchMaterial; showNewMaterial=false">Agregar</button>
                    </div>
                    <!-- Modal nuevo material -->
                    <div class="modal fade" id="newMaterial" tabindex="-1" aria-labelledby="newMaterialLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="newMaterialLabel">Nuevo material</h1>
                                    <button type="button" class="btn-close btn-black" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <form @submit.prevent="createNewMaterial">
                                        <fieldset>
                                            <div class="form-group">
                                                <label for="title">Título</label>
                                                <input type="text" class="form-control" id="title" v-model="newMaterial.title" placeholder="Título del material"/>
                                            </div>
                                            <div class="form-group">
                                                <label for="type">Título</label>
                                                <select name="type" class="form-control p-2" v-model="newMaterial.type">
                                                    <option value="" disabled selected>---Selecciona un tipo---</option>
                                                    <option value="file">Archivo</option>
                                                    <option value="link">Enlace</option>
                                                    <option value="video">Video</option>
                                                    <option value="text">texto</option>
                                                </select>
                                            </div>
                                            <div class="form-group" v-if="newMaterial.type === 'file'">
                                                <label for="file">Archivo</label>
                                                <!-- <input type="file" class="form-control" id="file" @change="handleFileUpload"> -->
                                                <input type="file" class="form-control" id="file">
                                            </div>
                                            <div class="form-group" v-if="newMaterial.type === 'link'">
                                                <label for="link">Enlace</label>
                                                <input type="text" class="form-control" id="link" v-model="newMaterial.url" placeholder="Enlace del material"/>
                                            </div>
                                            <div class="form-group" v-if="newMaterial.type === 'video'">
                                                <label for="video">Video</label>
                                                <input type="text" class="form-control" id="video" v-model="newMaterial.url" placeholder="Enlace del video"/>
                                            </div>
                                            <div class="form-group" v-if="newMaterial.type === 'text'">
                                                <label for="content">Contenido</label>
                                                <!-- TODO: reemplazar el input por una libreria que permita editar textos-->
                                                <input type="text" class="form-control" id="content" v-model="newMaterial.content" />
                                            </div>
                                        </fieldset>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-cyan" @click="createNewMaterial">{{loadingMaterial?'Creando...':'Crear'}}</button>
                                            <button type="button" class="btn btn-black" data-bs-dismiss="modal">Cerrar</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- fin modal nuevo material-->
                    <!-- agregar material -->
                    <div>
                        <form v-show="showSearchMaterial" class="w-lg-50 w-md-60 w-100 mb-4" @submit.prevent="addMaterialToCourse" >
                            <fieldset>
                                <multiselect 
                                    v-model="selectedMaterials" 
                                    :options="availableMaterials" 
                                    :multiple="true"
                                    :searchable="true" 
                                    openDirection="bottom"
                                    placeholder="Seleccionar materiales"
                                    label="name"
                                    selectLabel="Presiona enter para seleccionar"
                                    selectedLabel="Seleccionado"
                                    deselectLabel="Presiona enter para quitar"
                                    track-by="id" class="mb-3">
                                    <template #noOptions>
                                        <span class="text-gray-500">No hay materiales disponibles</span>
                                    </template>
                                    <template #noResult>
                                        <span class="text-gray-500"> No se encontraron coincidencias. </span>
                                    </template>
                                </multiselect>
                            </fieldset>
                            <div>
                                <button type="submit" class="btn m-2 btn-cyan" >{{this.loadingMaterial?'Agregando...':'Agregar'}}</button>
                                <button type="button" class="btn m-2 btn-black" @click="showSearchMaterial=false">Cancelar</button>
                            </div>
                        </form>
                    </div>
                    <!-- <div v-if="course.materials && course.materials.length > 0">
                        <table id="coursematerialsTable" class="table">
                            <thead>
                                <tr>
                                    <th>Órden</th>
                                    <th>Titulo</th>
                                    <th>Tipo</th>
                                    <th>Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="material in course.materials" :key="material.id">
                                    <td>{{ material.order }}</td>
                                    <td>{{ material.title }}</td>
                                    <td>{{ material.type }}</td>
                                    <td><button type="button" class="btn btn-outline-danger" @click="deleteMaterialToCourse(material.id)">Elinimar</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>  -->
                    <!-- <div v-show="course.materials.length === 0 && !showSearchMaterial&&!showNewMaterial">
                        <p>Sin materiales en el curso</p>
                    </div> -->
                </section>
            </div>
            <div class="card-bottom d-flex">
                <button type="button" class="btn btn-primary mx-auto" style="background-color:rgb(0,87,163);color:white;" @click="goBack">Volver</button>
            </div>
        </div>
    </div>
</template>
<script>
import CourseService from '@/services/CoursesService.js';
import MaterialService from '@/services/MaterialsService.js';
import CategoryService from '@/services/CategoryService.js';
import TrainerService from '@/services/TrainersService.js';
import ModuleService from '@/services/ModulesService.js';
import CourseModuleService from '@/services/CourseModuleService.js';
import Preloader from '../../../components/Preloader.vue';
import $ from 'jquery';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-bs4';

import Multiselect from "vue-multiselect";


export default {
    data() {
        return {
            name:"Detalles del Curso",
            idcurso:this.$route.params.idcurso,
            cargando: false,
            course:null,
            trainers:[],
            categories: [],
            isViewing: false,
            isEditing: false,
            loading: false,
            loadingTrainer: false,
            loadingModule: false,
            loadingEvaluation: false,
            loadingMaterial: false,
            imagePreview: null,
            error:'',

            newModule:{
                name:'',
                description:'',
            },
            newCourseModule:{
                course_id:'',
                module_id:'',
                order:'',
            },
            newEvaluation:{
                title:'',
                start_date:'',
                end_date:'',
                duration:'',
                attempts_allowed:'',
                state:'',
                course_id:this.idcurso,
            },
            newMaterial:{
                title:'',
                grado:'curso',
                type:'',
                url:'',
                content:'',
            },

            showSearchTrainers:false,
            selectedTrainers:[],
            availableTrainers:[],

            showNewModule:false,
            showSearchModule:false,
            selectedModules:[],
            availableModules:[],

            showNewEvaluation:false,

            showNewMaterial:false,
            showSearchMaterial:false,
            selectedMaterials:[],
            availableMaterials:[],
        };
    },
    mounted() {
        if (this.$route.name === 'CursoDetalleVer') {
            this.isViewing = true;
        } else if (this.$route.name === 'CursoDetalleEditar') {
            this.isEditing = true;
        }
    },
    created() {
        this.getCourseDetails();
        this.getCategories();
        this.getAvailableTrainers();
    },
    beforeUnmount() {
        if ($.fn.dataTable.isDataTable('#courseEvaluationsTable')) {
            $('#courseEvaluationsTable').DataTable().destroy();
        }
        if ($.fn.dataTable.isDataTable('#coursematerialsTable')) {
            $('#coursematerialsTable').DataTable().destroy();
        }
        if ($.fn.dataTable.isDataTable('#courseModulesTable')) {
            $('#courseModulesTable').DataTable().destroy();
        }
        if ($.fn.dataTable.isDataTable('#courseTrainersTable')) {
            $('#courseTrainersTable').DataTable().destroy();
        }
    },
    components: {
        Preloader,
        Multiselect
    },
    methods: {
        async getCourseDetails() {
            try{
                this.cargando=true;
                const response = await CourseService.getCourseDetails(this.idcurso);
                this.course = response.data.data;
                await this.getAvailableTrainers();
                await this.getAvailableModules();
                await this.getTrainers(this.course);
                await this.$nextTick();
                if (this.course && this.course.modules.length > 0) {
                    $('#courseModulesTable').DataTable();  
                }
                if (this.course && this.course.evaluations.length > 0) {
                    $('#courseEvaluationsTable').DataTable();  
                }
                // if (this.course && this.course.materials.length > 0) {
                //     $('#coursematerialsTable').DataTable();  
                // }
                if (this.trainers.length > 0) {
                    $('#courseTrainersTable').DataTable();  
                }
                
            }catch(error){
                console.log(error);
            }finally{
                this.cargando=false;                
            }
        },
        async getCategories(){
            try{
                this.cargando=true;
                const response = await CategoryService.getCategories();
                this.categories = response.data.data;
            }catch(error){
                console.log(error);
            }
            finally
            {
                this.cargando=false;
            }
        },
        async getTrainers(course) {
            try {
                const trainerPromises = course.trainers.map(trainer =>
                    TrainerService.getTrainerDetails(trainer.id)
                );
                const responses = await Promise.all(trainerPromises);

                this.trainers = responses.map(response => response.data.data);
            } catch (error) {
                console.error("Error al obtener los entrenadores:", error);
            }
        },
        goBack() {
            this.$router.push({ name: 'Cursos' }); 
        },
        editCourse(){
            this.isEditing = true;
            this.isViewing = false;
            this.$router.push({ name: 'CursoDetalleEditar', params: { idcurso: this.idcurso } });
        },
        async updateCourse() {
            this.error = "";
            this.loading = true;
            const formData = new FormData();
            formData.append('name_long', this.course.name_long);
            formData.append('name_short', this.course.name_short);
            formData.append('price', this.course.price);
            formData.append('discount', this.course.discount);
            formData.append('description', this.course.description);
            formData.append('start_date', this.course.start_date);
            formData.append('end_date', this.course.end_date)
            formData.append('duration_in_hours', this.course.duration_in_hours)
            formData.append('store_id', this.course.store_id);
            formData.append('category_id', this.course.category_id);
            if (this.course.image && this.course.image instanceof File) {
                formData.append("image", this.course.image);
            }
            console.log("id curso",this.idcurso);
            console.log("Datos enviados en FormData:");
            for (let pair of formData.entries()) {
                console.log(pair[0] + ':', pair[1]);
            }

            try {
                this.error = "";
                this.loading = true;
                await CourseService.patchCourse(this.idcurso, formData);
                this.isEditing = false;
                this.isViewing = true;  
                this.getCourseDetails();
                this.$router.replace({ name: "CursoDetalleVer", params: { idcurso: this.idcurso } });
            } catch (err) {
                this.error = Object.values(err.response.data.errors).flat().join(" ");
                
            } finally {
                this.loading = false;
            }
        },
        async deleteCourse(){
            const confirmed = confirm('¿Estás seguro de que deseas eliminar este curso?');
            if (confirmed) {
                try {
                    await CourseService.deleteCourse(this.course.id); 
                    this.$router.push({ name: 'Cursos' });
                } catch (error) {
                    alert('Hubo un error al intentar eliminar el curso.');
                }
            }   
        },
        getImagenUrl(image) {
            if (image) {
                return process.env.VUE_APP_API_URL + "/storage/" + image; 
            }
        },
        cancelEdit(){
            this.isEditing = false;
            this.isViewing = true;
            this.getCourseDetails();
            this.error='';
            this.$router.push({ name: 'CursoDetalleVer', params: { idcurso: this.idcurso} });
        },
        handleImageUpload(event) {
            const file = event.target.files[0]; 
            if (file) {
                this.course.image = file;  
                this.previewImage(file);  
            }
        },
        previewImage(file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                this.imagePreview = reader.result;  
            };
            if (file) {
                reader.readAsDataURL(file);  
            }
        },
        handleFileUpload(event) {
            const file = event.target.files[0]; 
            if (file) {
                this.newMaterial.url = file;
            }
        },
        editmodule(id){
            this.$router.push({ name: 'ModuloDetalleEditar', params: { idmodulo: id } });
        },
        async getAvailableTrainers(){
            try {
                const response = await TrainerService.getTrainers();
                const allTrainers = response.data.data;
                if (this.course && this.course.trainers) {
                    const courseTrainersIds = this.course.trainers.map(trainer => trainer.id);
                    this.availableTrainers = allTrainers.filter(trainer => !courseTrainersIds.includes(trainer.id));
                } else {
                    this.availableTrainers = allTrainers;
                }
            } catch (error) {
                console.log(error);
            } 
        },
        async getAvailableModules(){
            try {
                const response = await ModuleService.getModules();
                const allModules = response.data.data;
                console.log("allModules",allModules);
                // if (this.course && this.course.modules) {
                //     const courseModulesIds = this.course.modules.map(module => module.id);
                //     this.availableModules = allModules.filter(module => !courseModulesIds.includes(module.id));
                // } else {
                    this.availableModules = allModules;
                // }
            } catch (error) {
                console.log(error);
            }
        },
        async addTrainersToCourse(){
            if (!this.selectedTrainers || this.selectedTrainers.length === 0) {
                alert("Debe seleccionar al menos un capacitador.");
                return;
            }
            this.loadingTrainer = true;
            try {
                const requestData = {
                    trainer_ids: this.selectedTrainers.map(trainer => trainer.id)
                };
                await CourseService.postTrainersToCourse(this.course.id, requestData);
                this.selectedTrainers = [];
                this.showSearchTrainers=false;
                this.getCourseDetails();
            } catch (error) {
                console.error("Error al agregar capacitadores:", error);
            } finally {
                this.loadingTrainer = false;
            }
        },
        async addModulesToCourse(){
            if (!this.selectedModules || this.selectedModules.length === 0) {
                alert("Debe seleccionar al menos un módulo.");
                return;
            }
            this.loadingModule = true;
            try {
                // const requestData = {
                //     module_ids: this.selectedModules.map(module => module.id)
                // };
                // await CourseService.postModulesToCourse(this.course.id, requestData);
                for(let module of this.selectedModules){
                    let newCurriculum = {
                        course_id:this.idcurso,
                        module_id:module.id,
                        order:this.course.modules.length+1
                    }
                    const response=await CourseModuleService.postCourseModule(newCurriculum);
                    console.log("response",response);
                }
                this.selectedModules = [];
                this.showSearchModules=false;
                this.getCourseDetails();
            } catch (error) {
                console.error("Error al agregar modulos:", error);
            } finally {
                this.loadingTrainer = false;
            }
        },
        async deleteTrainerToCourse(trainerId){
            const confirmed = confirm('¿Estás seguro de que deseas quitar este capacitador del curso?');
            if (confirmed) {
                try {
                    await CourseService.deleteTrainerToCourse(trainerId,this.idcurso);
                    this.getCourseDetails(); 
                } catch (error) {
                    alert('Hubo un error al intentar eliminar el capacitador.');
                }
            }   
        },
        async deleteMaterialToCourse(materialId){
            const confirmed = confirm('¿Estás seguro de que deseas eliminar este material del curso?');
            if (confirmed) {
                try {
                    await MaterialService.deleteCourseToMaterial(materialId,this.idcurso);
                    console.log(this.$route.params.id) ;
                    this.getCourseDetails(); 
                } catch (error) {
                    alert('Hubo un error al intentar eliminar el curso.');
                }
            }   
        },
        fullName (trainer) {
            return `${trainer.user.names} ${trainer.user.last_names}`;
        },
        createNewEvaluation(){

        }

    }
};
</script>
