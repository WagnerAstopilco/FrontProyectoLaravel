<template>
<div class="container">
    <div class="card p-4">
        <h1 class="fs-4">{{ name }}</h1>
        <div class="card-body col-8 mx-auto">
            <form @submit.prevent="addModule">
            <div class="form-group">
                <label for="nombre">Nombre</label>
                <input type="text" id="nombre" class="form-control" v-model="newModule.name" placeholder="Nombre del módulo"/>
            </div>
            <div class="form-group ">
                <label for="description">Descripción</label>
                <textarea id="descripcion" class="form-control" v-model="newModule.description" placeholder="Descripción del módulo"></textarea>
            </div>
            <div class="form-group ">
                <label for="cursos">Cursos</label>
                <Multiselect id="cursos"
                    v-model="selectedCourses" 
                    :options="availableCourses" 
                    :multiple="true"
                    :searchable="true" 
                    openDirection="bottom"
                    placeholder="Selecciona cursos para agregar"
                    label="name_long"
                    selectLabel="Presiona enter para seleccionar"
                    selectedLabel="Seleccionado"
                    deselectLabel="Presiona enter para quitar"
                    track-by="id">
                    <template #noOptions>
                        <span class="text-gray-500">No hay cursos disponibles</span>
                    </template>
                    <template #noResult>
                        <span class="text-gray-500"> No se encontraron coincidencias. </span>
                    </template>
                </Multiselect>
            </div>
            <p v-if="error" class="error">{{ error }}</p> 
            <div class="d-flex justify-content-center">
            <button type="submit" class="btn btn-green m-2">{{ loading ? "Agregando..." : "Agregar" }}</button>
            <button type="button" class="btn btn-blue m-2" @click="goBack">Volver</button>
            </div>
        </form>
        </div>
    </div>
</div>
</template>
<script>
import ModuleService from '@/services/ModulesService.js';
import CourseService from '@/services/CoursesService.js';
import CourseModuleService from '@/services/CourseModuleService.js';

import Multiselect from "vue-multiselect";

export default {
    data(){
        return{
        name: "Nuevo Módulo",
        newModule: {
            name: "",
            description: "",
        },
        newCourseModule:{
            course_id:'',
            module_id:'',
            order:'',
        },
        error: "",
        loading: false,

        selectedCourses:[],
        availableCourses:[],
        }  
    },
    created(){
        this.getAvailableCourses();
    },
    components:{
        Multiselect
    },
    methods:{
        async getAvailableCourses() {
            try {
                const response = await CourseService.getCourses();
                const allCourses = response.data.data;
                if (this.module && this.module.courses) {
                    const moduleCourseIds = this.module.courses.map(course => course.id);
                    this.availableCourses = allCourses.filter(course => !moduleCourseIds.includes(course.id));
                } else {
                    this.availableCourses = allCourses;
                }
            } catch (error) {
                console.log(error);
            }
        },
        async addModule() {
            if (this.selectedCourses.length === 0) {
                alert("Debe seleccionar al menos un curso.");
                return;
            }
            this.error = "";
            this.loading = true;
            try {
                const response=await ModuleService.postModule(this.newModule);
                const moduleId = response.data.data.id;
                for(let course of this.selectedCourses){
                    let newCourseModule = {
                        module_id:moduleId,
                        course_id:course.id,
                        order:course.modules.length+1
                    }
                    await CourseModuleService.postCourseModule(newCourseModule);
                }
                this.selectedCourses = [];
                this.$router.push({name: 'ModuloDetalleVer',params: { idmodulo: moduleId },});
            } catch (err) {
                if (err.response && err.response.status === 422) {
                    this.error = Object.values(err.response.data.errors).flat().join(" ");
                } else {
                    this.error = "Error al agregar el módulo.";
                }
            } finally {
                this.loading = false;
            }
        },
        goBack() {
            this.$router.push({ name: 'Modulos' }); 
        },
    }
}
</script>
