<template>
    
  <div class="category-container">
        <div class="category-card">
            <div>
                <h2>Categorías</h2>
                <button type="button" class="btn btn-info" @click="newCategory"><i class="bi bi-plus"></i> Nuevo</button>            
            </div>

            <table id="categoryTable" class="table table-striped">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                    </tr>
                </thead>
                <tbody >
                    <tr v-for="category in categories" :key="category.id" @click="goToCategoryDetail(category.id)"> 
                        <td>{{ category.name }}</td>
                        <td>{{ category.description }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import CategoryService from '@/services/CategoryService.js'
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import $ from 'jquery';
import 'datatables.net-bs4';

export default {
    data() {
        return {
            categories:[]
        };          
    },
    mounted() {
        this.getCategories();
    },
    beforeUnmount() {
        if ($.fn.dataTable.isDataTable('#categoryTable')) {
            $('#categoryTable').DataTable().destroy();
        }
    },
    methods: {
        async getCategories() {
            const response = await CategoryService.getCategories();
            this.categories = response.data.data;
            this.$nextTick(() => {
                $('#categoryTable').DataTable();
            });
        },
        goToCategoryDetail(id) {
        this.$router.push({ name: 'CategoriaDetalle', params: { id: id } });
        },
        newCategory(){
            this.$router.push({name:'NuevaCategoria'});
        }
    }
};
</script>

<style>
#categoryTable{
    background-color: #ffffff;
    max-width: 98%;
}
thead{
    background-color: #000000;
    color:#ffffff
}
tr{
    cursor: pointer;
}
</style>