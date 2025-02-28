<template>
    <div class="container">
        <div class="card p-4">
            <div class="head d-flex">
                <h1 class="fs-4">{{ name }}</h1>
                <Preloader :visible="cargando"> </Preloader>          
                <div class="ms-auto">
                    <button type="button" class="btn btn-info m-1" @click="newUser">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-plus-fill" viewBox="0 0 16 16">
                            <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                            <path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5"/>
                        </svg>
                        Nuevo
                    </button>            
                    <button type="button" class="btn btn-info m-1" @click="newCapacitador">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill-up" viewBox="0 0 16 16">
                        <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.354-5.854 1.5 1.5a.5.5 0 0 1-.708.708L13 11.707V14.5a.5.5 0 0 1-1 0v-2.793l-.646.647a.5.5 0 0 1-.708-.708l1.5-1.5a.5.5 0 0 1 .708 0M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                        <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"/>
                        </svg>
                        Promover
                    </button>            
                </div>
            </div>
            <table id="trainersTable" class="table table-striped">
                <thead>
                    <tr>
                        <th>Foto</th>
                        <th>Nombre</th>
                        <th>Apellidos</th>
                        <th>Correo</th>
                        <th>Especialidad</th>
                        <th>Estado</th>

                    </tr>
                </thead>
                <tbody >
                    <tr v-for="trainer in trainers" :key="trainer.id" @click="trainerDetail(trainer.id)" style="cursor:pointer"> 
                        <td>{{ trainer.user.photo }}</td>
                        <td>{{ trainer.user.names}}</td>
                        <td>{{ trainer.user.last_names}}</td>
                        <td>{{ trainer.user.email}}</td>
                        <td>{{ trainer.user.speciality}}</td>
                        <td>{{ trainer.user.status}}</td>

                    </tr>
                </tbody>
            </table>
            <div>

            </div>
        </div>
    </div>
</template>

<script>
import TrainerService from '@/services/TrainersService.js';
import Preloader from '../../../components/Preloader.vue';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import $ from 'jquery';
import 'datatables.net-bs4';

export default {
    data() {
        return {
            name:'Capacitadores',
            cargando:false,
            trainers:[]
        };          
    },
    mounted() {
        this.getTrainers();
    },
    beforeUnmount() {
        if ($.fn.dataTable.isDataTable('#trainersTable')) {
            $('#trainersTable').DataTable().destroy();
        }
    },
    components:{
        Preloader
    },
    methods: {
        async getTrainers(){
            try{
                this.cargando=true;
            const response=await TrainerService.getTrainers();
            this.trainers=response.data.data;
            this.$nextTick(() => {
                    $('#trainersTable').DataTable();
                });
            }catch(error){
                console.log(error);
            }finally{
                this.cargando=false;
            }
        },
        trainerDetail(id) {
        this.$router.push({ name: 'CapacitadorDetallesVer', params: { idcapacitador: id } });
        },
        newUser(){
            this.$router.push({name:'CapacitadorNuevo'});
        }
        

    }
};
</script>

<style>

</style>