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
                <div class="materialLessons">
                    <h3>Lecciones</h3>
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
                <div class="materialCourses">
                    <div>
                        <h3>Cursos</h3>
                        <button type="button" class="btn btn-info" @click="showFormCourseMaterial">Vincular Curso</button>
                    </div>
                    <form class="courses-form" v-if="showSearchBar" @submit.prevent="addCourseToMaterial">
                        <div class="form-group">
                            <label for="courses">Cursos disponibles</label>
                            <div class="search-bar">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                                </svg>
                                <input v-model="searchQuery" type="text" class=" search-bar-input" placeholder="Buscar cursos..." @input="filterCourses" />
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                                </svg>
                            </div>                            
                            <ul v-if="filteredCourses.length">
                                <li 
                                    v-for="course in filteredCourses" 
                                    :key="course.id" 
                                    @click="addCourseToMaterial(course)"
                                >
                                    {{ course.name_long }}
                                </li>
                            </ul>
                            <p v-else>Sin resultados.</p>
                            
                            <!-- <select name="courses" v-model="material.courses">
                                <option value="" disabled selected>---Selecciona un Curso---</option>
                                <option v-for="course in courses" :key="course.id" :value="course.id">
                                    {{ course.name_long }}
                                </option>
                            </select> -->
                        </div>
                        <div class="buttons">
                            <button type="submit" class="btn btn-info">{{ loading ? "Agregando..." : "Agregar" }}</button>
                            <button type="button" class="btn btn-warring" @click="showFormCourseMaterial">Cancelar</button>
                        </div>
                    </form>
                    <!-- Barra de búsqueda de cursos -->
                    <div v-if="showSearchBar">
                        
                    </div>

                    <div v-if="material.courses && material.courses.length > 0">
                        <table id="materialCoursesTable" class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="course in material.courses" :key="course.id" @click="courseDetail(course.id)">
                                    <td>{{ course.name_long }}</td>
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
            showSearchBar: false, // Para controlar la visibilidad de la barra de búsqueda
            searchQuery: '', // Almacena la búsqueda
            courses: [], // Lista de cursos disponibles
            filteredCourses: [], // Cursos filtrados según la búsqueda
            loading:"",
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
            this.showSearchBar = !this.showSearchBar; // Mostrar o ocultar la barra de búsqueda
            // if (course) {
            //     // Aquí puedes agregar el curso al material
            //     console.log(`Curso vinculado: ${course.name_long}`);
            // }
        },
        addCourseToMaterial(){

        },
        filterCourses() {
            if (this.searchQuery) {
                this.filteredCourses = this.courses.filter(course => 
                    course.name_long.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            } else {
                this.filteredCourses = this.courses;
            }
        },
    }
};
</script>
<style>
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
    background-color: transparent; /* Hace el fondo transparente */
    border: none; /* Elimina los bordes */
    outline: none; /* Elimina el contorno que aparece al hacer clic */
    padding: 8px 12px; /* Ajusta el espaciado interno (opcional) */
    font-size: 16px; /* Ajusta el tamaño de la fuente (opcional) */
    color: #333; /* Cambia el color del texto (opcional) */
    width: 100%;
    
}

.search-bar-input:focus {
    outline: none; /* Asegura que no haya contorno al hacer foco */
}
.courses-form{
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
}
.form-group{
    width: 60%;
    margin:10px;
}
.buttons{
    width: 40%;
    justify-items: space-around;
}
</style>