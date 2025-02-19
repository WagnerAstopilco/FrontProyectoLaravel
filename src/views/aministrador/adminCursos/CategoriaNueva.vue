<template>
        <div class="new-category">
        <h1>Nueva Categoría</h1>
        <form @submit.prevent="addCategory">
            <div class="form-group">
                <label for="nombre">Nombre</label>
                <input type="text" id="nombre" v-model="newCategory.name" placeholder="Nombre de la categoría" required/>
            </div>
            <div class="form-group">
                <label for="descripcion">Descripción</label>
                <textarea id="descripcion" v-model="newCategory.description" placeholder="Descripción de la categoría"></textarea>
                <p v-if="error" class="error">{{ error }}</p> 
            </div>
            <div class="buttons">
            <button type="submit" class="btn btn-info">{{ loading ? "Agregando..." : "Agregar" }}</button>
            <button type="button" class="btn btn-primary" @click="goBack">Volver</button>
            </div>
        </form>
    </div>
</template>
<script>
import CategoryService from '@/services/CategoryService.js';

export default {
    data() {
        return {
            newCategory: {
            name: "",
            description: "",
            },
            error: "",
            loading: false,
        };
    },
    methods: {
        goBack() {
            this.$router.push({ name: 'Categorias' }); 
        },
        async addCategory() {
            this.error = "";
            this.loading = true;
            try {
                const response = await CategoryService.postCategory(this.newCategory);
                const categoryId = response.data.data.id;
                this.$router.push({name: 'CategoriaDetalle',params: { id: categoryId },});
            } catch (err) {
                if (err.response && err.response.status === 422) {
                // Mostrar los errores de validación
                this.error = Object.values(err.response.data.errors).flat().join(" ");
                } else {
                this.error = "Error al agregar la categoría.";
                }
            } finally {
                this.loading = false;
            }
        },
    }
};
</script>
<style scoped>
.new-category {
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