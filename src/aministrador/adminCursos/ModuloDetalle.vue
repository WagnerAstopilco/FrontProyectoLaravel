<template>
<div class="module-details">
        <div class="head-page">
            <h2>Detalles del Módulo</h2>
            <div class="dropdown">
                <button class="btn btn-danger dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Opciones
                </button>
                <ul class="dropdown-menu">
                    <div v-if="module">
                    <li><a class="dropdown-item" href="#" @click="editModule(module.id)">Editar</a></li>
                    <li><a class="dropdown-item" href="#" @click="deleteModule(module.id)">Eliminar</a></li>
                    </div>
                </ul>
            </div>            
        </div>
        <card>
            <div v-if="module">
                <div>
                    <p><strong>Nombre:</strong> {{ module.name }}</p>
                    <p><strong>Órden:</strong> {{ module.order }}</p>
                    <p><strong>Descripción:</strong> {{ module.description }}</p>
                </div>
                <div class="moduleLessons">
                    <h3>Lecciones</h3>
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
                                <tr>
                                    <td>{{ module.lesson.order }}</td>
                                    <td>{{ module.lesson.title }}</td>
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
                                        <button type="button" class="btn btn-info" @click="deleteLesson(module.lesson.id)">Eliminar</button>
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
                    <div>
                        <h3>Cursos</h3>
                        <button type="button" class="btn btn-info" @click="showFormCourseModule">Vincular Curso</button>
                    </div>

                    <!-- <form class="courses-form" v-if="showSearchBar" @submit.prevent="addCourseToMaterial(selectedCourse?.id)">
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
                            <div class="buttons">
                                <button type="submit" class="btn btn-info">{{ loading ? "Agregando..." : "Agregar" }}</button>
                                <button type="button" id="button-cancel" class="btn btn-warring" @click="showFormCourseMaterial">Cancelar</button>
                            </div>
                        </form> -->
                    
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
                                    <td>{{ course.image }}</td>
                                    <td>{{ course.name_long }}</td>
                                    <td>{{ course.description}}</td>
                                    <td>
                                        <button type="button" class="btn btn-succes" @click="lessonDown(module.lesson.order)">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-circle-fill" viewBox="0 0 16 16">
                                                <path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0m-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z"/>
                                            </svg>
                                            Subir uno
                                        </button>
                                        <button type="button" class="btn btn-danger" @click="deleteLesson(module.lesson.id)">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-circle-fill" viewBox="0 0 16 16">
                                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z"/>
                                            </svg>
                                            Bajar uno
                                        </button>
                                        <button type="button" class="btn btn-danger" @click="deleteCourseToModule(course.id)">Elinimar</button>
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
        </card>    
    </div>
    <div class="volver">
        <button type="button" class="btn btn-primary" @click="goBack">Ver Módulos</button>
    </div>
</template>
<script>
import ModuleService from '@/services/ModulesService.js';

export default {
    data(){
        return{
            module: null,
            loading:false,
        }
    },
    created(){
        this.getModuleDetails();
    },
    methods:{
        goBack(){
            this.$router.push({name:'Modulos'});
        },
        async getModuleDetails(){
            const id = this.$route.params.id;
            const response = await ModuleService.getModuleDetails(id);
            this.module = response.data.data;
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
        editModule(id){
            this.$router.push({ name: 'EditarModulo', params: { id: id } });
        },

    }
};
</script>
<style scoped>

</style>