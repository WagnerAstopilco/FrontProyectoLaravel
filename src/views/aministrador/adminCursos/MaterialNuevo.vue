<template>
    <div class="new-material">
    <h1>Nuevo Material</h1>
    <form @submit.prevent="addMaterial">
        <div class="form-group">
            <label for="title">Titulo</label>
            <input type="text" id="title" v-model="newMaterial.title" placeholder="Titulo del material"/>
        </div>
        <div class="form-group">
            <label for="grado">Grado</label>
            <select name="grado" v-model="newMaterial.grado">
                <option value="" disabled selected>---Selecciona un grado---</option>
                <option value="lesson">Lección</option>
                <option value="course">Curso</option>
            </select>
        </div>
        <div class="form-group" v-if="newMaterial.grado === 'lesson'">
            <label for="lesson">Selecciona una Lección</label>
            <select name="lesson" v-model="newMaterial.lesson_id" required>
                <option value="" disabled selected>{{lessonList? "---Selecciona una lección---":"---No hay lecciones disponibles---"}}</option>
                <option v-for="lesson in lessons" :key="lesson.id" :value="lesson.id">
                    {{ lesson.name }}
                </option>
            </select>
        </div>
        <!-- <div class="form-group" v-if="newMaterial.grado === 'course'">
            <label for="lesson">Selecciona un curso</label>
            <select name="lesson" v-model="newMaterial.course_id" required>
                <option value="" disabled selected>{{courseList? "---Selecciona un curso---":"---No hay cursos disponibles---"}}</option>
                <option v-for="course in courses" :key="course.id" :value="course.id">
                    {{ course.name_long }}
                </option>
            </select>
        </div> -->
        <div class="form-group">
            <label for="type">Tipo</label>
            <select name="type" v-model="newMaterial.type">
                <option value="" disabled selected>---Selecciona un tipo---</option>
                <option value="file">Archivo</option>
                <option value="link">Enlace</option>
                <option value="video">Video</option>
                <option value="pdf">PDF</option>
            </select>
        </div>
        <div class="form-group">
            <label for="link">Link</label>
            <input type="text" id="link" v-model="newMaterial.url" placeholder="Enlace al material"/>
        </div>
        <div class="form-group">
            <label for="content">Contenido</label>
            <textarea id="content" v-model="newMaterial.content" placeholder="Contenido del material"></textarea>
        </div>
        <p v-if="error" class="error">{{ error }}</p>     
        <div class="buttons">
        <button type="submit" class="btn btn-info">{{ loading ? "Agregando..." : "Agregar" }}</button>
        <button type="button" class="btn btn-primary" @click="goBack">Volver</button>
        </div>
    </form>
</div>
</template>
<script>
import MaterialService from '@/services/MaterialsService.js';
import LessonService from '@/services/LessonsService.js';
// import CourseService from '@/services/CoursesService.js';

export default {
data() {
    return {
        newMaterial: {
            title:"",
            grado: "",
            type: "",
            url: "",
            content: ""
        },
        lessons:[],
        courses:[],
        error: "",
        loading: false,
        lessonList:false,
        courseList:false,
    };
},
created(){
    // this.listCourses();
    this.listLessons();
},
methods: {
    goBack() {
        this.$router.push({ name: 'Materiales' }); 
    },
    async addMaterial() {
        this.error = "";
        this.loading = true;
        try {
            const response = await MaterialService.postMaterial(this.newMaterial);
            const materialId = response.data.data.id;
            this.$router.push({name: 'MaterialDetalle',params: { id: materialId },});
        } catch (err) {
            if (err.response && err.response.status === 422) {
            // Mostrar los errores de validación
            this.error = Object.values(err.response.data.errors).flat().join(" ");
            } else {
            this.error = "Error al agregar el curso.";
            }
        } finally {
            this.loading = false;
        }
    },
    async listLessons() {
            const response = await LessonService.getLessons(); 
            this.lessons = response.data.data;             
            this.lessonList=true;
    },
    // async listCourses() {
    //         const response = await CourseService.getCourses(); 
    //         this.courses = response.data.data;
    //         this.courseList=true;
    // },
}
};
</script>
<style scoped>
.new-material {
max-width: 600px;
margin: 0 auto;
}
.form-group {
margin-bottom: 1em;
}
label {
display: block;
margin-bottom: 0.5em;
}
input,
textarea,select {
width: 100%;
padding: 0.5em;
box-sizing: border-box;
}
button {
padding: 0.5em 1em;
border: none;
cursor: pointer;
}
.error{
color:red;
}
.buttons{
display: flex;
justify-self: center;
max-width: 50%;
min-width: 50%;
justify-content: space-around;
}

</style>