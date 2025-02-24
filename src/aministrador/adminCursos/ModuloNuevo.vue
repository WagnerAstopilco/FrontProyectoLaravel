<template>
<div class="new-module">
    <h1>Nuevo Modulo</h1>
    <form @submit.prevent="addModule">
        <div class="form-group">
            <label for="nombre">Nombre</label>
            <input type="text" id="nombre" v-model="newModule.name" placeholder="Nombre del módulo"/>
        </div>
        <div class="form-group">
            <label for="description">Descripción</label>
            <textarea id="descripcion" v-model="newModule.description" placeholder="Descripción del módulo"></textarea>
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
import ModuleService from '@/services/ModulesService.js';
export default {
    data(){
        return{
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
                this.$router.push({name: 'ModuloDetalle',params: { id: moduleId },});
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
.new-module {
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