<template>
    <div class="container">
        <div class="card p-4">
            <h1 class="card-title fs-4">{{ name }}</h1>
            <div class="card-body col-8 mx-auto">
                <form @submit.prevent="addMaterial">
                    <div class="form-group d-flex flex-column">
                        <label for="title">Titulo</label>
                        <input type="text" id="title" class="form-control p-2" v-model="newMaterial.title" placeholder="Titulo del material"/>
                    </div>
                    <div class="form-group">
                        <label for="grado">Grado</label>
                        <select name="grado" v-model="newMaterial.grado" class="form-control p-2">
                            <option value="" disabled selected>---Selecciona un grado---</option>
                            <option value="leccion">Lección</option>
                            <option value="curso">Curso</option>
                        </select>
                    </div>
                    <div class="form-group" v-if="newMaterial.grado === 'lesson'">
                        <label for="lesson">Selecciona una Lección</label>
                        <select name="lesson" v-model="newMaterial.lesson_id" class="form-control p-2" required>
                            <option value="" disabled selected>{{lessonList? "---Selecciona una lección---":"---No hay lecciones disponibles---"}}</option>
                            <option v-for="lesson in lessons" :key="lesson.id" :value="lesson.id">
                                {{ lesson.title }}
                            </option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="type">Tipo</label>
                        <select name="type" v-model="newMaterial.type" class="form-control p-2">
                            <option value="" disabled selected>---Selecciona un tipo---</option>
                            <option value="file">Archivo</option>
                            <option value="link">Enlace</option>
                            <option value="video">Video</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="link">Link</label>
                        <input type="text" id="link" v-model="newMaterial.url" class="form-control p-2" placeholder="Enlace al material"/>
                    </div>
                    <div class="form-group">
                        <label for="content">Contenido</label>
                        <textarea id="content" v-model="newMaterial.content" class="form-control p-2" placeholder="Contenido del material"></textarea>
                    </div>
                    <p v-if="error" class="error">{{ error }}</p>     
                    <div class="d-flex justify-content-center">
                    <button type="submit" class="btn btn-info m-2">{{ loading ? "Agregando..." : "Agregar" }}</button>
                    <button type="button" class="btn btn-primary m-2" @click="goBack">Volver</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
import MaterialService from '@/services/MaterialsService.js';
import LessonService from '@/services/LessonsService.js';

export default {
data() {
    return {
        name: 'Nuevo Material',
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
            this.$router.push({name: 'MaterialDetalleVer',params: { idmaterial: materialId },});
        } catch (err) {
            if (err.response && err.response.status === 422) {
            // Mostrar los errores de validación
            this.error = Object.values(err.response.data.errors).flat().join(" ");
            } else {
            this.error = "Error al agregar el material.";
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
