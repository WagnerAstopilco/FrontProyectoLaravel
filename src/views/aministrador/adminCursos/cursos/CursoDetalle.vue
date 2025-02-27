<template>
    <div class="container">
        <div class="card p-4">
            <div class="head d-flex">
                <h1 class="fs-4">{{ name }}</h1>
                <Preloader :visible="cargando"></Preloader>
                <div class="dropdown ms-auto">
                    <button class="btn btn-info dropdown-toggle " type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Opciones
                    </button>
                    <ul class="dropdown-menu">
                        <div v-if="course">
                        <li><a class="dropdown-item" @click="editCourse(course.id)">Editar</a></li>
                        <li><a class="dropdown-item" @click="deleteCourse">Eliminar</a></li>
                        </div>
                    </ul>
                </div>            
            </div>
                <div v-if="course">
                    <div class="container d-flex justify-content-between">
                        <div class="w-50">
                            <form @submit.prevent="updateCourse">
                                <div class="form-group">
                                    <label for="name_long">Nombre</label>
                                    <input type="text" class="form-control" id="name_long" v-model="course.name_long" :readonly="!isEditing">
                                    <label for="name_short">Abreviación</label>
                                    <input type="text" class="form-control" id="name_short" v-model="course.name_short" :readonly="!isEditing">
                                    <label for="category">Categoría</label>
                                    <input type="text" class="form-control" id="category" v-model="course.category.name" :readonly="!isEditing">
                                    <label for="price">Precio</label>
                                    <input type="text" class="form-control" id="price" v-model="course.price" :readonly="!isEditing">
                                    <label for="discount">Descuento</label>
                                    <input type="text" class="form-control" id="discount" v-model="course.category.name" :readonly="!isEditing">
                                    <label for="name">Descripción</label>
                                    <input type="text" class="form-control" id="name" v-model="course.description" :readonly="!isEditing">
                                    <div v-if="isEditing">
                                        <label for="image">Imagen</label>
                                        <input type="file" class="form-control" id="image" @change="handleImageUpload">
                                        <div v-if="imagePreview">
                                            <img :src="imagePreview" alt="Vista previa" class="img-fluid mt-2" />
                                        </div>
                                    </div>
                                </div>
                                <div v-if="isEditing ">
                                    <button type="submit" class="btn btn-outline-warning m-2">{{ loading ? "Actualizando..." : "Actualizar" }}</button>
                                    <button type="button" class="btn btn-outline-secondary m-2" @click="cancelEdit">Cancelar</button>
                                </div>
                            </form>
                            
                        </div>
                        <div class="w-50 p-4" v-if="isViewing">
                            <img :src="getImagenUrl(course.image)" class="card-img img-fluid" alt="CursoImagen"/>
                        </div>
                    </div>
                    <div class="CourseTrainers">
                        <h3>Capacitadores</h3>
                        <div v-if="course.trainers && course.trainers.length > 0">
                            <table id="courseTrainersTable" class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="trainer in course.trainers" :key="trainer.id" @click="trainerDetail(trainer.id)">
                                        <td>{{ trainer.name }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div> 
                        <div v-else>
                            <p>Sin capacitadores asignados</p>
                        </div>
                    </div>
                    <div class="CourseModules">
                        <h3>Modulos</h3>
                        <div v-if="course.modules && course.modules.length > 0">
                            <table id="courseModulesTable" class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="module in course.modules" :key="module.id" @click="moduleDetail(module.id)">
                                        <td>{{ module.name }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div> 
                        <div v-else>
                            <p>Sin modulos asignados</p>
                        </div>
                    </div>
                    <div class="CourseEvaluations">
                        <h3>Evaluaciones</h3>
                        <div v-if="course.evaluations && course.evaluations.length > 0">
                            <table id="courseEvaluationsTable" class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="evaluation in course.evaluations" :key="evaluation.id" @click="evaluationDetail(evaluation.id)">
                                        <td>{{ evaluation.name }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div> 
                        <div v-else>
                            <p>Sin evaluaciones asignadas</p>
                        </div>
                    </div>
                    <div class="CourseMaterials">
                        <h3>Materiales</h3>
                        <div v-if="course.materials && course.materials.length > 0">
                            <table id="coursematerialsTable" class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Titulo</th>
                                        <th>Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="material in course.materials" :key="material.id">
                                        <td>{{ material.title }}</td>
                                        <td><button type="button" class="btn btn-danger" @click="deleteMaterialToCourse(material.id)">Elinimar</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div> 
                        <div v-else>
                            <p>Sin materiales asignados</p>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <p>Cargando...</p>
                </div>
            <div class="d-flex">
                <button type="button" class="btn btn-primary mx-auto" @click="goBack">Volver</button>
            </div>
        </div>
    </div>
</template>
<script>
import CourseService from '@/services/CoursesService.js';
import MaterialService from '@/services/MaterialsService.js';
import Preloader from '../../../components/Preloader.vue';


export default {
    data() {
        return {
            name:"Detalles del Curso",
            idcurso:this.$route.params.idcurso,
            cargando: false,
            course: null,
            isViewing: false,
            isEditing: false,
            loading: false,
            imagePreview: null,
        };
    },
    mounted() {
        if (this.$route.name === 'CursoDetalleVer') {
            this.isViewing = true;
        } else if (this.$route.name === 'CursoDetalleEditar') {
            this.isEditing = true;
        }
    },
    created() {
        this.getCourseDetails();
    },
    components: {
        Preloader
    },
    methods: {
        async getCourseDetails() {
            try{
                this.cargando=true;
                const response = await CourseService.getCourseDetails(this.idcurso);
                this.course = response.data.data;
                console.log(response);
            }catch(error){
                console.log(error);
            }finally{
                this.cargando=false;
            }
        },
        goBack() {
            this.$router.push({ name: 'Cursos' }); 
        },
        editCourse(id){
            this.isEditing = true;
            this.isViewing = false;
            this.$router.push({ name: 'CursoDetalleEditar', params: { idcurso: id } });
        },
        async updateCourse() {
            this.error = "";
            this.loading = true;
            const formData = new FormData();
            formData.append("name_long", this.course.name_long);
            formData.append("name_short", this.course.name_short);
            formData.append("price", this.course.price);
            formData.append("description", this.course.description);
            formData.append("store_id", this.course.store_id);
            formData.append("category_id", this.course.category_id);
            if (this.course.image) {
            formData.append("image", this.course.image);        
            }
            try {
                const response = await CourseService.patchCourse(this.course.id, formData);  // Usamos FormData aquí
                // Si la actualización fue exitosa, redirigir al detalle del curso
                const courseId = response.data.data.id;
                this.$router.replace({ name: 'CursoDetalleVer', params: { idcurso: courseId } });

            } catch (err) {
                if (err.response && err.response.status === 422) {
                    // Mostrar los errores de validación
                    this.error = Object.values(err.response.data.errors).flat().join(" ");
                } else {
                    this.error = "Error al actualizar el curso.";
                }
            } finally {
                this.isEditing = false;
                this.isViewing = true;
                this.loading = false;
            }
        },
        async deleteCourse(){
            const confirmed = confirm('¿Estás seguro de que deseas eliminar este curso?');
            if (confirmed) {
                try {
                    await CourseService.deleteCourse(this.course.id); 
                    this.$router.push({ name: 'Cursos' });
                } catch (error) {
                    alert('Hubo un error al intentar eliminar el curso.');
                }
            }   
        },
        async deleteMaterialToCourse(materialId){
            const confirmed = confirm('¿Estás seguro de que deseas eliminar este material del curso?');
            if (confirmed) {
                try {
                    const courselId = this.$route.params.id; 
                    await MaterialService.deleteCourseToMaterial(materialId,courselId); 
                    this.getCourseDetails(); 
                } catch (error) {
                    alert('Hubo un error al intentar eliminar el curso.');
                }
            }   
        },
        getImagenUrl(imagen) {
            if (imagen) {
                return process.env.VUE_APP_API_URL + "/storage/" + imagen; 
            }
        },
        cancelEdit(){
            this.isEditing = false;
            this.isViewing = true;
            this.$router.push({ name: 'CursoDetalleVer', params: { idcurso: this.idcurso} });
        },
        handleImageUpload(event) {
            const file = event.target.files[0];  // Obtener el primer archivo seleccionado
            if (file) {
                this.course.image = file;  // Asignar el archivo al campo image
                this.previewImage(file);  // Vista previa de la imagen
            }
        },
        previewImage(file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                this.imagePreview = reader.result;  // Asignar la vista previa
            };
            if (file) {
                reader.readAsDataURL(file);  // Leer el archivo como Data URL
            }
        },
    }
};
</script>
<style scoped>

</style>