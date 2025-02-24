<template>
  <div class="courses-container">
        <div class="courses-card">
            <div class="head-page">
                <h2>Cursos</h2>
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
                    <tr v-for="course in courses" :key="course.id" @click="courseDetail(course.id)"> 
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

export default {
    data() {
        return {
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
    methods: {
        async getCourses(){
            const response=await CourseService.getCourses();
            this.courses=response.data.data;
            this.$nextTick(() => {
                $('#coursesTable').DataTable();
            });
        },
        courseDetail(id) {
        this.$router.push({ name: 'CursoDetalle', params: { id: id } });
        },
        newCourse(){
            this.$router.push({name:'CursoNuevo'});
        }
    }
};
</script>
<style>

</style>