<template>
    <div class="container">
        <div class="card p-4">
            <Preloader :visible="cargando"></Preloader>
            <div class="card-header d-flex pb-0">
                <h1 class="fs-4">{{ name }}</h1>
                <div class="dropdown ms-auto">
                    <button class="btn btn-black dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Opciones
                    </button>
                    <ul class="dropdown-menu">
                        <div v-if="trainer">
                        <li><a class="dropdown-item" href="#" @click="editTrainer()">Editar</a></li>
                        <li><a class="dropdown-item" href="#" @click="deleteTrainer">Eliminar</a></li>
                        </div>
                    </ul>
                </div>            
            </div>
            <div v-if="trainer&&user" class="card-body pb-0">
                <div class="d-flex flex-lg-row flex-column gap-3 mx-auto">
                    <div class="w-lg-60 w-md-90 w-100">
                        <form @submit.prevent="updateTrainer">
                            <div class="form-group">
                                <label for="names">Nombres</label>
                                <input type="text" class="form-control" id="names" v-model="user.names" placeholder="Nombres" :readonly="!isEditing"/>
                            </div>
                            <div class="form-group">
                                <label for="last_names">Apellidos</label>
                                <input type="text" class="form-control" id="last_names" v-model="user.last_names" placeholder="Apellidos" :readonly="!isEditing"/>
                            </div>
                            <div class="form-group">
                                <label for="email">Correo</label>
                                <input type="email" class="form-control" id="email" v-model="user.email" placeholder="Correo" :readonly="!isEditing"/>
                            </div>
                            <div class="form-group" v-if="isEditing ">
                                <label for="password">Contraseña</label>
                                <input type="password" class="form-control" id="password" v-model="password" placeholder="Contraseña" />
                            </div>
                            <div class="form-group" v-if="isEditing ">
                                <label for="password">Confirmar Contraseña</label>
                                <input type="password" class="form-control" id="confirm_password" v-model="password_confirm" placeholder="Confirmar contraseña"/>
                                <small v-show="passwordMismatch" class="text-danger">Las contraseñas no coinciden</small>
                            </div>
                            <div class="form-group">
                                <label for="phone_number">Teléfono</label>
                                <input type="text" class="form-control" id="phone_number" v-model="user.phone_number" placeholder="Teléfono" :readonly="!isEditing"/>
                            </div>
                            <div class="form-group">
                                <label for="status">Estado</label>
                                <select name="status" class="form-control" v-model="user.status" :disabled="!isEditing">
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                </select>
                            </div>
                            <div class="d-flex flex-column flex-md-row gap-md-3 w-100">
                                <div class="form-group flex-grow-1">
                                    <label for="birthday_date">Fecha de nacimiento</label>
                                    <input type="date" class="form-control" id="birthday_date" v-model="user.birthday_date" :readonly="!isEditing"/>
                                </div>
                                <div class="form-group flex-grow-1">
                                    <label for="country">País</label>
                                    <input type="text" class="form-control" id="country" v-model="user.country" placeholder="País" :readonly="!isEditing"/>
                                </div>
                                <div class="form-group flex-grow-1">
                                    <label for="city">Ciudad</label>
                                    <input type="text" class="form-control" id="city" v-model="user.city" placeholder="Ciudad" :readonly="!isEditing"/>
                                </div>
                            </div>
                        <div class="d-flex flex-column flex-md-row gap-md-3 w-100">
                            <div class="form-group flex-grow-1">
                                <label for="address_type">Tipo</label>
                                <select name="address_type" class="form-control" v-model="user.address_type" :disabled="!isEditing">
                                    <option value="jiron">Jr.</option>
                                    <option value="avenida">Av.</option>
                                    <option value="pasaje">Psj.</option>
                                    <option value="prolongacion">Prol.</option>
                                    <option value="calle">Calle</option>
                                </select>
                            </div>
                            <div class="form-group flex-grow-1">
                                <label for="address">Dirección</label>
                                <input type="text" class="form-control" id="address" v-model="user.address" placeholder="Calle" :readonly="!isEditing"/>
                            </div>
                            <div class="form-group flex-grow-1">
                                <label for="address_number">N°/Mzn/Lt</label>
                                <input type="text" class="form-control" id="address_number" v-model="user.address_number" placeholder="Número" :readonly="!isEditing"/>
                            </div>
                        </div>
                        <div class="d-flex flex-column flex-md-row gap-md-3 w-100">
                            <div class="form-group flex-grow-1">
                                <label for="document_type">Tipo</label>
                                <select name="document_type" class="form-control" v-model="user.document_type" :disabled="!isEditing">
                                    <option value="pasaporte">Pasaporte</option>
                                    <option value="dni">DNI</option>
                                    <option value="cedula">Cédula de identidad</option>
                                </select>
                            </div>
                            <div class="form-group flex-grow-1">
                                <label for="document_number">Número</label>
                                <input type="text" class="form-control" id="document_number" v-model="user.document_number" placeholder="Número de documento" :readonly="!isEditing"/>
                            </div>
                            <div class="form-group flex-grow-1">
                                <label for="gender">Género</label>
                                <select name="gender" class="form-control" v-model="user.gender" :disabled="!isEditing">
                                    <option value="M">Masculino</option>
                                    <option value="F">Femenino</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="speciality">Especialidad</label>
                            <input type="text" class="form-control" id="speciality" v-model="user.speciality" placeholder="Especialidad" :readonly="!isEditing"/>
                        </div>
                        <div class="form-group">
                            <label for="biography">Biografía</label>
                            <textarea id="biography" class="form-control" v-model="user.biography" placeholder="Biografía del usuario" :readonly="!isEditing"></textarea> 
                        </div>
                        <div class="form-group">
                        <label for="certifications">Certificaciones</label>
                        <textarea id="certifications" class="form-control" v-model="trainer.certifications" placeholder="Certificaciones del capacitador" :readonly="!isEditing"></textarea> 
                    </div>
                        <div class="form-group" v-if="isEditing">
                            <label for="image">Imagen</label>
                            <input type="file" class="form-control" id="image" @change="handleImageUpload" >
                            <div v-if="imagePreview">
                                <img :src="imagePreview" alt="Vista previa" class="img-fluid mt-2" />
                            </div>
                        </div>
                            <div v-show="error" class="error text-danger mt-2" role="alert">
                                <small>{{ error }}</small>
                            </div>
                            <div v-if="isEditing" class="d-flex gap-3 mt-3">
                                <button type="submit" class="btn btn-cyan">{{ loading ? "Actualizando..." : "Actualizar" }}</button>
                                <button type="button" class="btn btn-blue" @click="cancelEdit">Cancelar</button>
                            </div>
                        </form>
                    </div>
                    <div class="d-flex flex-column w-lg-50 w-md-70 w-100" v-if="isViewing">
                        <label>Imagen de perfil</label>
                        <img :src="getImagenUrl(trainer.photo)" class="card-img mb-3" alt="Foto perfil"/>
                    </div>
                </div>
                <div>
                    <div class="d-flex align-items-center">
                        <h2 class="fs-5">Cursos</h2>
                        <button class="btn btn-green m-4" @click="showSearchCourses=!showSearchCourses">Agregar</button>
                    </div>
                    <!-- buscador de cursos -->
                    <form v-show="showSearchCourses" class="w-lg-50 w-md-60 w-100 mb-4" @submit.prevent="addCoursesToTrainer" >
                        <fieldset>
                            <multiselect 
                                v-model="selectedCourses" 
                                :options="availableCourses" 
                                :multiple="true"
                                :searchable="true" 
                                openDirection="bottom"
                                placeholder="Selecciona cursos para agregar"
                                label="name_long"
                                selectLabel="Presiona enter para seleccionar"
                                selectedLabel="Seleccionado"
                                deselectLabel="Presiona enter para quitar"
                                track-by="id" class="mb-3">
                                <template #noOptions>
                                    <span class="text-gray-500">No hay cursos disponibles</span>
                                </template>
                                <template #noResult>
                                    <span class="text-gray-500"> No se encontraron coincidencias. </span>
                                </template>
                            </multiselect>
                        </fieldset>
                        <div>                            
                            <button type="submit" class="btn m-2 btn-cyan" >{{this.loadingCourse?'Agregando....':'Agregar'}}</button>
                            <button type="button" class="btn m-2 btn-black" @click="showSearchCourses=false">Cancelar</button>
                        </div>
                    </form>
                    <!-- tabla cursos de la categoria -->
                    <div class="table-responsive" v-show="trainer&&trainer.courses&&trainer.courses.length>0">
                        <table id="courseCategoryTable" class="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Abreviación</th>
                                    <th>Descripción</th>
                                    <th>Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="course in (trainer?.courses || [])" :key="course.id">
                                    <td >{{ course.name_long }}</td>
                                    <td>{{ course.name_short }}</td>
                                    <td>{{ course.description }}</td>
                                    <td><button type="button" class="btn btn-outline-danger mb-0 p-1" @click="goToEditCourse(course.id)">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                                            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                                        </svg> Editar Curso</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-show="trainer &&trainer.courses.length===0 && !showSearchCourses">
                        <p>Sin cursos asignados</p>
                    </div>
                </div>          
            </div> 
            <div class="card-footer d-flex justify-content-center pb-0">
                <button type="button" class="btn btn-blue" @click="goBack">Volver</button>
            </div>
        </div>
    </div>
