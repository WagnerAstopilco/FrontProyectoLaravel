<template>
    <div class="container">
        <div class="card p-4">
            <h1 class="fs-4">{{name}}</h1>
            <div >
                <form class="courses-form col-12 mx-auto p-4"  @submit.prevent="createEnrollment(selectedCourse?.id,selectedStudent?.id)">
                    <div class="d-flex">
                        <div class="form-group col-6 m-2">
                            <label for="startDate">Inicio de matrícula</label>
                            <input type="date" id="startDate" class="form-control" v-model="newEnrollment.enrollment_date" required>
                        </div>
                        <div class="form-group col-6 m-2">
                            <label for="endDate">Fin de matrícula</label>
                            <input type="date" id="endDate" class="form-control" v-model="newEnrollment.end_enrollment_date" required>
                        </div>
                    </div>
                    <div class="d-flex">
                        <div class="form-group col-6 m-2">
                            <label>Alumnos</label>
                            <div class="search-bar-student">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                                </svg>
                                <input v-model="searchQueryStudent" type="text" class=" search-bar-student-input" placeholder="Buscar alumno..." @click="filterStudents" @input="filterStudents" @focus="inputFocusStudent = true" @blur="handleBlurStudent" required/>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16" @click="resetStudents">
                                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                                </svg>
                            </div>
                            <div class="students-container"  v-if="inputFocusStudent && (filteredStudents.length > 0 || searchQueryStudent)" >
                                <ul class="studentsList">
                                    <li v-for="student in filteredStudents" :key="student.id" 
                                    @click="addStudentToInput(student)">
                                    {{ student.names}} {{ student.last_names}}
                                    </li>
                                    <li v-if="searchQueryStudent && filteredStudents.length ===0">Sin resultados.</li>
                                </ul>
                            </div> 
                        </div>
                        <div class="form-group col-6 m-2">
                            <label>Cursos</label>
                            <div class="search-bar-course">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                                </svg>
                                <input v-model="searchQueryCourse" type="text" class=" search-bar-course-input" placeholder="Buscar curso..." @click="filterCourses" @input="filterCourses" @focus="inputFocusCourse = true" @blur="handleBlurCourse" required/>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16" @click="resetCourses">
                                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                                </svg>
                            </div>
                            <div class="courses-container"  v-if="inputFocusCourse && (filteredCourses.length > 0 || searchQuery)" >
                                <ul class="coursesList">
                                    <li v-for="course in filteredCourses" :key="course.id" 
                                    @click="addCourseToInput(course)">
                                    {{ course.name_long }} 
                                    </li>
                                    <li v-if="searchQueryCourse && filteredCourses.length ===0">Sin resultados.</li>
                                </ul>
                            </div> 
                        </div>
                    </div>    
                    <div class="d-flex">
                        <div class="col-6 m-2" v-if="selectedStudent">
                            <div>
                                <h3 class="fs-5">Alumno seleccionado</h3>
                            </div>
                            <div>
                                <div>
                                    <div class="form-group">
                                        <label for="name">Nombre</label>
                                        <input type="text" class="form-control w-50" id="name" v-model="selectedStudent.names" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label for="last_name">Apellidos</label>
                                        <input type="text" class="form-control w-50" id="last_name" v-model="selectedStudent.last_names" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label for="email">Correo</label>
                                        <input type="text" class="form-control w-50" id="email" v-model="selectedStudent.email" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label for="email">Correo</label>
                                        <input type="text" class="form-control w-50" id="email" v-model="selectedStudent.role" readonly>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-6 m-2" v-if="selectedCourse">
                            <div>
                                <h3 class="fs-5">Curso seleccionado</h3>
                            </div>
                            <div>
                                <div class="">
                                    <div class="form-group">
                                        <label for="name_long">Nombre</label>
                                        <input type="text" class="form-control w-50" id="name_long" v-model="selectedCourse.name_long" readonly>
                                    </div>
                                    <!-- <div class="form-group">
                                        <label for="last_name">Apellidos</label>
                                        <input type="text" class="form-control w-50" id="last_name" v-model="selectedCourse.last_names" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label for="email">Correo</label>
                                        <input type="text" class="form-control w-50" id="email" v-model="selectedCourse.email" readonly>
                                    </div> -->
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-content-center">
                        <button type="submit" class="btn btn-info m-2">{{ loading ? "Agregando..." : "Agregar" }}</button>
                        <button type="button" id="button-cancel" class="btn btn-warning m-2" @click="goBack">Volver</button>
                    </div>
                    </form>
            </div>
        </div>
    </div>
