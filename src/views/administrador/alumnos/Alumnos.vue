<template>
    <div class="container">
        <div class="card p-4">
            <Preloader :visible="cargando"></Preloader>
            <div class="d-flex align-items-center">
                <h1 class="fs-4">{{name}}</h1>
                <div class="d-flex w-100 justify-content-end justify-content-md-end m-md-3 m-1">
                    <button type="button" class="btn btn-green" @click="newStudent">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                        </svg>
                        Nuevo</button>            
                </div>
            </div>
            <div class="table-responsive">
                <table id="studentsTable" class="table table-striped">
                <thead>
                    <tr>
                        <th class="text-center d-none d-md-table-cell">Foto</th>
                        <th class="text-center">Nombre</th>
                        <th class="text-center">Apellidos</th>
                        <th class="text-center d-none d-md-table-cell">Correo</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody >
                    <tr v-for="student in this.students" :key="student.id" style="cursor:pointer"> 
                        <td class="d-none d-md-table-cell"><img :src="getImagenUrl(student.photo)" class="card-img img-fluid" style="max-width: 80px; max-height: 120px;" alt="Foto perfil" @click="goToStudentDetail(student.id)"></td>
                        <td @click="goToStudentDetail(student.id)">{{ student.names}}</td>
                        <td @click="goToStudentDetail(student.id)">{{ student.last_names}}</td>
                        <td @click="goToStudentDetail(student.id)" class="d-none d-md-table-cell">{{ student.email}}</td>
                        <td>
                            <button type="button" :class="student.status === 'activo' ? 'btn btn-success' : 'btn btn-danger'" @click="changeStatus(student.id)">
                                <svg v-if="student.status === 'activo'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                    <path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0zM7.646 10.854a.5.5 0 0 1-.708 0L4 7.707 5.207 6.5l2.439 2.438 4.708-4.707 1.414 1.414-5.854 5.854z"/>
                                </svg>
                                <svg v-if="student.status === 'inactivo'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                                </svg>
                                {{student.status}}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            </div>            
            
        </div>
    </div>
</template>
<script>
import Preloader from '../../components/Preloader.vue';
import UserService from '@/services/UsersService.js';
import $ from 'jquery';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-bs4';

export default{
    data(){
        return{
            name:'Alumnos',
            cargando:false,
            students:[],
            student:null,
        }
    },
    created(){
        this.getStudents();
    },
    beforeUnmount() {
        if ($.fn.dataTable.isDataTable('#studentsTable')) {
            $('#studentsTable').DataTable().destroy();
        }
    },
    components:{
        Preloader
    },
    methods:{
        async getStudents(){
            try{
                this.cargando=true;
                const response=await UserService.getUsers();
                this.students=response.data.data.filter(user=>user.role==='alumno');
                this.$nextTick(() => {
                        $('#studentsTable').DataTable();
                    });
            }catch(error){
                console.log(error);
            }finally{
                this.cargando=false;
            }
        },        
        newStudent(){
            this.$router.push({name: 'AlumnoNuevo'});
        },
        goToStudentDetail(studentId){
            this.$router.push({name: 'AlumnoDetallesVer', params:{idalumno: studentId}})
        },
        async changeStatus(id){
            const response= await UserService.getUserDetails(id);
            this.student=response.data.data;
            if(this.student.status==="activo"){
                this.student.status='inactivo'
            }
            else{
                this.student.status='activo'
            }
            const formDataStudent = new FormData();
            formDataStudent.append("status", this.student.status);
            try{
                this.cargando=true
                await UserService.patchUser(this.student.id,formDataStudent);
                this.getStudents();
            }catch(err){
                console.log(err);
            }
        },
        getImagenUrl(photo) {
            if (photo) {
                return process.env.VUE_APP_API_URL + "/storage/" + photo; 
            }
        },  
    }
}
</script>
