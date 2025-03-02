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
                        <li><a class="dropdown-item" @click="editCourse()">Editar</a></li>
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
                                    <label for="category">Categoria</label>
                                    <select name="category" class="form-control p-2" v-model="course.category_id" :readonly="!isEditing">
                                        <option value="" disabled selected>---Selecciona una Categoría---</option>
                                        <option v-for="category in categories" :key="category.id" :value="category.id">
                                            {{ category.name }}
                                        </option>
                                    </select>
                                    <label for="price">Precio</label>
                                    <input type="number" class="form-control" id="price" v-model="course.price" :readonly="!isEditing">
                                    <label for="discount">Descuento</label>
                                    <input type="number" class="form-control" id="discount" v-model="course.discount" :readonly="!isEditing">
                                    <label for="store">Tienda</label>
                                    <input type="text" class="form-control p-2" id="store" v-model="course.store_id" placeholder="Tienda" :readonly="!isEditing">
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
                        <div v-if="trainers.length > 0">
                            <table id="courseTrainersTable" class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Apellidos</th>
                                        <td>Opciones</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="trainer in trainers" :key="trainer.id">
                                        <td>{{ trainer.user.names }}</td>
                                        <td>{{ trainer.user.last_names }}</td>
                                        <td><button type="button" class="btn btn-danger" @click="deleteTrainerToCourse(trainer.id)">Elinimar</button></td>
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
                                        <th>Órden</th>
                                        <th>Nombre</th>
                                        <th>Descripción</th>
                                        <th>Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="module in course.modules" :key="module.id" >
                                        <td>{{ module.order }}</td>
                                        <td>{{ module.name }}</td>
                                        <td>{{ module.description }}</td>
                                        <td >
                                            <!-- <button type="button" class="btn btn-succes m-1" @click="lessonUp(module.lesson.order)">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-circle-fill" viewBox="0 0 16 16">
                                                <path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0m-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z"/>
                                            </svg>
                                            Subir uno
                                        </button>
                                        <button type="button" class="btn btn-danger m-1" @click="lessonDown(module.lesson.order)">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-circle-fill" viewBox="0 0 16 16">
                                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z"/>
                                            </svg>
                                            Bajar uno
                                        </button> -->
                                            <button type="button" class="btn btn-danger m-1" @click="editmodule(module.id)">Editar</button>
                                        </td>
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
                                        <th>Órden</th>
                                        <th>Titulo</th>
                                        <th>Tipo</th>
                                        <th>Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="material in course.materials" :key="material.id">
                                        <td>{{ material.order }}</td>
                                        <td>{{ material.title }}</td>
                                        <td>{{ material.type }}</td>
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
import CategoryService from '@/services/CategoryService.js';
import TrainerService from '@/services/TrainersService.js';
import Preloader from '../../../components/Preloader.vue';
import $ from 'jquery';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-bs4';


export default {
    data() {
        return {
            name:"Detalles del Curso",
            idcurso:this.$route.params.idcurso,
            cargando: false,
            course:null,
            trainers:[],
            categories: [],
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
        this.getCategories();
        this.getCourseDetails();
    },
    beforeUnmount() {
        if ($.fn.dataTable.isDataTable('#courseEvaluationsTable')) {
            $('#courseEvaluationsTable').DataTable().destroy();
        }
        if ($.fn.dataTable.isDataTable('#coursematerialsTable')) {
            $('#coursematerialsTable').DataTable().destroy();
        }
        if ($.fn.dataTable.isDataTable('#courseModulesTable')) {
            $('#courseModulesTable').DataTable().destroy();
        }
        if ($.fn.dataTable.isDataTable('#courseTrainersTable')) {
            $('#courseTrainersTable').DataTable().destroy();
        }
    },
    components: {
        Preloader
    },
    methods: {
        async getCategories(){
            try{
                this.cargando=true;
                const response = await CategoryService.getCategories();
                this.categories = response.data.data;
            }catch(error){
                console.log(error);
            }
            finally
            {
                this.cargando=false;
            }
        },
        async getCourseDetails() {
            try{
                this.cargando=true;
                const response = await CourseService.getCourseDetails(this.idcurso);
                this.course = response.data.data;
                console.log(this.course);
                this.getTrainers( this.course);
                this.$nextTick(() => {
                    if (this.course && this.course.trainers && this.course.trainers.length > 0) {
                            $('#courseTrainersTable').DataTable();  
                        }
                    if (this.course && this.course.modules && this.course.modules.length > 0) {
                            $('#courseModulesTable').DataTable();  
                        }
                    if (this.course && this.course.evaluations && this.course.evaluations.length > 0) {
                            $('#courseEvaluationsTable').DataTable();  
                        }
                    if (this.course && this.course.materials && this.course.materials.length > 0) {
                            $('#coursematerialsTable').DataTable();  
                        }
                });
            }catch(error){
                console.log(error);
            }finally{
                this.cargando=false;
            }
        },
        async getTrainers(course){
            for(let trainer of course.trainers){
                const response= await TrainerService.getTrainerDetails(trainer.id)
                const trainerfiltered=response.data.data;
                this.trainers.push(trainerfiltered);
            }
        },
        goBack() {
            this.$router.push({ name: 'Cursos' }); 
        },
        editCourse(){
            this.isEditing = true;
            this.isViewing = false;
            this.$router.push({ name: 'CursoDetalleEditar', params: { idcurso: this.idcurso } });
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
            formData.append("discount", this.course.discount);
            formData.append("category_id", this.course.category_id);
            if (this.course.image) {
            formData.append("image", this.course.image);        
            }
            
            try {
                await CourseService.patchCourse(this.idcurso, formData);
                this.$router.replace({ name: 'CursoDetalleVer', params: { idcurso: this.idcurso } });

            } catch (err) {
                if (err.response && err.response.status === 422) {
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
        async deleteTrainerToCourse(trainerId){
            const confirmed = confirm('¿Estás seguro de que deseas eliminar este capacitador del curso?');
            if (confirmed) {
                try {
                    await TrainerService.deleteCourseToTrainer(trainerId,this.idcurso);
                    this.removeTrainer(trainerId);
                    this.getCourseDetails(); 
                } catch (error) {
                    alert('Hubo un error al intentar eliminar el capacitador.');
                }
            }   
        },
        removeTrainer(trainerId) {
            const index = this.trainers.findIndex(trainer => trainer.id === trainerId);
            if (index !== -1) {
                this.trainers.splice(index, 1);
            }
        },
        async deleteMaterialToCourse(materialId){
            const confirmed = confirm('¿Estás seguro de que deseas eliminar este material del curso?');
            if (confirmed) {
                try {
                    await MaterialService.deleteCourseToMaterial(materialId,this.idcurso);
                    console.log(this.$route.params.id) ;
                    this.getCourseDetails(); 
                } catch (error) {
                    alert('Hubo un error al intentar eliminar el curso.');
                }
            }   
        },
        getImagenUrl(image) {
            if (image) {
                return process.env.VUE_APP_API_URL + "/storage/" + image; 
            }
        },
        cancelEdit(){
            this.isEditing = false;
            this.isViewing = true;
            this.$router.push({ name: 'CursoDetalleVer', params: { idcurso: this.idcurso} });
        },
        handleImageUpload(event) {
            const file = event.target.files[0]; 
            if (file) {
                this.course.image = file;  
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
        editmodule(id){
            this.$router.push({ name: 'ModuloDetalleEditar', params: { idmodulo: id } });
        }
    }
};
</script>
<style scoped>

</style>