</template>
<script>
import UserService from '@/services/UsersService.js';
import TrainerService from '@/services/TrainersService.js';
import CourseService from '@/services/CoursesService.js';
import Multiselect from 'vue-multiselect';
import Preloader from '../../../components/Preloader.vue';

export default{
    data(){
        return{
            name:'Detalles del Capacitador',
            idtrainer: this.$route.params.idcapacitador,
            trainer: null,
            user:null,
            cargando:false,
            loading:false,
            isViewing: false,
            isEditing: false,
            imagePreview: null,
            password:'',
            password_confirm:'',
            photoPreview:false,
            error:'',

            selectedCourses:[],
            availableCourses:[],
            showSearchCourses:false,
            loadingCourse:false,
        };
    },
    mounted() {
        if (this.$route.name === 'CapacitadorDetallesVer') {
            this.isViewing = true;
        } else if (this.$route.name === 'CapacitadorDetallesEditar') {
            this.isEditing = true;
        }
    },
    created(){
        this.getTrainerDetails();
    },  
    computed: {
        passwordMismatch() {
            return this.password && this.password !== this.password_confirm;
        }
    },
    components:{
        Preloader,
        Multiselect
    },
    methods:{        
        async getTrainerDetails(){
            try{
                this.cargando=true;
                let response=await TrainerService.getTrainerDetails(this.idtrainer);
                this.trainer=response.data.data;
                this.getAvailableCourses();
                console.log("entrenador",this.trainer);
                response=await UserService.getUserDetails(this.trainer.user.id);
                this.user=response.data.data;
            }catch(error){
                console.log(error);
            }finally{
                this.cargando=false;
            }
        },
        async getAvailableCourses(){
            try {
                this.cargando=true;
                const response = await CourseService.getCourses();
                const allCourses = response.data.data;
                if (this.trainer && this.trainer.courses) {
                    const trainerCoursesIds = this.trainer.courses.map(course => course.id);
                    this.availableCourses = allCourses.filter(course => !trainerCoursesIds.includes(course.id));
                } else {
                    this.availableCourses = allCourses;
                }
            } catch (error) {
                console.log(error);
            }finally{
                this.cargando=false;
            }
        },
        async deleteTrainer(){
            const confirmed = confirm('¿Estás seguro de que deseas eliminar este capacitador?');
            if (confirmed) {
                try {
                    const formDataTrainer = new FormData();
                    formDataTrainer.append('role', 'alumno');
                    await UserService.patchUser(this.user.id, formDataTrainer);
                    await TrainerService.deleteTrainer(this.idtrainer);
                    this.$router.push({name:'Capacitadores'});
                } catch (error) {
                    alert('Hubo un error al intentar eliminar el capacitador.');
                }
            }
        },
        async updateTrainer(){
            if (this.passwordMismatch) {
                return;
            }
            try{
                this.error='';
                this.loading=true;
                const formDataUser = new FormData();
                Object.entries(this.user).forEach(([key, value]) => {
                    if (key === 'photo' && value instanceof File) {
                        formDataUser.append(key, value);
                    } else if (key !== 'photo') {
                        formDataUser.append(key, value);
                    }
                });
                await UserService.patchUser(this.user.id,formDataUser);
                await TrainerService.patchTrainer(this.idtrainer,this.trainer);
                this.isEditing = false;
                this.isViewing=true;
                this.$router.replace({name:'CapacitadorDetallesVer',params:{idcapacitador:this.idtrainer}})
                this.getTrainerDetails();
            }catch(err){
                this.error = Object.values(err.response.data.errors).flat().join(" ");
            }finally{
                this.loading=false;                
            }
        },
        goBack(){
            this.$router.push({name: 'Capacitadores'});
        },

        cancelEdit(){
            this.isEditing = false;
            this.isViewing = true;
            this.getTrainerDetails();
            this.error='';
            this.$router.push({name:'CapacitadorDetallesVer',params:{idcapacitador:this.idtrainer}});
        },
        getImagenUrl(image) {
            if (image) {
                return process.env.VUE_APP_API_URL + "/storage/" + image; 
            }
        },
        editTrainer(){
            this.isEditing = true;
            this.isViewing = false;
            this.$router.push({name:'CapacitadorDetallesEditar',params:{idcapacitador:this.idtrainer}});
        },
        handleImageUpload(event) {
            const file = event.target.files[0]; 
            if (file) {
                this.administrator.photo = file;  
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
        async addCoursesToTrainer(){
            if (!this.selectedCourses || this.selectedCourses.length === 0) {
                alert("Debe seleccionar al menos un curso.");
                return;
            }
            this.loadingCourse=true;
            try {
                const requestData = {
                    course_ids: this.selectedCourses.map(course => course.id)
                };
                await TrainerService.postCourseToTrainer(this.idtrainer, requestData);
                this.selectedCourses = [];
                this.showSearchCourses=false;
                this.getTrainerDetails();
            } catch (error) {
                console.error("Error al agregar cursos:", error); 
            } finally {
                this.loadingCourse = false;
            }
        },
    }
}
</script>
<style scoped>
</style>