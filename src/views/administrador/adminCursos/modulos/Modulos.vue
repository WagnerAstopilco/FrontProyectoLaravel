<template>
    <div class="container">
        <div class="card p-4">
            <div class="head d-flex">
                <h1 class="fs-4">{{ name }}</h1>
                <Preloader :visible="cargando"></Preloader>
                <button type="button" class="btn btn-green ms-auto" @click="newModule">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                    </svg>
                    Nuevo</button>            
            </div>

            <table id="modulesTable" class="table table-striped">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                    </tr>
                </thead>
                <tbody >
                    <tr v-for="module in modules" :key="module.id" @click="moduleDetail(module.id)" style="cursor:pointer">
                        <td>{{ module.name }}</td>
                        <td>{{ module.description }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import ModuleService from '@/services/ModulesService.js'
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import $ from 'jquery';
import 'datatables.net-bs4';
import Preloader from '../../../components/Preloader.vue';

export default {
    data() {
        return {
            name:'Módulos',
            cargando:false,
            modules:[]
        };          
    },
    mounted() {
        this.getModules();
    },
    beforeUnmount() {
        if ($.fn.dataTable.isDataTable('#modulesTable')) {
            $('#modulesTable').DataTable().destroy();
        }
    },
    components:{
        Preloader
    },
    methods: {
        async getModules(){
            try{
                this.cargando=true;
                const response=await ModuleService.getModules();
                this.modules=response.data.data;
                this.$nextTick(() => {
                    $('#modulesTable').DataTable();
                });
            }catch(error){
                console.log(error);
            } finally{
                this.cargando=false;
            }
        },
        newModule(){
            this.$router.push({name:'ModuloNuevo'});
        },
        moduleDetail(id){
            console.log(id);
            this.$router.push({ name: 'ModuloDetalleVer', params: { idmodulo: id } });
        }
    }
};
</script>
