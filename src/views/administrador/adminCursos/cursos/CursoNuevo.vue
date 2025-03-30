<template>
    <div class="container">
        <div class="card p-4">
            <div class="card-header pb-0">
                <h1 class="fs-4">{{ name }}</h1>
            </div>
            <div class="card-body w-lg-80 w-md-90 w-100 mx-auto">
                <form @submit.prevent="addCourse">
                    <fieldset>
                        <div class="d-flex flex-column flex-md-row gap-md-3 w-100">
                            <div class="form-group flex-grow-1">
                                <label for="start_date">Fecha de inicio</label>
                                <input type="date" class="form-control" id="start_date" v-model="newCourse.start_date"/>
                            </div>
                            <div class="form-group flex-grow-1">
                                <label for="end_date">Fecha de fin</label>
                                <input type="date" class="form-control p-2" id="end_date" v-model="newCourse.end_date"/>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="name_long">Nombre</label>
                            <input type="text" class="form-control p-2" id="name_long" v-model="newCourse.name_long" placeholder="Nombre del curso"/>
                        </div>
                        <div class="form-group">
                            <label for="name_short">Abreviación</label>
                            <input type="text" class="form-control p-2" id="name_short" v-model="newCourse.name_short" placeholder="Abreviatura del curso"/>
                        </div>
                        <div class="form-group">
                            <label for="duration_in_hours">Duración</label>
                            <input type="number" class="form-control p-2" id="duration_in_hours" v-model="newCourse.duration_in_hours" placeholder="Duración del curso"/>
                        </div>
                        <div class="form-group">
                            <label for="category">Categoria</label>
                            <select name="category" class="form-control p-2" v-model="newCourse.category_id">
                                <option value="" disabled selected>---Selecciona una Categoría---</option>
                                <option v-for="category in categories" :key="category.id" :value="category.id">
                                    {{ category.name }}
                                </option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="price">Precio</label>
                            <input type="number" class="form-control p-2" id="price" v-model="newCourse.price" placeholder="Precio del curso"/>
                        </div>
                        <div class="form-group">
                            <label for="discount">Descuento</label>
                            <input type="number" class="form-control p-2" id="discount" v-model="newCourse.discount" placeholder="Descuento en el curso" @blur="setDefaultDiscount"/>
                        </div>
                        <div class="form-group">
                            <label for="descripcion">Descripción</label>
                            <textarea class="form-control p-2" id="descripcion" v-model="newCourse.description" placeholder="Descripción del curso"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="store">Tienda</label>
                            <input type="text" class="form-control p-2" id="store" v-model="newCourse.store_id" placeholder="Tienda"/>
                        </div>
                        <div class="form-group">
                            <label for="image">Imagen</label>
                            <input type="file" class="form-control" id="image" @change="handleImageUpload">
                            <div v-if="imagePreview">
                                <img :src="imagePreview" alt="Vista previa" class="img-fluid mt-2" />
                            </div>
                        </div>
                    </fieldset>
                    <p v-show="error" class="error text-danger mt-2">{{ error }}</p>
                    <div class="d-flex justify-content-center">
                        <button type="submit" class="btn btn-info m-2 btn-green">{{ loading ? "Agregando..." : "Agregar" }}</button>
                        <button type="button" class="btn btn-primary m-2 btn-blue" @click="goBack">Volver</button>
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
                name_long: '',
                name_short: '',
                price: '',
                image: '',
                discount:0,
                start_date:'',
                end_date:'',
                duration_in_hours:'',
                description: '',
                store_id: '',
                category_id: '',
            },
            categories: [],
            imagePreview: null,
            error: '',
            loading: false,
        };
    },
    created() {
        this.getCategories();
    },
    methods: {
        goBack() {
            this.$router.push({ name: 'Cursos' });
        },
        async getCategories() {
            const response = await CategoryService.getCategories();
            this.categories = response.data.data;
            console.log("categorias", this.categories);
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
            formData.append("name_long", this.newCourse.name_long);
            formData.append("name_short", this.newCourse.name_short);
            formData.append("price", this.newCourse.price);
            formData.append("discount", this.newCourse.discount);
            formData.append("description", this.newCourse.description);
            formData.append("start_date", this.newCourse.start_date);
            formData.append("end_date", this.newCourse.end_date);
            formData.append("duration_in_hours", this.newCourse.duration_in_hours);
            formData.append("store_id", this.newCourse.store_id);
            formData.append("category_id", this.newCourse.category_id);
            if (this.newCourse.image) {
                formData.append("image", this.newCourse.image);
            }

            try {
                const response = await CourseService.postCourse(formData);
                console.log("respuesta", response);
                const courseId = response.data.data.id;
                this.$router.push({ name: 'CursoDetalleVer', params: { idcurso: courseId } });
            } catch (err) {
                console.error("Error en addCourse:", err);
    
    // Verifica si la estructura del error es válida
    if (err.response?.data?.errors) {
        this.error = Object.values(err.response.data.errors).flat().join(" ");
    } else {
        this.error = "Ocurrió un error inesperado al agregar el curso.";
    }
            } finally {
                this.loading = false;
            }
        }, 
        setDefaultDiscount() {
            if (this.newCourse.discount === '' || this.newCourse.discount === null || this.newCourse.discount === undefined) {
            this.newCourse.discount = 0;
            }
        },
    },
};
</script>
