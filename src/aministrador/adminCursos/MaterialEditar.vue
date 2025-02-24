<template>
<div class="edit-material">
    <h1>Editar Material</h1>
    <form @submit.prevent="editMaterial">
        <div class="form-group">
            <label for="title">Titulo</label>
            <input type="text" id="title" v-model="material.title" placeholder="Titulo del material"/>
        </div>
        <div class="form-group">
            <label for="type">Tipo</label>
            <select name="type" v-model="material.type">
                <option value="" disabled selected>---Selecciona un tipo---</option>
                <option value="file">Archivo</option>
                <option value="link">Enlace</option>
                <option value="video">Video</option>
                <option value="pdf">PDF</option>
            </select>
        </div>
        <div class="form-group">
            <label for="link">Link</label>
            <input type="text" id="link" v-model="material.url" placeholder="Enlace al material"/>
        </div>
        <div class="form-group">
            <label for="content">Contenido</label>
            <textarea id="content" v-model="material.content" placeholder="Contenido del material"></textarea>
        </div>
        <p v-if="error" class="error">{{ error }}</p>     
        <div class="buttons">
            <button type="submit" class="btn btn-info">Guardar Cambios</button>
            <button type="button" class="btn btn-primary" @click="goBack">Volver</button>
        </div>
    </form>
</div>
</template>
<script>
import MaterialService from '@/services/MaterialsService.js';

export default {
data() {
    return {
        material: { 
            title: '', 
            type: '', 
            url: '', 
            content: ''
        },
    };
},
created(){
this.getMaterialDetails();
},
methods: {
    async getMaterialDetails() {
            const id = this.$route.params.id; 
            const response = await MaterialService.getMaterialDetails(id);
            this.material = response.data.data;
        },
    goBack() {
        this.$router.push({ name: 'MaterialDetalle', params: { id: this.material.id } }); 
    },
    async editMaterial() {
        const response =await MaterialService.patchCategory(this.material.id, this.material);
        const materialId = response.data.data.id;
        if (materialId) {
            this.$router.push({name: 'MaterialDetalle',params: { id: materialId },});
        }
    },
}
};
</script>
<style scoped>
.edit-material {
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