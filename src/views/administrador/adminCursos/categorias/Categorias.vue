<template> 
    <div class="container">
        <div class="card p-4">
            <Preloader :visible="cargando"></Preloader>
            <div class="d-flex">
                <h1 class="fs-4">{{ name }}</h1>
                <div class="ms-auto">
                    <button type="button" class="btn btn-green" @click="redirToNewCategory" aria-label="add new category">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                        </svg><span>Nuevo</span>
                        </button>            
                </div>
            </div>
            <div class="table-responsive">
                <table id="categoryTable" class="table table-striped table-hover" >
                    <caption>Lista de categorias</caption>
                    <thead >
                        <tr >
                            <th class="text-center" scope="col">Color</th>
                            <th class="text-center" scope="col">Nombre</th>
                            <th class="text-center" scope="col">Descripción</th>
                        </tr>
                    </thead>
                    <tbody >
                        <tr v-for="category in categories" :key="category.id" class="table-pointer" @click="redirToCategoryDetail(category.id)"> 
                            <td >
                                <div class="form-control w-lg-30 w-md-50 w-60 mx-auto" :style="{ backgroundColor: category.color }"></div>
                            </td>
                            <td>{{ category.name }}</td>
                            <td>{{ category.description }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import Preloader from '../../../components/Preloader.vue';
import CategoryService from '@/services/CategoryService.js'
import $ from 'jquery';
import 'datatables.net-bs4';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';

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
                console.log("categorias", this.categories);
                this.$nextTick(() => {
                    $('#categoryTable').DataTable();
                });
            } catch (error) {
                console.log(error);
                
            }finally{
                this.cargando=false
            }
        },
        redirToCategoryDetail(id) {
        this.$router.push({ name: 'CategoriaDetalleVer', params: { idcategoria: id } });
        },
        redirToNewCategory(){
            this.$router.push({name:'NuevaCategoria'});
        }
    }
};
</script>
