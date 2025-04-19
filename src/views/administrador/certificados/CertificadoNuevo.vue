<template>
    <div class="container">
        <div class="card p-4">
            <h1 class="fs-4">{{name}}</h1>
            <div class="col-8 w-lg-80 w-md-90 w-100 mx-auto">
                <form class="courses-form"  @submit.prevent="createCertificate()">
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
                                :showLabels="false"
                                openDirection="bottom"
                                placeholder="Selecciona el estudiante"
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

                        <div class="form-group d-flex flex-column" v-if="selectedStudent">
                            <label for="courses">Cursos matriculados</label>
                            <Multiselect 
                                v-model="selectedCourse" 
                                :options="coursesStudent" 
                                :searchable="true" 
                                :showLabels="false"
                                openDirection="bottom"
                                placeholder="Selecciona el curso"
                                label="name_long"
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
                        <div class="d-flex justify-content-center gap-3">
                            <button type="submit" class="btn btn-green">{{ loading ? "Agregando..." : "Agregar" }}</button>
                            <button type="button" id="button-cancel" class="btn btn-blue" @click="goBack">Volver</button>
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