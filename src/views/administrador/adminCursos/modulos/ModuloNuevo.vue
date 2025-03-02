<template>
<div class="container">
    <div class="card p-4">
        <h1 class="fs-4">{{ name }}</h1>
        <div class="card-body col-8 mx-auto">
            <form @submit.prevent="addModule">
            <div class="form-group d-flex flex-column">
                <label for="nombre">Nombre</label>
                <input type="text" id="nombre" class="form-control" v-model="newModule.name" placeholder="Nombre del módulo"/>
            </div>
            <div class="form-group d-flex flex-column">
                <label for="description">Descripción</label>
                <textarea id="descripcion" class="form-control" v-model="newModule.description" placeholder="Descripción del módulo"></textarea>
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
import ModuleService from '@/services/ModulesService.js';
export default {
    data(){
        return{
        name: "Nuevo Módulo",
        newModule: {
            name: "",
            description: "",
            order:"",
        },
        error: "",
        loading: false,
        }  
    },
    methods:{
        async addModule() {
            this.error = "";
            this.loading = true;
            try {
                this.newModule.order = 0;
                const response = await ModuleService.postModule(this.newModule);
                const moduleId = response.data.data.id;
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
<style scoped>

</style>