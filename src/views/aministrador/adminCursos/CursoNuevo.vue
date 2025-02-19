<template>
    <div class="new-course">
    <h1>Nuevo Curso</h1>
    <form @submit.prevent="addCourse">
        <div class="form-group">
            <label for="nombre">Nombre</label>
            <input type="text" id="nombre" v-model="newCourse.name_long" placeholder="Nombre del curso"/>
        </div>
        <div class="form-group">
            <label for="abrv">Abreviación</label>
            <input type="text" id="abrv" v-model="newCourse.name_short" placeholder="Abreviatura del curso"/>
        </div>
        <div class="form-group">
            <label for="price">Precio</label>
            <input type="money" id="price" v-model="newCourse.price" placeholder="Precio del curso"/>
        </div>
        <div class="form-group">
            <label for="image">Imagen</label>
            <input type="text" id="image" v-model="newCourse.image" placeholder="Imagen del curso"/>
        </div>
        <div class="form-group">
            <label for="descripcion">Descripción</label>
            <textarea id="descripcion" v-model="newCourse.description" placeholder="Descripción del curso"></textarea>
        </div>
        <div class="form-group">
            <label for="store">Tienda</label>
            <input type="text" id="store" v-model="newCourse.store_id" placeholder="Tienda"/>
        </div>
        <div class="form-group">
            <label for="category">Categoria</label>
            <select name="category" v-model="newCourse.category_id">
                <option value="" disabled selected>---Selecciona una Categoría---</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                </option>
            </select>
        </div>        
        <p v-if="error" class="error">{{ error }}</p> 
        <div class="buttons">
        <button type="submit" class="btn btn-info">{{ loading ? "Agregando..." : "Agregar" }}</button>
        <button type="button" class="btn btn-primary" @click="goBack">Volver</button>
        </div>
    </form>
</div>
</template>
<script>
import CourseService from '@/services/CoursesService.js';
import CategoryService from '@/services/CategoryService.js';

export default {
data() {
    return {
        newCourse: {
            name_long: "",
            name_short: "",
            price: "",
            image: "",
            description: "",
            store_id: "",
            category_id:"",
        },
        categories:[],
        error: "",
        loading: false,
    };
},
created(){
    this.listCategories();
},
methods: {
    goBack() {
        this.$router.push({ name: 'Cursos' }); 
    },
    async listCategories(){
        const response=await CategoryService.getCategories();
        this.categories=response.data.data;
    },
    async addCourse() {
        this.error = "";
        this.loading = true;
        try {
            const response = await CourseService.postCourse(this.newCourse);
            const courseId = response.data.data.id;
            this.$router.push({name: 'CursoDetalle',params: { id: courseId },});
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
}
};
</script>
<style scoped>
.new-course {
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