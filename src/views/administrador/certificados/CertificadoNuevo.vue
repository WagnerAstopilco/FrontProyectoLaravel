<template>
    <div class="container">
        <div class="card p-4">
            <h1 class="fs-4">{{name}}</h1>
            <div class="col-8 mx-auto">
                <form class="courses-form  p-4"  @submit.prevent="createCertificate()">
                        <div class="form-group ">
                            <label for="startDate">Fecha de emisión</label>
                            <input type="date" id="startDate" class="form-control" v-model="newCertificate.issue_date" required>
                        </div>
                        <div class="form-group">
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

                        <div class="form-group d-flex flex-column" v-if="selectedStudent">
                            <label for="courses">Cursos matriculados</label>
                            <select name="courses" class="form-control p-2" v-model="newCertificate.course_id">
                                <option value="" disabled selected>---Selecciona un curso---</option>
                                <option v-for="course in coursesStudent" :key="course.id" :value="course.id">
                                    {{ course.name_long }}
                                </option>
                            </select>
                        </div>

                        <div class="" v-if="selectedStudent">
                                <h3 class="fs-5">Alumno seleccionado</h3>
                                <div class="form-group">
                                    <label for="name">Nombre</label>
                                    <input type="text" class="form-control" id="name" v-model="selectedStudent.names" readonly>
                                </div>
                                <div class="form-group">
                                    <label for="last_name">Apellidos</label>
                                    <input type="text" class="form-control" id="last_name" v-model="selectedStudent.last_names" readonly>
                                </div>
                                <div class="form-group">
                                    <label for="email">Correo</label>
                                    <input type="text" class="form-control" id="email" v-model="selectedStudent.email" readonly>
                                </div>
                                <div class="form-group">
                                    <label for="email">Correo</label>
                                    <input type="text" class="form-control" id="email" v-model="selectedStudent.role" readonly>
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
import CertificateService from '../../../services/CertificatesService';

export default{
    data(){
        return{
            name:'Nuevo Certificado',
            students:[],
            filteredStudents: [],
            searchQueryStudent:'',
            selectedStudent: null,
            coursesStudent:[],
            inputFocusStudent:false,
            isViewing: false,
            isEditing: false,
            loading:false,
            newCertificate:{
                user_id:'',
                course_id:'',
                issue_date:'',
                code:'asdfasdfas',
            }
        }
    },
    created(){
        this.getStudents();
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

        async getCoursesStudent() {
            try {
                if (this.selectedStudent && this.selectedStudent.enrollments.length>0) {
                    const promises = this.selectedStudent.enrollments.map(enroll =>
                        CourseService.getCourseDetails(enroll.course_id)
                    );

                    const responses = await Promise.all(promises);

                    this.coursesStudent = responses.map(response => response.data.data);
                } else {
                    this.coursesStudent = [];
                    console.warn("El estudiante seleccionado no tiene inscripciones.");
                }
            } catch (error) {
                console.error("Error al obtener los cursos:", error);
                this.coursesStudent = [];
            }
        },
        
        resetStudents(){
            this.filteredStudents=[];
            this.searchQueryStudent="";
        },
        handleBlurStudent() {
            setTimeout(() => {
                this.inputFocusStudent = false;
            }, 200); 
        },
        addStudentToInput(student){
            this.selectedStudent = student; 
            this.getCoursesStudent();
            this.searchQueryStudent = student.names;
        },
        async createCertificate(){
            try{
                this.newCertificate.user_id=this.selectedStudent.id;
                this.loading=true;
                await CertificateService.postCertificate(this.newCertificate);
            }catch(error){
                console.log(error);
            }
            finally{
                this.loading=false;
                this.$router.push({name:'Certificados'});
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

</style>