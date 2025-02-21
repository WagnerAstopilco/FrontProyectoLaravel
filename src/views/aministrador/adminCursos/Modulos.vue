<template>
    <div class="modules-container">
        <div class="module-card">
            <div class="head-page">
                <h2>Modulos</h2>
                <button type="button" class="btn btn-info" @click="newModule"><i class="bi bi-plus"></i>Nuevo</button>            
            </div>

            <table id="modulessTable" class="table table-striped">
                <thead>
                    <tr>
                        <th>Orden</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                    </tr>
                </thead>
                <tbody >
                    <tr v-for="module in modules" :key="module.id" @click="moduleDetail(module.id)"> 
                        <td>{{ module.order }}</td>
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
export default {
    data() {
        return {
            modules:[]
        };          
    },
    mounted() {
        this.getModules();
    },
    beforeUnmount() {
        if ($.fn.dataTable.isDataTable('#coursesTable')) {
            $('#coursesTable').DataTable().destroy();
        }
    },
    methods: {
        async getModules(){
            const response=await ModuleService.getModules();
            this.modules=response.data.data;
            this.$nextTick(() => {
                $('#coursesTable').DataTable();
            });
        },
        newModule(){
            this.$router.push({name:'ModuloNuevo'});
        },
        moduleDetail(id){
            this.$router.push({ name: 'ModuloDetalle', params: { id: id } });
        }
    }
};
</script>

<style>

</style>