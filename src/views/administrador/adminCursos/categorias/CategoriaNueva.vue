<template>
    <div class="container">
        <div class="card p-4">
            <h1 class="card-title fs-4">{{ name }}</h1>
            <div class="card-body col-8 mx-auto">
                <form @submit.prevent="addCategory">
                    <div class="form-group d-flex flex-column">
                        <label for="nombre">Nombre</label>
                        <input type="text" class="form-control p-2" id="nombre" v-model="newCategory.name" placeholder="Nombre de la categoría" required/>
                    </div>
                    <div class="form-group d-flex flex-column">
                        <label for="descripcion">Descripción</label>
                        <textarea id="descripcion" class="form-control p-2" v-model="newCategory.description" placeholder="Descripción de la categoría"></textarea>
                        <p v-if="error" class="error">{{ error }}</p> 
                    </div>
                    <div class="d-flex justify-content-center">
                    <button type="submit" class="btn btn-info m-2" style="background-color:rgb(88,176,49);color:white;">{{ loading ? "Agregando..." : "Agregar" }}</button>
                    <button type="button" class="btn btn-primary m-2" style="background-color:rgb(0,87,163);color:white;"  @click="goBack">Volver</button>
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
            name: 'Nueva Categoría',
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
