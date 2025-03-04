<template>
    <div class="container">
        <div class="card p-4">
            <h1 class="card-title fs-4">{{ name }}</h1>
            <div class="card-body col-8 mx-auto">
                <form @submit.prevent="addCourse">
                    <div class="form-group d-flex flex-column">
                        <label for="nombre">Nombre</label>
                        <input type="text" class="form-control p-2" id="nombre" v-model="newCourse.name_long" placeholder="Nombre del curso"/>
                    </div>
                    <div class="form-group d-flex flex-column">
                        <label for="abrv">Abreviación</label>
                        <input type="text" class="form-control p-2" id="abrv" v-model="newCourse.name_short" placeholder="Abreviatura del curso"/>
                    </div>
                    <div class="form-group d-flex flex-column">
                        <label for="category">Categoria</label>
                        <select name="category" class="form-control p-2" v-model="newCourse.category_id">
                            <option value="" disabled selected>---Selecciona una Categoría---</option>
                            <option v-for="category in categories" :key="category.id" :value="category.id">
                                {{ category.name }}
                            </option>
                        </select>
                    </div>
                    <div class="form-group d-flex flex-column">
                        <label for="price">Precio</label>
                        <input type="number" class="form-control p-2" id="price" v-model="newCourse.price" placeholder="Precio del curso"/>
                    </div>
                    <div class="form-group d-flex flex-column">
                        <label for="descripcion">Descripción</label>
                        <textarea class="form-control p-2" id="descripcion" v-model="newCourse.description" placeholder="Descripción del curso"></textarea>
                    </div>
                    <div class="form-group d-flex flex-column">
                        <label for="store">Tienda</label>
                        <input type="text" class="form-control p-2" id="store" v-model="newCourse.store_id" placeholder="Tienda"/>
                    </div>
                    <div class="form-group d-flex flex-column">
                        <label for="image">Imagen</label>
                        <input type="file" class="form-control" id="image" @change="handleImageUpload">
                        <div v-if="imagePreview">
                            <img :src="imagePreview" alt="Vista previa" class="img-fluid mt-2" />
                        </div>
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
import CourseService from '@/services/CoursesService.js';
import CategoryService from '@/services/CategoryService.js';

export default {
    data() {
        return {
            name: 'Nuevo Curso',
            newCourse: {
                name_long: "",
                name_short: "",
                price: "",
                image: "",
                description: "",
                store_id: "",
                category_id: "",
            },
            categories: [],
            imagePreview: null,
            error: "",
            loading: false,
        };
    },
    created() {
        this.listCategories();
    },
    methods: {
        goBack() {
            this.$router.push({ name: 'Cursos' });
        },
        async listCategories() {
            const response = await CategoryService.getCategories();
            this.categories = response.data.data;
        },
        handleImageUpload(event) {
            const file = event.target.files[0];  
            if (file) {
                this.newCourse.image=file; 
                this.previewImage(file);
            }
        },
        previewImage(file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                this.imagePreview = reader.result;
            };
            if (file) {
                reader.readAsDataURL(file); 
            }
        },
        async addCourse() {
            this.error = "";
            this.loading = true;

            const formData = new FormData();
            // Agregar los datos del curso al FormData
            formData.append("name_long", this.newCourse.name_long);
            formData.append("name_short", this.newCourse.name_short);
            formData.append("price", this.newCourse.price);
            formData.append("description", this.newCourse.description);
            formData.append("store_id", this.newCourse.store_id);
            formData.append("category_id", this.newCourse.category_id);

            // Agregar la imagen si está seleccionada
            if (this.newCourse.image) {
                formData.append("image", this.newCourse.image);
            }

            try {
                const response = await CourseService.postCourse(formData);  // Usar FormData aquí
                const courseId = response.data.data.id;
            this.$router.push({ name: 'CursoDetalleVer', params: { idcurso: courseId } });

            } catch (err) {
                if (err.response && err.response.status === 422) {
                    // Mostrar los errores de validación
                    this.error = Object.values(err.response.data.errors).flat().join(" ");
                } else {
                    this.error = "Error al agregar el curso.";
                }
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>
