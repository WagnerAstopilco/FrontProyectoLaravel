<template>
    <div class="container">
        <div class="card p-4">
            <h1 class="fs-4">{{name}}</h1>
            <div class="col-8 mx-auto">
                <form class="courses-form  p-4"  @submit.prevent="createCertificate()">
                        <div class="form-group ">
                            <label for="issue_date">Fecha de emisión</label>
                            <input type="date" id="issue_date" class="form-control" v-model="newCertificate.issue_date" required>
                        </div>
                        <div class="form-group">
                            <label>Alumnos</label>
                            <Multiselect 
                                v-model="selectedStudent" 
                                :options="availableStudents" 
                                :searchable="true" 
                                openDirection="bottom"
                                placeholder="Selecciona el estudiante"
                                label="names"
                                selectLabel="Presiona enter para seleccionar"
                                selectedLabel="Seleccionado"
                                deselectLabel="Presiona enter para quitar"
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

                        <div class="form-group d-flex flex-column" v-if="selectedStudent">
                            <label for="courses">Cursos matriculados</label>
                            <Multiselect 
                                v-model="selectedCourse" 
                                :options="coursesStudent" 
                                :searchable="true" 
                                openDirection="bottom"
                                placeholder="Selecciona el curso"
                                label="name_long"
                                selectLabel="Presiona enter para seleccionar"
                                selectedLabel="Seleccionado"
                                deselectLabel="Presiona enter para quitar"
                                track-by="id"
                                @change="setDataCertificate()">
                                <template #noOptions>
                                    <span class="text-gray-500">El estudiante no esta matriculado en ningún curso</span>
                                </template>
                                <template #noResult>
                                    <span class="text-gray-500"> No se encontraron coincidencias. </span>
                                </template>
                            </Multiselect>
                        </div>
                        <div v-if="selectedStudent && selectedCourse" class="form-group d-flex flex-column">
                            <div>
                                <label for="start_date">Fecha de inicio</label>
                                <input type="date" id="start_date" class="form-control" v-model="newCertificate.start_date" required>
                            </div>
                            <div>
                                <label for="end_date">Fecha de fin</label>
                                <input type="date" id="end_date" class="form-control" v-model="newCertificate.end_date" required>
                            </div> 
                            <div>
                                <label for="duration_in_hours">Duración en horas</label>
                                <input type="number" id="duration_in_hours" class="form-control" v-model="newCertificate.duration_in_hours" required>
                            </div>
                            <div>
                                <label for="code">Código</label>
                                <input type="text" id="code" class="form-control" v-model="newCertificate.code" required>
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
import Multiselect from 'vue-multiselect';

export default{
    data(){
        return{
            name:'Nuevo Certificado',
            availableStudents:[],
            selectedStudent:null,
            coursesStudent:[],
            selectedCourse:null,
            isViewing: false,
            isEditing: false,
            loading:false,
            newCertificate:{
                user_id:'',
                course_id:'',
                issue_date:'',
                start_date:'',
                end_date:'',
                duration_in_hours:'',
                code:'',
            }
        }
    },
    created(){
        this.getStudents();
    },
    watch: {
        selectedStudent() {
            this.getAvailableCourses();
        },
        selectedCourse() {
            this.setDataCertificate();
        }
    },
    components:{
        Multiselect
    },
    methods:{
        goBack(){
            this.$router.push({name:'Certificados'});
        },
        async getStudents(){
            const response=await UserService.getUsers();
            console.log(response);
            this.availableStudents=response.data.data.filter(user=>user.role==='alumno' &&user.status==='activo');
            console.log(this.availableStudents);
        },

        async getAvailableCourses() {
            try {
                if (this.selectedStudent && this.selectedStudent.enrollments.length>0) {
                    const promises = this.selectedStudent.enrollments.map(enroll =>
                        CourseService.getCourseDetails(enroll.course_id)
                    );

                    const responses = await Promise.all(promises);

                    this.coursesStudent = responses.map(response => response.data.data);
                } else {
                    this.coursesStudent = [];                   
                }
            } catch (error) {
                console.error("Error al obtener los cursos:", error);
                this.coursesStudent = [];
            }
        },
        setDataCertificate(){
            this.newCertificate.start_date=this.selectedCourse.start_date;
            this.newCertificate.end_date=this.selectedCourse.end_date;
            this.newCertificate.duration_in_hours=this.selectedCourse.duration_in_hours;
        },
        
        async createCertificate(){
            try{
                this.newCertificate.user_id=this.selectedStudent.id;
                this.newCertificate.course_id=this.selectedCourse.id;
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