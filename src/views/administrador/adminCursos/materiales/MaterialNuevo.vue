<template>
    <div class="container">
        <div class="card p-4">
            <h1 class="card-title fs-4">{{ name }}</h1>
            <div class="card-body w-lg-80 w-md-90 w-100  mx-auto">
                <form @submit.prevent="createMaterial()">
                    <div class="form-group d-flex flex-column">
                        <label for="title">Titulo</label>
                        <input type="text" id="title" class="form-control p-2" v-model="newMaterial.title" placeholder="Titulo del material"/>
                    </div>
                    <div class="form-group">
                        <label for="grado">Grado</label>
                        <select name="grado" v-model="newMaterial.grade" class="form-control p-2">
                            <option value="" disabled selected>---Selecciona un grado---</option>
                            <option value="leccion">Lección</option>
                            <option value="curso">Curso</option>
                        </select>
                    </div>
                    <div class="form-group d-flex flex-column" v-if="newMaterial.grade==='curso'">
                        <label for="title">Cursos</label>
                        <Multiselect 
                            v-model="selectedCourses" 
                            :options="availableCourses" 
                            :multiple="true"
                            :searchable="true" 
                            :showLabels="false"
                            openDirection="bottom"
                            placeholder="Selecciona cursos para agregar"
                            label="name_long"
                            track-by="id" class="">
                            <template #noOptions>
                                <span class="text-gray-500">No hay cursos disponibles</span>
                            </template>
                            <template #noResult>
                                <span class="text-gray-500"> No se encontraron coincidencias. </span>
                            </template>
                        </Multiselect>
                    </div>
                    <div class="form-group d-flex flex-column" v-if="newMaterial.grade==='leccion'">
                        <label for="title">Curso</label>
                        <Multiselect 
                            v-model="course" 
                            :options="availableCourses" 
                            :searchable="true" 
                            :showLabels="false"
                            openDirection="bottom"
                            placeholder="Selecciona el curso"
                            label="name_long"
                            track-by="id" 
                            @change="getAvailableLessons()">
                            <template #noOptions>
                                <span class="text-gray-500">No hay cursos disponibles</span>
                            </template>
                            <template #noResult>
                                <span class="text-gray-500"> No se encontraron coincidencias. </span>
                            </template>
                        </Multiselect>
                    </div>
                    <div class="form-group d-flex flex-column" v-if="newMaterial.grade==='leccion'&&course">
                        <label for="title">Lecciones del curso</label>
                        <Multiselect 
                            v-model="selectedLesson" 
                            :options="availableLessons" 
                            :searchable="true"       
                            :showLabels="false"                      
                            openDirection="bottom"
                            placeholder="Selecciona lección para agregar"
                            label="title"
                            track-by="id" class="">
                            <template #noOptions>
                                <span class="text-gray-500">No hay lecciones disponibles</span>
                            </template>
                            <template #noResult>
                                <span class="text-gray-500"> No se encontraron coincidencias. </span>
                            </template>
                        </Multiselect>
                    </div>
                    <div class="form-group">
                        <label for="type">Tipo</label>
                        <select name="type" v-model="newMaterial.type" class="form-control p-2">
                            <option value="" disabled selected>---Selecciona un tipo---</option>
                            <option value="file">Archivo</option>
                            <option value="link">Enlace</option>
                            <option value="video">Video</option>
                            <option value="text">Texto</option>
                        </select>
                    </div>
                    <div class="form-group" v-if="newMaterial.type==='file'">
                        <label for="file">Archivo</label>
                        <input type="file" class="form-control" id="file" @change="handleFileUpload">
                    </div>
                    <div class="form-group" v-if="newMaterial.type==='link'||newMaterial.type==='video'">
                        <label for="link">Link</label>
                        <input type="text" id="link" v-model="newMaterial.url" class="form-control p-2" placeholder="Enlace al material"/>
                    </div>
                    <div class="form-group" v-if="newMaterial.type==='text'">
                        <label for="content">Contenido</label>
                        <textarea id="content" v-model="newMaterial.content" class="form-control p-2" placeholder="Contenido del material"></textarea>
                    </div>
                    <p v-if="error" class="error">{{ error }}</p>     
                    <div class="d-flex justify-content-center gap-3">
                    <button type="submit" class="btn btn-green">{{ loading ? "Agregando..." : "Agregar" }}</button>
                    <button type="button" class="btn btn-blue" @click="goBack">Volver</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
