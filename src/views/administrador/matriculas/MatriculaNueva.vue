<template>
    <div class="container">
        <div class="card p-4">
            <h1 class="fs-4">{{name}}</h1>
            <div >
                <form class="courses-form mx-auto"  @submit.prevent="createEnrollment()">
                    <div class="d-flex flex-md-row flex-column gap-3 ">
                        <div class="form-group w-md-50 w-100">
                            <label for="startDate">Inicio de matrícula</label>
                            <input type="date" id="startDate" class="form-control" v-model="newEnrollment.enrollment_date" required>
                        </div>
                        <div class="form-group w-md-50 w-100">
                            <label for="endDate">Fin de matrícula</label>
                            <input type="date" id="endDate" class="form-control" v-model="newEnrollment.end_enrollment_date" required>
                        </div>
                    </div>
                    <div class="d-flex flex-lg-row flex-column gap-3 ">
                        <div class="form-group w-lg-50 w-100">
                            <label>Alumnos</label>
                            <Multiselect 
                                v-model="selectedStudents" 
                                :options="availableStudents" 
                                :multiple="true"
                                :searchable="true" 
                                :showLabels="false"
                                openDirection="bottom"
                                placeholder="Selecciona estudiantes"
                                label="names"
                                track-by="id"
                                @change="getAvailableCourses()">
                                <template #noOptions>
                                    <span class="text-gray-500">No hay estudiantes disponibles</span>
                                </template>
                                <template #noResult>
                                    <span class="text-gray-500"> No se encontraron coincidencias. </span>
                                </template>
                            </Multiselect>
                        </div>
                        <div class="form-group w-lg-50 w-100">
                            <label>Cursos</label>
                            <Multiselect 
                                    v-model="selectedCourses" 
                                    :options="availableCourses" 
                                    :multiple="true"
                                    :searchable="true"
                                    :showLabels="false"
                                    openDirection="bottom"
                                    placeholder="Selecciona el curso"
                                    label="name_long"
                                    track-by="id">
                                    <template #noOptions>
                                        <span class="text-gray-500">No hay cursos disponibles</span>
                                    </template>
                                    <template #noResult>
                                        <span class="text-gray-500"> No se encontraron coincidencias. </span>
                                    </template>
                                </Multiselect>
                        </div>
                    </div>    
                    <div class="d-flex flex-md-row flex-column gap-3">
                        <div class="w-md-50 w-100 " v-if="selectedStudents.length===1">
                            <div>
                                <h3 class="fs-5">Alumno seleccionado</h3>
                            </div>
                            <div>
                                <div>
                                    <div class="form-group">
                                        <label for="name">Nombre</label>
                                        <input type="text" class="form-control" id="name" v-model="selectedStudents[0].names" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label for="last_name">Apellidos</label>
                                        <input type="text" class="form-control" id="last_name" v-model="selectedStudents[0].last_names" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label for="email">Correo</label>
                                        <input type="text" class="form-control" id="email" v-model="selectedStudents[0].email" readonly>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="w-md-50 w-100" v-if="selectedCourses.length===1">
                            <div>
                                <h3 class="fs-5">Curso seleccionado</h3>
                            </div>
                            <div>
                                <div class="">
                                    <div class="form-group">
                                        <label for="name_long">Nombre</label>
                                        <input type="text" class="form-control" id="name_long" v-model="selectedCourses[0].name_long" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label for="price">Precio</label>
                                        <input type="text" class="form-control" id="price" v-model="selectedCourses[0].price" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label for="description">Descripción</label>
                                        <input type="text" class="form-control" id="description" v-model="selectedCourses[0].description" readonly>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-content-center">
                        <button type="submit" class="btn btn-green m-2">{{ loading ? "Agregando..." : "Agregar" }}</button>
                        <button type="button" id="button-cancel" class="btn btn-blue m-2" @click="goBack">Volver</button>
                    </div>
                    </form>
            </div>
        </div>
    </div>
</template>
<script>
import UserService from '@/services/UsersService.js'
import CourseService from '@/services/CoursesService.js'
import ModuleService from '@/services/ModulesService.js'
import LessonUserService from '@/services/LessonUserService.js'
import EnrollmentsService from '../../../services/EnrollmentsService';
import Multiselect from 'vue-multiselect';

export default{
    data(){
        return{
            name:'Nueva Matricula',            
            isViewing: false,
            isEditing: false,
            loading:false,
            newEnrollment:{
                user_id:'',
                course_id:'',
                enrollment_date:'',
                end_enrollment_date:'',
                status:'activo',
            },
            newUserLessons:{
                user_id:'',
                lesson_id:'',
                state:'pendiente',
            },
            availableStudents:[],
            availableCourses:[],
            selectedStudents:[],
            selectedCourses:[],
            courseLessons:[],
        }
    },
    created(){
        this.getAvailableStudents();
    },
    watch: {
        selectedStudents() {
            this.getAvailableCourses();
        }
    },
    components:{
        Multiselect
    },
    methods:{
        goBack(){
            this.$router.push({name:'Matriculas'});
        },
        async getAvailableStudents(){
            const response=await UserService.getUsers();
            this.availableStudents=response.data.data.filter(user=>user.role==='alumno' &&user.status==='activo');
        },

        async getAvailableCourses() {
            const response = await CourseService.getCourses();
            const allCourses = response.data.data;

            if (this.selectedStudents.length === 1) {
                const student = this.selectedStudents[0];
                const assignedCourseIds = student.enrollments.map(enroll => enroll.course_id);

                this.availableCourses = allCourses.filter(course => 
                    !assignedCourseIds.includes(course.id)
                );
            } else {
                this.availableCourses = allCourses;
            }
        },

        async getCourseLessons() {
            this.courseLessons = [];
            const modulos = [];
            for (let course of this.selectedCourses) {
                const response = await CourseService.getCourseDetails(course.id);
                const courseModules = response.data.data.modules;
                courseModules.forEach(module => {
                    if (!modulos.includes(module.module_id)) {
                        modulos.push(module.module_id);
                    }
                });
                
            }

            for(let module of modulos) {
                const response = await ModuleService.getModuleDetails(module);
                const lessons = response.data.data.lessons;
                this.courseLessons.push(...lessons);
            }
        },

        async createEnrollment(){
            try{                
                this.loading=true;
                this.getCourseLessons();
                for(let student of this.selectedStudents){
                    this.newEnrollment.user_id=student.id;
                    const response=await UserService.getUserDetails(student.id);
                    const stu=response.data.data;
                    for(let course of this.selectedCourses){
                        if(stu.enrollments.some(enroll=>enroll.course_id===course.id)){
                            continue;                            
                        }
                        this.newEnrollment.course_id=course.id;
                        await EnrollmentsService.postEnrollment(this.newEnrollment);
                    }
                    for(let lesson of this.courseLessons){
                        this.newUserLessons.user_id=student.id;
                        this.newUserLessons.lesson_id=lesson.id;
                        await LessonUserService.postLessonUser(this.newUserLessons);
                    }
                }
                
            }catch(error){
                console.log(error);
            }
            finally{
                this.loading=false;
                this.$router.push({name:'Matriculas'});
            }

        }
    }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>