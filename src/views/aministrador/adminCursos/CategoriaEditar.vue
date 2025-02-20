<template>
    <div class="categoria-editar" v-if="category">
        <h1>Editar Categoría</h1>
        <form @submit.prevent="updateCategory">
            <div class="form-group">
                <label for="nombre">Nombre</label>
                <input type="text" id="nombre" v-model="category.name" required/>
            </div>
            <div class="form-group">
                <label for="descripcion">Descripción</label>
                <textarea id="descripcion" v-model="category.description"></textarea>
            </div>
            <div class="buttons">
            <button type="submit" class="btn btn-info" @click="updateCategory">Guardar Cambios</button>
            <button type="button" class="btn btn-primary" @click="goBack">Volver</button>
            </div>
        </form>
    </div>
</template>

<script>
import CategoryService from '@/services/CategoryService.js'
export default {
    data() {
        return {
            category: null
        };
    },
    created() {
        this.getCategoryDetails();
    },
    methods: {
        async getCategoryDetails() {
            const id = this.$route.params.id; 
            const response = await CategoryService.getCategoryDetails(id);
            this.category = response.data.data;
        },
        async updateCategory() {
            console.log('Categoría editada:', this.category);
            const response =await CategoryService.patchCategory(this.category.id, this.category);
            const categoryId = response.data.data.id;
            if (categoryId) {
                this.$router.push({name: 'CategoriaDetalle',params: { id: categoryId },});
            }
        },
        async goBack() {
            this.$router.push({ name: 'CategoriaDetalle', params: { id: this.category.id } });
        },
    },
};
</script>

<style scoped>
.categoria-editar {
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
textarea {
    width: 100%;
    padding: 0.5em;
    box-sizing: border-box;
}
button {
    padding: 0.5em 1em;
    border: none;
    cursor: pointer;
}

.buttons{
    display: flex;
    justify-self:center;
    min-width: 50%;
    max-width: 50%;
    justify-content: space-around;
}
</style>