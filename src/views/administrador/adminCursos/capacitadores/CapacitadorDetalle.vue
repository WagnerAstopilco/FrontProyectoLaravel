<template>
    <div class="container">
        <div class="card p-4">
            <div class="head d-flex">
                <h1 class="fs-4">{{ name }}</h1>
                <Preloader :visible="cargando"></Preloader>
                <div class="dropdown ms-auto">
                    <button class="btn btn-danger dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Opciones
                    </button>
                    <ul class="dropdown-menu">
                        <div v-if="trainer">
                        <li><a class="dropdown-item" href="#" @click="editTrainer(trainer.id)">Editar</a></li>
                        <li><a class="dropdown-item" href="#" @click="deleteTrainer">Eliminar</a></li>
                        </div>
                    </ul>
                </div>            
            </div>
            <div v-if="trainer" >
                    <form @submit.prevent="updateTrainer" class="w-50">
                        <div class="form-group m-2">
                            <label for="names">Nombres</label>
                            <input type="text" class="form-control" id="names" v-model="trainer.user.names" readonly>
                        </div>
                        <div class="form-group m-2">
                            <label for="last_names">Apellidos</label>
                            <input type="text" class="form-control" id="last_names" v-model="trainer.user.last_names" readonly>
                        </div>
                        <div class="form-group d-flex flex-column m-2">
                            <label for="certifications">Certificaciones</label>
                            <textarea id="certifications" class="form-control p-2" v-model="trainer.certifications" placeholder="" :readonly="!isEditing"></textarea>
                        </div>
                    <div v-if="isEditing ">
                        <button type="submit" class="btn btn-outline-warning m-2">{{ loading ? "Actualizando..." : "Actualizar" }}</button>
                        <button type="button" class="btn btn-outline-secondary m-2" @click="cancelEdit">Cancelar</button>
                    </div>
                    </form>
            </div>
            <div class="materialCourses" v-if="trainer">
                <div class="d-flex align-items-center">
                    <h2 class="fs-4">Cursos</h2>
                    <button type="button" class="btn btn-info m-4" @click="showFormCourseMaterial">Vincular Curso</button>
                </div>

                <form class="courses-form d-flex w-60" v-if="showSearchBar" @submit.prevent="addCourseToTrainer(selectedCourse?.id)">
                        <div class="form-group">
                            <div class="search-bar">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                                </svg>
                                <input v-model="searchQuery" type="text" class=" search-bar-input" placeholder="Buscar cursos..." @click="filterCourses" @input="filterCourses" @focus="inputFocus = true" @blur="handleBlur"/>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16" @click="reset">
                                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                                </svg>
                            </div>
                            <div class="courses-container"  v-if="inputFocus && (filteredCourses.length > 0 || searchQuery)" >
                                <ul class="coursesList">
                                    <li v-for="course in filteredCourses" :key="course.id" 
                                    @click="addCourseToInput(course)">
                                    {{ course.name_long }}
                                    </li>
                                    <li v-if="searchQuery && filteredCourses.length ===0">Sin resultados.</li>
                                </ul>
                            </div> 
                        </div>
                        <div class="">
                            <button type="submit" class="btn btn-info m-2">{{ loading ? "Agregando..." : "Agregar" }}</button>
                            <button type="button" id="button-cancel" class="btn btn-warring m-2" @click="showFormCourseMaterial">Cancelar</button>
                        </div>
                    </form>
                
                <div v-if="trainer.courses && trainer.courses.length > 0">
                    <table id="materialCoursesTable" class="table table-striped">
                        <thead>
                            <tr>
                                <th>Imagen</th>
                                <th>Nombre</th>
                                <th>Categoría</th>
                                <th>Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="course in trainer.courses" :key="course.id">
                                <td><img :src="getImagenUrl(course.image)" class="card-img img-fluid" style="max-width: 150px; max-height: 100px;" alt="CursoImagen"/></td>
                                <td>{{ course.name_long }}</td>
                                <td >{{ course.category_id}}</td>
                                <td><button type="button" class="btn btn-danger" @click="deleteCourseToTrainer(course.id)">Elinimar</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div> 
                <div v-else>
                    <p>Sin cursos vinculados</p>
                </div>
            </div>     
            <div class="d-flex justify-content-center">
                <button type="button" class="btn btn-primary" @click="goBack">Volver</button>
            </div>
        </div>
    </div>
</template>
<script>
import TrainerService from '@/services/TrainersService.js';
import Preloader from '../../../components/Preloader.vue';
import UserService from '@/services/UsersService.js';
import CourseService from '@/services/CoursesService.js';

