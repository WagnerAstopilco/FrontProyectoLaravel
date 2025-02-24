<template>
    <div class="container">
        <div class="card p-4">
            <h1 class="card-title fs-4">Nueva Categoría</h1>
            <Preloader :visible="cargando"></Preloader>
            <div class="card-body col-6 mx-auto">
                <form @submit.prevent="addCategory">
                    <div class="form-group d-flex flex-column">
                        <label for="nombre">Nombre</label>
                        <input type="text" id="nombre" v-model="newCategory.name" placeholder="Nombre de la categoría" required/>
                    </div>
                    <div class="form-group d-flex flex-column">
                        <label for="descripcion">Descripción</label>
                        <textarea id="descripcion" v-model="newCategory.description" placeholder="Descripción de la categoría"></textarea>
                        <p v-if="error" class="error">{{ error }}</p> 
                    </div>
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
                this.$router.push({name: 'CategoriaDetalleVer',params: { idcategoria: categoryId },});
            } catch (err) {
                console.log(err);
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
</style>