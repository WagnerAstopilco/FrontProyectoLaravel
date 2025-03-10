<template>
    <div class="container">
        <section class="card p-4">
            <header>
                <h1 class="card-title fs-4">{{ name }}</h1>
            </header>
            <div class="card-body col-md-8 col-12 mx-auto">
                <form @submit.prevent="addCategory">
                    <fieldset>
                        <div class="form-group">
                            <label for="nombre">Nombre</label>
                            <input type="text" class="form-control p-2" id="nombre" v-model="newCategory.name" placeholder="Nombre de la categoría"/>
                        </div>
                        <div class="form-group">
                            <label for="descripcion">Descripción</label>
                            <textarea id="descripcion" class="form-control p-2" v-model="newCategory.description" placeholder="Descripción de la categoría"></textarea>
                            <p v-if="error" class="error">{{ error }}</p> 
                        </div>
                        <div v-if="error" class="error text-danger mt-2" role="alert">
                            <small>{{ error }}</small>
                        </div>
                        <div class="d-grid gap-2 d-md-flex col-md-6 col-8 mx-auto">
                            <button type="submit" class="btn m-2 py-1" style="background-color:rgb(88,176,49);color:white;"  aria-label="Agregar nueva categoría">{{ loading ? "Agregando..." : "Agregar" }}</button>
                            <button type="button" class="btn m-2 py-1" style="background-color:rgb(0,87,163);color:white;"  @click="goBack" aria-label="Volver a la página anterior">Volver</button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </section>
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
