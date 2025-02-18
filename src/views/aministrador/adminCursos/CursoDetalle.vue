<template>
    <div class="category-details">
        <div class="head">
            <h2>Detalles del Curso</h2>
            <div class="dropdown">
                <button class="btn btn-danger dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Opciones
                </button>
                <ul class="dropdown-menu">
                    <div v-if="course">
                    <li><a class="dropdown-item" href="#" @click="editCourse(course.id)">Editar</a></li>
                    <li><a class="dropdown-item" href="#" @click="deleteCourse">Eliminar</a></li>
                    </div>
                </ul>
            </div>            
        </div>
        <card>
            <div v-if="course">
                <div>
                    <p><strong>Nombre:</strong> {{ course.name_long }}</p>
                    <p><strong>Abreviación:</strong> {{ course.name_short }}</p>
                    <p><strong>Precio:</strong> {{ course.price }}</p>
                    <p><strong>Imagen:</strong> {{ course.image }}</p>
                    <p><strong>Descripción:</strong> {{ course.description }}</p>
                    <p><strong>Descripción:</strong> {{ course.description }}</p>
                    <p><strong>Categoria:</strong> {{ course.category.name}}</p>
                </div>
                <!-- <div class="courses">
                    <h3>Cursos</h3>
                    <div v-if="category.courses">
                        <table id="courseCategoryTable" class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Abreviación</th>
                                    <th>Descripción</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="course in category.courses" :key="course.id" @click="courseCategoryDetails(course.id)">
                                    <td>{{ course.name_long }}</td>
                                    <td>{{ course.name_short }}</td>
                                    <td>{{ course.description }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div> -->
                    <!-- <div v-else>
                        <p>Sin cursos asignados</p>
                    </div> -->
                <!-- </div> -->
            </div>
            <div v-else>
                <p>Cargando...</p>
            </div>
        </card>    
    </div>
    <div class="volver">
        <button type="button" class="btn btn-primary" @click="goBackcategory">Volver a categoria</button>
        <button type="button" class="btn btn-primary" @click="goBack">Ver cursos</button>
    </div>
</template>
<script>
import CourseService from '@/services/CoursesService.js';


export default {
    data() {
        return {
            course: null
        };
    },
    mounted() {
        this.getCourseDetails();
    },
    methods: {
        async getCourseDetails() {
            const id = this.$route.params.id; 
            const response = await CourseService.getCourseDetails(id);
            this.course = response.data.data;
        },
        goBack() {
            this.$router.push({ name: 'Cursos' }); 
        },
        goBackcategory() {
            this.$router.push({ name: 'Categorias' }); 
        },
        editCourse(id){
            this.$router.push({ name: 'EditarCurso', params: { id: id } });
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
        }

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
</style>