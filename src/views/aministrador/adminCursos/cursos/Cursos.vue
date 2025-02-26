<template>
  <div class="container">
        <div class="card p-4">
            <div class="head">
                <h1 class="fs-4">{{ name }}</h1>
                <Preloader :visible="cargando"></Preloader>
                <button type="button" class="btn btn-info" @click="newCourse"><i class="bi bi-plus"></i> Nuevo</button>            
            </div>

            <table id="coursesTable" class="table table-striped">
                <thead>
                    <tr>
                        <th>Imagen</th>
                        <th>Nombre</th>
                        <th>Abreviación</th>
                        <th>Categoría</th>
                        <th>Precio</th>
                        <th>Descripción</th>
                    </tr>
                </thead>
                <tbody >
                    <tr v-for="course in courses" :key="course.id" @click="courseDetail(course.id)" style="cursor:pointer"> 
                        <td>{{ course.image }}</td>
                        <td>{{ course.name_long }}</td>
                        <td>{{ course.name_short }}</td>
                        <td>{{ course.category.name }}</td>
                        <td>{{ course.price }}</td>
                        <td>{{ course.description }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import CourseService from '@/services/CoursesService.js'
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import $ from 'jquery';
import 'datatables.net-bs4';
import Preloader from '../../../components/Preloader.vue';

export default {
    data() {
        return {
            name:'Cursos',
            cargando:false,
            courses:[]
        };          
    },
    created() {
        this.getCourses();
    },
    beforeUnmount() {
        if ($.fn.dataTable.isDataTable('#coursesTable')) {
            $('#coursesTable').DataTable().destroy();
        }
    },
    components:{
        Preloader
    },
    methods: {
        async getCourses(){
            try{
                this.cargando=true;
                const response=await CourseService.getCourses();
                this.courses=response.data.data;
                this.$nextTick(() => {
                    $('#coursesTable').DataTable();
                });
            }catch(error){
                console.log(error);
            }finally{
                this.cargando=false;
            }
        },
        courseDetail(id) {
            this.$router.push({ name: 'CursoDetalleVer', params: { idcurso: id } });
        },
        newCourse(){
            this.$router.push({name:'CursoNuevo'});
        }
    }
};
</script>
<style>

</style>