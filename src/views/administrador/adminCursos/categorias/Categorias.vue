<template> 
  <div class="container">
        <div class="card p-4">
            <div class="head d-flex">
                <h1 class="fs-4">{{ name }}</h1>
                <Preloader :visible="cargando"></Preloader>
                <div class="ms-auto">
                    <button type="button" class="btn btn-info" @click="newCategory">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                        </svg>
                        Nuevo</button>            
                </div>
            </div>
            <table id="categoryTable" class="table table-striped">
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
import CategoryService from '@/services/CategoryService.js'
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import $ from 'jquery';
import 'datatables.net-bs4';
import Preloader from '../../../components/Preloader.vue';

export default {
    data() {
        return {
            name:'Categorías',
            cargando:false,
            categories:[],
        };          
    },
    created() {
     this.getCategories();
    },
    beforeUnmount() {
        if ($.fn.dataTable.isDataTable('#categoryTable')) {
            $('#categoryTable').DataTable().destroy();
        }
    },
    components:{
        Preloader
    },
    methods: {
        async getCategories() {           
            try {
                this.cargando=true;
                const response = await CategoryService.getCategories();
                this.categories = response.data.data;
                this.$nextTick(() => {
                    $('#categoryTable').DataTable();
                });
            } catch (error) {
                console.log(error);
                
            }finally{
                this.cargando=false
            }
        },
        categoryDetail(id) {
        this.$router.push({ name: 'CategoriaDetalleVer', params: { idcategoria: id } });
        },
        newCategory(){
            this.$router.push({name:'NuevaCategoria'});
        }
    }
};
</script>
