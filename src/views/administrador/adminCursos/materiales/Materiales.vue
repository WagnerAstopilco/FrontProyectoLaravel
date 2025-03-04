<template>
    <div class="container">
        <div class="card p-4">
            <div class="head d-flex">
                <h1 class="fs-4">{{ name }}</h1>
                <Preloader :visible="cargando"></Preloader>
                <div class="ms-auto">
                    <button type="button" class="btn btn-info" @click="newMaterial">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                        </svg>
                        Nuevo</button>            
                </div>
            </div>

            <table id="materialsTable" class="table table-striped">
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Tipo</th>
                        <th>Grado</th>
                        <th>Contenido</th>
                    </tr>
                </thead>
                <tbody >
                    <tr v-for="material in materials" :key="material.id" @click="materialDetail(material.id)" style="cursor:pointer"> 
                        <td>{{ material.title }}</td>
                        <td>{{ material.type }}</td>
                        <td>{{ material.grado }}</td>
                        <td>{{ material.content }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import MaterialService from '@/services/MaterialsService.js'
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import $ from 'jquery';
import 'datatables.net-bs4';
import Preloader from '../../../components/Preloader.vue';

export default {
    data() {
        return {
            name:'Materiales',
            cargando:false,
            materials:[]
        };          
    },
    created() {
        this.getMaterials();
    },
    beforeUnmount() {
        if ($.fn.dataTable.isDataTable('#materialsTable')) {
            $('#materialsTable').DataTable().destroy();
        }
    },
    components:{
        Preloader
    },
    methods: {
        async getMaterials(){
            try{
                this.cargando=true;
                const response=await MaterialService.getMaterials();
                this.materials=response.data.data;
                this.$nextTick(()=>{
                    $('#materialsTable').DataTable();
                });
            
            }catch(error){
                console.log(error);
            }
            finally{
                this.cargando=false;
            }
        },
        materialDetail(id) {
            this.$router.push({ name: 'MaterialDetalleVer', params: { idmaterial: id } });
        },
        newMaterial(){
            this.$router.push({name:'MaterialNuevo'});
        }
    }
};
</script>
