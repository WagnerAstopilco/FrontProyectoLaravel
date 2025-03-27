<template>
    <div class="container">
        <div class="card p-4">
            <div class="card-header">
                <h1 class="fs-4">{{ name }}</h1>
            </div>
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
                        </div>
                        <div v-show="error" class="error text-danger mt-2" role="alert">
                            <small>{{ error }}</small>
                        </div>
                    </fieldset>
                    <div class="d-grid gap-2 d-md-flex col-md-6 col-8 mx-auto">
                        <button type="submit" class="btn m-2 btn-green" aria-label="Agregar nueva categoría">{{ loading ? "Creando..." : "Crear" }}</button>
                        <button type="button" class="btn m-2 btn-blue" @click="goBack" aria-label="Volver a la página anterior">Volver</button>
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
                name: '',
                description: '',
                color: '',
            },
            error: '',
            loading: false,
            categories: [],
        };
    },

    async created() {
        await this.getCategories();
    },

    methods: {
        async getCategories() {
            try {
                const response = await CategoryService.getCategories();
                this.categories = response.data.data || response.data;
            } catch (err) {
                console.error("Error al obtener categorías:", err);
            }
        },

        createUniqueColor() {
            let color;
            do {
                color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
                console.log("Color generado:", color);
            } while (this.categories.some(cat => cat.color === color));
            return color;
        },

        async addCategory() {
            try {
                this.error = "";
                this.loading = true;
                this.newCategory.color = this.createUniqueColor();
                const response = await CategoryService.postCategory(this.newCategory);
                const categoryId = response.data.data.id;
                this.$router.push({ name: 'CategoriaDetalleVer', params: { idcategoria: categoryId } });
            } catch (err) {
                this.error = Object.values(err.response.data.errors).flat().join(" ");
            } finally {
                this.loading = false;
            }
        },

        goBack() {
            this.$router.push({ name: 'Categorias' }); 
        }        
    }
};
</script>