import MaterialService from '@/services/MaterialsService.js';
import ModuleService from '@/services/ModulesService.js';
import CourseService from '@/services/CoursesService.js';
import LessonService from '@/services/LessonsService.js';
import CourseMaterialService from '@/services/CourseMaterialService.js';
import Multiselect from "vue-multiselect";

export default {
data() {
    return {
        name: 'Nuevo Material',
        newMaterial: {
            title:'',
            grade:'curso',
            type: 'file ',
            file:'',
            url: '',
            content: '',
            order_in_lesson:'',
            lesson_id:'',
        },
        newCourseMaterial:{
            order:'',
            material_id:'',
            course_id:'',
        },
        availableCourses:[],
        selectedCourses:[],
        course:null,
        modulesToCourse:[],
        availableLessons:[],
        selectedLesson:null,
        error: '',
        loading: false,
    };
},
watch: {
    course(newCourse) {
        if (newCourse) {
            this.getAvailableLessons();
        }
    }
},

mounted(){
    this.getAvailableCourses();
},
components:{
    Multiselect,
},
methods: {
    goBack() {
        this.$router.push({ name: 'Materiales' }); 
    },
    async createMaterial() {
        this.error = "";
        this.loading = true;
        const formData = new FormData();
            formData.append("title", this.newMaterial.title);
            formData.append("grade", this.newMaterial.grade);
            formData.append("type", this.newMaterial.type);
            formData.append("url", this.newMaterial.url);
            formData.append("content", this.newMaterial.content);            
            if (this.newMaterial.file) {
                formData.append("file", this.newMaterial.file);
            }
        try {
            if(this.newMaterial.grade==='curso'){
                const response=await MaterialService.postMaterial(formData);
                const materialId=response.data.data.id;
                for(let course of this.selectedCourses){
                    this.newCourseMaterial.material_id=materialId;
                    this.newCourseMaterial.course_id=course.id;
                    this.newCourseMaterial.order=course.materials.length+1;
                    await CourseMaterialService.postCourseMaterial(this.newCourseMaterial);
                }
                this.$router.push({name: 'MaterialDetalleVer',params: { idmaterial: materialId },});
            }
            if(this.newMaterial.grade==='leccion'){
                let response=await LessonService.getLessonDetails(this.selectedLesson.id);
                const leccion=response.data.data;
                this.newMaterial.order_in_lesson=leccion.materials.length+1;
                this.newMaterial.lesson_id=leccion.id;
                formData.append("order_in_lesson", this.newMaterial.order_in_lesson);
                formData.append("lesson_id", this.newMaterial.lesson_id);
                response=await MaterialService.postMaterial(formData);
                
                this.$router.push({name: 'MaterialDetalleVer',params: { idmaterial: response.data.data.id },});
            }          
        } catch (err) {
            console.log(err);
            if (err.response && err.response.status === 422) {
            this.error = Object.values(err.response.data.errors).flat().join(" ");
            } else {
            this.error = "Error al agregar el material.";
            }
        } finally {
            this.loading = false;
        }
    },
    async getAvailableCourses(){
        const response=await CourseService.getCourses();
        this.availableCourses=response.data.data;
    },
    async getAvailableLessons(){
        if(!this.course){
            alert("No se ha seleccionado ningun curso")
            return
        }
        try {
        let response = await CourseService.getCourseDetails(this.course.id);
        this.modulesToCourse = response.data.data.modules;
        for (let module of this.modulesToCourse) {
            response = await ModuleService.getModuleDetails(module.module_id);
            if (response.data.data.lessons) {
                this.availableLessons.push(...response.data.data.lessons);
            }
        }
        } catch (error) {
            console.error("Error al obtener las lecciones:", error);
        }
    },
    handleFileUpload(event) {
        const file = event.target.files[0];  
        if (file) {
            this.newMaterial.file=file; 
        }
    },
}
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

