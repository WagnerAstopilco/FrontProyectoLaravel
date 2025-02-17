<template>
    <div class="login-container">
        <div class="login-card">
            <h2>Cursos</h2>            
            <div>
                {{courses}}
            </div>

        </div>
    </div>
</template>
<script>
import CourseService from '@/services/CoursesService.js'
export default {
    data() {
        return {
            courses:[]
        };          
    },
    mounted() {
        this.getCourses();
    },
    methods: {
        async getCourses(){
            const response=await CourseService.getCourses();
            this.courses=response.data.data;
        }
    }
};
</script>
<style>

</style>