</template>
<script>
import UserService from '@/services/UsersService.js'
import CourseService from '@/services/CoursesService.js'
import EnrollmentsService from '../../../services/EnrollmentsService';

export default{
    data(){
        return{
            name:'Nueva Matricula',
            students:[],
            filteredStudents: [],
            searchQueryStudent:'',
            selectedStudent: null,
            courses:[],
            filteredCourses: [],
            searchQueryCourse: '', 
            selectedCourse: null,
            inputFocusStudent:false,
            inputFocusCourse:false,
            isViewing: false,
            isEditing: false,
            loading:false,
            newEnrollment:{
                user_id:'',
                course_id:'',
                enrollment_date:'',
                end_enrollment_date:'',
                status:'activo',
            }
        }
    },
    created(){
        this.getStudents();
        this.getCourses();
    },
    methods:{
        goBack(){
            this.$router.push({name:'Matriculas'});
        },
        async getStudents(){
            const response=await UserService.getUsers();
            this.students=response.data.data.filter(user=>user.role==='alumno' &&user.status==='active');
        },
        filterStudents() {
            if (this.searchQueryStudent) {
                const results = this.students.filter(student => 
                    student.names.toLowerCase().includes(this.searchQueryStudent.toLowerCase())||
                    student.last_names.toLowerCase().includes(this.searchQueryStudent.toLowerCase())
                );
                this.filteredStudents = results.length > 0 ? results : [];
            } else {
                this.filteredStudents = this.students;
            }
        },

        async getCourses() {
            const response = await CourseService.getCourses();
            this.courses = response.data.data;  
        },
        filterCourses() {
            if (this.searchQueryCourse) {
                const results = this.courses.filter(course => 
                    course.name_long.toLowerCase().includes(this.searchQueryCourse.toLowerCase())
                );
                this.filteredCourses = results.length > 0 ? results : [];
            } else {
                this.filteredCourses = this.courses;
            }
        },
        resetStudents(){
            this.filteredStudents=[];
            this.searchQueryStudent="";
        },
        resetCourses(){
            this.filteredCourses=[];
            this.searchQueryCourse="";
        },
        handleBlurStudent() {
            setTimeout(() => {
                this.inputFocusStudent = false;
            }, 200); 
        },
        handleBlurCourse() {
            setTimeout(() => {
                this.inputFocusCourse = false;
            }, 200); 
        },
        addStudentToInput(student){
            this.selectedStudent = student; 
            this.searchQueryStudent = student.names;
        },
        addCourseToInput(course){
            this.selectedCourse = course; 
            this.searchQueryCourse = course.name_long;
        },
        async createEnrollment(){
            try{
                this.newEnrollment.course_id=this.selectedCourse.id;
                this.newEnrollment.user_id=this.selectedStudent.id;
                this.loading=true;
                await EnrollmentsService.postEnrollment(this.newEnrollment);
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
<style scoped>
.search-bar-student{
    display: flex;
    flex-direction: row;
    align-items: center;
    border:3px solid rgb(19, 136, 103);
    border-radius: 10px;
    padding:5px;
}
.search-bar-student-input {
    background-color: transparent; 
    border: none; 
    outline: none; 
    padding: 8px 12px; 
    font-size: 16px;  
    color: #333;
    width: 100%;
}
.search-bar-student-input:focus {
    outline: none; 
}

.student-container {
    position: absolute;
    top: 100%; 
    left: 0;
    width: 100%;
    background: white;
    border: 1px solid #ccc;
    max-height: 200px; 
}

.studentsList {
    list-style: none;
    padding: 0;
    margin: 0;
}

.studentsList li {
    padding: 8px;
    cursor: pointer;
}

.studentsList li:hover {
    background-color: #f1f1f1;
}
.search-bar-course{
    display: flex;
    flex-direction: row;
    align-items: center;
    border:3px solid rgb(69, 100, 187);
    border-radius: 10px;
    padding:5px;
}
.search-bar-course-input {
    background-color: transparent; 
    border: none; 
    outline: none; 
    padding: 8px 12px; 
    font-size: 16px;  
    color: #333;
    width: 100%;
}
.search-bar-course-input:focus {
    outline: none; 
}

.course-container {
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
</style>