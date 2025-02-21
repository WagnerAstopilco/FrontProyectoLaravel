<template>
    <div class="new-module">
    <h1>Nuevo Modulo</h1>
    <form @submit.prevent="editModule(module.id)">
        <div class="form-group">
            <label for="nombre">Nombre</label>
            <input type="text" id="nombre" v-model="module.name" placeholder="Nombre del módulo"/>
        </div>
        <div class="form-group">
            <label for="description">Descripción</label>
            <textarea id="descripcion" v-model="module.description" placeholder="Descripción del módulo"></textarea>
        </div>
        <p v-if="error" class="error">{{ error }}</p> 
        <div class="buttons">
            <button type="submit" class="btn btn-info" @click="updateModule">Guardar Cambios</button>
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
        module: {
            name: "",
            description: "",
            order:"",
        },
        error: "",
        loading: false,
        }  
    },
    created() {
        this.getModuleDetails();
    },
    methods:{
        async getModuleDetails() {
            const id = this.$route.params.id; 
            const response = await ModuleService.getModuleDetails(id);
            this.module = response.data.data;
        },
        async updateModule() {
            console.log('Módulo editado:', this.module);
            const response =await ModuleService. patchModule(this.module.id, this.module);
            const moduleId = response.data.data.id;
            if (moduleId) {
                this.$router.push({name: 'ModuleDetalle',params: { id: moduleId },});
            }
        },
        async goBack() {
            this.$router.push({ name: 'ModuloDetalle', params: { id: this.module.id } });
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