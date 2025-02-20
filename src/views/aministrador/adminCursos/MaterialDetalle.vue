<template>
    <div class="material-details">
        <div class="head-page">
            <h2>Detalles del Material</h2>
            <div class="dropdown">
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
        <card>
            <div v-if="material">
                <div>
                    <p><strong>Título:</strong> {{ material.title }}</p>
                    <p><strong>Grado:</strong> {{ material.grado }}</p>
                    <p><strong>Tipo:</strong> {{ material.type }}</p>
                    <p><strong>Link:</strong> {{ material.url }}</p>
                    <p><strong>Contenido:</strong> {{ material.content }}</p>
                </div>
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
                        <p>Sin lecciones vinculadas</p>
                    </div>
                </div>
                <div class="materialCourses" v-if="material.grado==='course'">
                    <div>
                        <h3>Cursos</h3>
                        <button type="button" class="btn btn-info" @click="showFormCourseMaterial">Vincular Curso</button>
                    </div>

                    <form class="courses-form" v-if="showSearchBar" @submit.prevent="addCourseToMaterial(selectedCourse?.id)">
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
                        </form>
                    
                    <div v-if="material.courses && material.courses.length > 0">
                        <table id="materialCoursesTable" class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="course in material.courses" :key="course.id">
                                    <td>{{ course.name_long }}</td>
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
        </card>    
    </div>
    <div class="volver">
        <button type="button" class="btn btn-primary" @click="goBack">Ver Materiales</button>
    </div>
</template>
<script>
import MaterialService from '@/services/MaterialsService.js';
import CourseService from '@/services/CoursesService.js';

export default {
    data() {
        return {
            material: null,
            showSearchBar: false,
            searchQuery: '', 
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
    methods: {
        async getMaterialDetails() {
            const id = this.$route.params.id; 
            const response = await MaterialService.getMaterialDetails(id);
            this.material = response.data.data;
            console.log(response);
        },
        async getCourses() {
            const response = await CourseService.getCourses();
            this.courses = response.data.data;  
        },
        goBack() {
            this.$router.push({ name: 'Materiales' }); 
        },
        editMaterial(id){
            this.$router.push({ name: 'EditarMaterial', params: { id: id } });
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
        showFormCourseMaterial() {
            this.showSearchBar = !this.showSearchBar; 
        },
        async addCourseToMaterial(courseId){
            if (!courseId) {
            alert("Por favor, selecciona un curso antes de agregar.");
            return;
            }
            const materialId = this.$route.params.id; 
            try {
                this.loading = true;
                console.log(`Agregando curso ${courseId} al material ${materialId}`)
                 await MaterialService.postCourseToMaterial(materialId,courseId);
                 this.getMaterialDetails(); 
            } catch (error) {
                alert("Hubo un error al agregar el curso.");
            } finally {
                this.loading = false;
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
                    const materialId = this.$route.params.id; 
                    await MaterialService.deleteCourseToMaterial(materialId,courseId); 
                    this.getMaterialDetails(); 
                } catch (error) {
                    alert('Hubo un error al intentar eliminar el curso.');
                }
            }   
        }
    },
}
</script>
<style scoped>
#courseCategoryTable{
    justify-self: center;
    max-width: 95%;
}
.volver{
    justify-self: center;
}
.head{
    display: flex;
    justify-content: space-between;
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

.courses-form {
    display: flex;
    align-items: center; 
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
    gap: 10px;
    position: relative; 
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

.buttons {
    display: flex;
    gap: 10px;
    align-items: center;
}

.buttons button {
    white-space: nowrap;
}
</style>