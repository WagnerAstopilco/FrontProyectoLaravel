<template>
    <div class="Materials-container">
        <div class="Materials-card">
            <div class="head-page">
                <h2>Materiales</h2>
                <button type="button" class="btn btn-info" @click="newMaterial"><i class="bi bi-plus"></i>Nuevo</button>            
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
                    <tr v-for="material in materials" :key="material.id" @click="materialDetail(material.id)"> 
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

export default {
    data() {
        return {
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
    methods: {
        async getMaterials(){
            const response=await MaterialService.getMaterials();
            this.materials=response.data.data;
        },
        materialDetail(id) {
            this.$router.push({ name: 'MaterialDetalle', params: { id: id } });
        },
        newMaterial(){
            this.$router.push({name:'MaterialNuevo'});
        }
    }
};
</script>

<style>

</style>