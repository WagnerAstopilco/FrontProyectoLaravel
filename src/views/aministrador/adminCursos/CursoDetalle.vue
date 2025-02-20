<template>
    <div class="course-details">
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
                    <p><strong>Descuento:</strong> {{ course.discount }}</p>
                    <p><strong>Descripción:</strong> {{ course.description }}</p>
                    <p><strong>Categoria:</strong> {{ course.category.name}}</p>
                    <p><strong>Imagen:</strong> {{ course.image }}</p>
                </div>
                <div class="CourseTrainers">
                    <h3>Capacitadores</h3>
                    <div v-if="course.trainers && course.trainers.length > 0">
                        <table id="courseTrainersTable" class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="trainer in course.trainers" :key="trainer.id" @click="trainerDetail(trainer.id)">
                                    <td>{{ trainer.name }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div> 
                    <div v-else>
                        <p>Sin capacitadores asignados</p>
                    </div>
                </div>
                <div class="CourseModules">
                    <h3>Modulos</h3>
                    <div v-if="course.modules && course.modules.length > 0">
                        <table id="courseModulesTable" class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="module in course.modules" :key="module.id" @click="moduleDetail(module.id)">
                                    <td>{{ module.name }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div> 
                    <div v-else>
                        <p>Sin modulos asignados</p>
                    </div>
                </div>
                <div class="CourseEvaluations">
                    <h3>Evaluaciones</h3>
                    <div v-if="course.evaluations && course.evaluations.length > 0">
                        <table id="courseEvaluationsTable" class="table table-striped">
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
                    <div v-else>
                        <p>Sin evaluaciones asignadas</p>
                    </div>
                </div>
                <div class="CourseMaterials">
                    <h3>Materiales</h3>
                    <div v-if="course.materials && course.materials.length > 0">
                        <table id="coursematerialsTable" class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Titulo</th>
                                    <th>Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="material in course.materials" :key="material.id">
                                    <td>{{ material.title }}</td>
                                    <td><button type="button" class="btn btn-danger" @click="deleteMaterialToCourse(material.id)">Elinimar</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div> 
                    <div v-else>
                        <p>Sin materiales asignados</p>
                    </div>
                </div>
            </div>
            <div v-else>
                <p>Cargando...</p>
            </div>
        </card>    
    </div>
    <div class="volver">
        <button type="button" class="btn btn-primary" @click="goBackCategory">Volver a categoria</button>
        <button type="button" class="btn btn-primary" @click="goBack">Ver cursos</button>
    </div>
</template>
<script>
import CourseService from '@/services/CoursesService.js';
import MaterialService from '@/services/MaterialsService.js';


export default {
    data() {
        return {
            course: null,
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
        goBackCategory() {
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
        },
        async deleteMaterialToCourse(materialId){
            const confirmed = confirm('¿Estás seguro de que deseas eliminar este material del curso?');
            if (confirmed) {
                try {
                    const courselId = this.$route.params.id; 
                    await MaterialService.deleteCourseToMaterial(materialId,courselId); 
                    this.getCourseDetails(); 
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