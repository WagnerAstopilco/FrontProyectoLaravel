<template>
    <div class="container">
        <div class="card p-4">
            <Preloader :visible="cargando"></Preloader>
            <div class=" d-flex">
                <h1 class="fs-4">{{ name }}</h1>                   
                <button type="button" class="btn ms-auto btn-green" @click="redirToNewCourse"><i class="bi bi-plus" ></i>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/></svg>
                    Nuevo
                </button>            
            </div>
            <div class="table-responsive">
                <table id="coursesTable" class="table table-striped table-hover">
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
                        <tr v-for="course in courses" :key="course.id" @click="redirToCourseDetail(course.id)" style="cursor:pointer"> 
                            <td><img :src="getImagenUrl(course.image)" class="card-img img-fluid" style="max-width: 120px; max-height: 80;" alt="CursoImagen"/></td>
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
    </div>
</template>
<script>
import CourseService from '@/services/CoursesService.js'
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-bs4';
import $ from 'jquery';
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
            try {
                this.cargando = true;
                const response = await CourseService.getCourses();
                this.courses = response.data.data;
                this.$nextTick(() => {
                    $('#coursesTable').DataTable();
                });

            } catch (error) {
                console.log(error);
            } finally {
                this.cargando = false;
            }
        },
        redirToCourseDetail(id) {
            this.$router.push({ name: 'CursoDetalleVer', params: { idcurso: id } });
        },
        redirToNewCourse(){
            this.$router.push({name:'CursoNuevo'});
        },
        getImagenUrl(imagen) {
            if (imagen) {
                return process.env.VUE_APP_API_URL + "/storage/" + imagen; 
            }
        },
    }
};
</script>