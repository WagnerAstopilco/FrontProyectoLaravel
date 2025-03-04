<template>
    <div class="container">
        <div class="card p-4">
            <div class="head d-flex">
                <h1 class="fs-4">{{name}}</h1>
                <Preloader :visible="cargando"></Preloader>
                <div class="ms-auto">
                    <button type="button" class="btn btn-info" @click="newEnroll">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                        </svg>
                        Nuevo</button>            
                </div>
            </div>

            <table id="enrollmentsTable" class="table table-striped">
                <thead>
                    <tr>
                        <th>Inicio matrícula</th>
                        <th>Fin matrícula</th>
                        <th>Alumno</th>
                        <th>Curso</th>
                        <th>Estado</th>

                    </tr>
                </thead>
                <tbody >
                    <tr v-for="enroll in this.enrollments" :key="enroll.id"  style="cursor:pointer"> 
                        <td @click="enrollDetail(enroll.id)">{{ enroll.enrollment_date }}</td>
                        <td @click="enrollDetail(enroll.id)">{{ enroll.end_enrollment_date }}</td>
                        <td @click="enrollDetail(enroll.id)">{{ enroll.user.names }} {{ enroll.user.last_names }}</td>
                        <td @click="enrollDetail(enroll.id)">{{ enroll.course.name_long }}</td>
                        <td>{{ enroll.status }}</td>
                        
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import Preloader from '../../components/Preloader.vue';
import EnrollmentService from '@/services/EnrollmentsService.js';
import $ from 'jquery';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-bs4';

export default{
    data(){
        return{
            name:'Matrículas',
            enrollments:[],
            cargando:false,
        }
    },
    created(){
        this.getEnrollments();
    },
    beforeUnmount() {
        if ($.fn.dataTable.isDataTable('#categoryTable')) {
            $('#categoryTable').DataTable().destroy();
        }
    },
    components:{
        Preloader
    },
    methods:{
        async getEnrollments(){
            try{
                this.cargando=true;
                const response= await EnrollmentService.getEnrollments();
                this.enrollments=response.data.data;
                console.log("matriculas",this.enrollments);
                this.$nextTick(() => {
                    $('#enrollmentsTable').DataTable();
                });
            }catch(error){
                console.log(error);
            }finally{
                this.cargando=false;
            }
        },
        newEnroll(){
            this.$router.push({name: 'MatriculaNueva'});
        },
        enrollDetail(id){
            this.$router.push({name:'MatriculaDetallesVer',params:{idmatricula:id}})
        }
    },
}
</script>