export default{
    data(){
        return{
            name:'Detalles del Capacitador',
            trainer: null,
            user:{
                role:'',
            },
            cargando:false,
            idtrainer: this.$route.params.idcapacitador,
            iduser:'',
            loading:'',
            inputFocus:false,
            selectedCourse: null,
            showSearchBar: false,
            searchQuery: '', 
            courses: [], 
            coursesTrainer:[],
            filteredCourses: [],
            isViewing: false,
            isEditing: false,
        };
    },
    created(){
        this.getTrainerDetails();
        this.getCourses();
    },  
    components:{
        Preloader
    },
    methods:{        
        async getTrainerDetails(){
            try{
                this.cargando=true;
                const response=await TrainerService.getTrainerDetails(this.idtrainer);
                this.trainer=response.data.data;
                this.iduser=response.data.data.user_id;
            }catch(error){
                console.log(error);
            }finally{
                this.cargando=false;
            }
        },        
        async getCourses(){
            const response=await CourseService.getCourses();
            this.courses=response.data.data;
            this.getCoursesTrainer();
        },
        async getCoursesTrainer(){
            console.log("cursos generales",this.courses);
            this.coursesTrainer = this.courses.filter(course => 
            course.trainers.some(trainer => trainer.id === this.idtrainer));
            console.log("Cursos obtenidos y filtrados para el capacitador:", this.coursesTrainer)
        },
        async deleteTrainer(){
            this.user.role='comercial';
            await UserService.patchUser(this.iduser,this.user);
            await TrainerService.deleteTrainer(this.idtrainer);
            this.$router.push({name:'Capacitadores'});
        },
        goBack(){
            this.$router.push({name: 'Capacitadores'});
        },

        showFormCourseMaterial() {
            this.showSearchBar = !this.showSearchBar; 
        },
        async addCourseToTrainer(courseId){
            if (!courseId) {
            alert("Por favor, selecciona un curso antes de agregar.");
            return;
            }
            const isCourseAlreadyAdded = this.trainer.courses.some(course => course.id === courseId);
    
            if (isCourseAlreadyAdded) {
                alert("Este curso ya está vinculado a este capacitador.");
                return; 
            }
            try {
                this.loading = true;
                await TrainerService.postCourseToTrainer(this.idtrainer,courseId);
                this.getTrainerDetails(); 
            } catch (error) {
                alert("Hubo un error al agregar el curso.");
            } finally {
                this.loading = false;
                this.showSearchBar = false;
            }          
        },
        filterCourses() {
            if (this.searchQuery) {
                const results = this.courses.filter(course => 
                    course.name_long.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
                this.filteredCourses = results.length > 0 ? results : [];
            } else {
                this.filteredCourses = this.courses;
            }
        },
        
        reset(){
            this.filteredCourses=[];
            this.searchQuery="";
        },
        handleBlur() {
            setTimeout(() => {
                this.inputFocus = false;
            }, 200); 
        },
        addCourseToInput(course){
            this.selectedCourse = course; 
            this.searchQuery = course.name_long;
        },
        async deleteCourseToTrainer(courseId){
            const confirmed = confirm('¿Estás seguro de que deseas eliminar este curso de este capacitador?');
            if (confirmed) {
                try {
                    await TrainerService.deleteCourseToTrainer(this.idtrainer,courseId); 
                    this.getTrainerDetails(); 
                } catch (error) {
                    alert('Hubo un error al intentar eliminar el curso.');
                }
            }   
        },
        cancelEdit(){
            this.isEditing = false;
            this.$router.push({ name: 'CapacitadorDetallesVer', params: { idcapacitador: this.idtrainer } });
        },
        getImagenUrl(image) {
            if (image) {
                return process.env.VUE_APP_API_URL + "/storage/" + image; 
            }
        },
        editTrainer(){
            this.isEditing = true;
            this.$router.push({ name: 'CapacitadorDetallesEditar', params: { idcapacitador: this.idtrainer } });
        },
        async updateTrainer(){
            try{
                this.loading=true;
                this.cargando=true;
                await TrainerService.patchTrainer(this.idtrainer,this.trainer);
                this.$router.replace({name:'CapacitadorDetallesVer',params:{idcapacitador:this.idtrainer}})
            }catch(error){
                console.log(error);
            }finally{
                this.loading=false;
                this.cargando=false;
                this.isEditing = false;
            }
        },
        
    }
}
</script>
<style scoped>
.search-bar{
    display: flex;
    flex-direction: row;
    align-items: center;
    border:3px solid rgb(19, 136, 103);
    border-radius: 10px;
    padding:5px;
}
.search-bar-input {
    background-color: transparent; 
    border: none; 
    outline: none; 
    padding: 8px 12px; 
    font-size: 16px;  
    color: #333;
    width: 100%;
}
.search-bar-input:focus {
    outline: none; 
}


.form-group {
    flex: 1;
    min-width: 250px;
    position: relative;
}

.search-bar {
    display: flex;
    align-items: center;
    border: 3px solid rgb(19, 136, 103);
    border-radius: 10px;
    padding: 5px;
    width: 100%;
}

.courses-container {
    position: absolute;
    top: 100%; 
    left: 0;
    width: 100%;
    background: white;
    border: 1px solid #ccc;
    max-height: 200px; 
}

.coursesList {
    list-style: none;
    padding: 0;
    margin: 0;
}

.coursesList li {
    padding: 8px;
    cursor: pointer;
}

.coursesList li:hover {
    background-color: #f1f1f1;
}

</style>