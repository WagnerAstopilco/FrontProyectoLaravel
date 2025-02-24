<template> 
  <div class="container">
        <div class="card p-4">
            <div class="head">
                <h1 class="fs-4">{{ name }}</h1>
                <Preloader :visible="cargando"></Preloader>
                <button type="button" style="margin-left: auto;" class="btn btn-info" @click="newCategory"><i class="bi bi-plus"></i> Nuevo</button>            
            </div>
            <table id="categoryTable" class="table table-striped">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                    </tr>
                </thead>
                <tbody >
                    <tr v-if="!categories.length" >
                        <span class="text-center">Sin registros</span>
                    </tr>
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

<style scoped>
</style>