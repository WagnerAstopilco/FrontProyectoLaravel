<template>
    <div class="curso-editar" v-if="course">
        <h1>Editar Curso</h1>
        <form @submit.prevent="updateCourse">
            <div class="form-group">
            <label for="nombre">Nombre</label>
            <input type="text" id="nombre" v-model="course.name_long" placeholder="Nombre del curso"/>
        </div>
        <div class="form-group">
            <label for="abrv">Abreviación</label>
            <input type="text" id="abrv" v-model="course.name_short" placeholder="Abreviatura del curso"/>
        </div>
        <div class="form-group">
            <label for="price">Precio</label>
            <input type="money" id="price" v-model="course.price" placeholder="Precio del curso"/>
        </div>
        <div class="form-group">
            <label for="discount">Descuento</label>
            <input type="text" id="discount" v-model="course.discount" placeholder="Precio del curso"/>
        </div>
        <div class="form-group">
            <label for="descripcion">Descripción</label>
            <textarea id="descripcion" v-model="course.description" placeholder="Descripción del curso"></textarea>
            <p v-if="error" class="error">{{ error }}</p> 
        </div>
        <div class="form-group">
            <label for="store">Tienda</label>
            <input type="text" id="store" v-model="course.store_id" placeholder="Tienda"/>
        </div>
        <div class="form-group">
            <label for="category">Categoria</label>
            <select name="category" v-model="course.category_id">
                <option value="" disabled selected>---Selecciona una Categoría---</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                </option>
            </select>
        </div>        
        <div class="form-group">
            <label for="image">Imagen</label>
            <input type="text" id="image" v-model="course.image" placeholder="Imagen del curso"/>
        </div>
            <div class="buttons">
            <button type="submit" class="btn btn-info" @click="updateCourse">Guardar Cambios</button>
            <button type="button" class="btn btn-primary" @click="goBack">Volver</button>
            </div>
        </form>
    </div>
</template>

<script>
import CourseService from '@/services/CoursesService.js'
import CategoryService from '@/services/CategoryService.js';
export default {
    data() {
        return {
            course: null
        };
    },
    created() {
        this.listCategories();
        this.getCourseDetails();
    },
    methods: {
        async getCourseDetails() {
            const id = this.$route.params.id; 
            const response = await CourseService.getCourseDetails(id);
            this.course = response.data.data;
        },
        async updateCourse() {
            console.log('Curso editado:', this.course);
            const response =await CourseService.patchCourse(this.course.id, this.course);
            const courseId = response.data.data.id;
            if (courseId) {
                this.$router.push({name: 'CursoDetalle',params: { id: courseId },});
            }
        },
        async goBack() {
            this.$router.push({ name: 'CursoDetalle', params: { id: this.course.id } });
        },
        async listCategories(){
        const response=await CategoryService.getCategories();
        this.categories=response.data.data;
        console.log(response);
    },
    },
};
</script>

<style scoped>
.curso-editar {
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