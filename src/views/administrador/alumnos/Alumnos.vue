<template>
    <div class="container">
        <div class="card p-4">
            <div class="head d-flex">
                <h1 class="fs-4">{{name}}</h1>
                <Preloader :visible="cargando"></Preloader>
                <div class="ms-auto">
                    <button type="button" class="btn btn-info" @click="newStudent">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                        </svg>
                        Nuevo</button>            
                </div>
            </div>
            <table id="studentsTable" class="table table-striped">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                    </tr>
                </thead>
                <tbody >
                    <tr v-for="category in categories" :key="category.id" @click="categoryDetail(category.id)" style="cursor:pointer"> 
                        <td>{{ category.name }}</td>
                        <td>{{ category.description }}</td>
                    </tr>
                </tbody>
            </table>
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
        }
    },
    created(){
        this.getUsers();
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
        async getUsers(){
            const response=await UserService.getUsers();
            console.log(response);
            this.students=response.data.data.filter(user=>user.role==='alumno');
            this.$nextTick(() => {
                    $('#studentsTable').DataTable();
                });
        },  
        newStudent(){
            this.$router.push({name: 'AlumnoNuevo'});
        }
    }
}
</script>
