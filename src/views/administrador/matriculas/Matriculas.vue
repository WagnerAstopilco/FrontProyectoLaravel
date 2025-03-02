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
                        <th>Nombres</th>
                        <th>Apellidos</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody >
                    <tr v-for="enroll in this.enrollments" :key="enroll.id" style="cursor:pointer"> 
                        <td @click="enrollDetail(enroll.id)">{{ enroll.names }}</td>
                        <td @click="enrollDetail(enroll.id)">{{ enroll.last_names }}</td>
                        
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import Preloader from '../../components/Preloader.vue';
import EnrollmentService from '@/services/EnrollmentsService.js'

export default{
    data(){
        return{
            name:'Matrículas',
            enrollments:[],
        }
    },
    created(){
        this.getEnrollments();
    },
    components:{
        Preloader
    },
    methods:{
        async getEnrollments(){
            try{
                this.cargando=true;
                await EnrollmentService.getEnrollments();
            }catch(error){
                console.log(error);
            }finally{
                this.cargando=false;
            }
        }
    },
}
</script>
