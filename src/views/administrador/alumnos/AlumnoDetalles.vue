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
                    <ul class="dropdown-menu" v-if="student">
                        <li><a class="dropdown-item" href="#" @click="editStudent()">Editar</a></li>
                        <li><a class="dropdown-item" href="#" @click="deleteStudent">Eliminar</a></li>
                    </ul>
                </div>            
            </div>
            <div v-if="student" class="card-body pb-0">
                <!-- datos del estudiante -->
                <div class="d-flex flex-lg-row flex-column gap-3 mx-auto">
                    <div class="w-lg-60 w-md-90 w-100 mb-3">
                        <form @submit.prevent="updateStudent">
                            <fieldset>
                                <div class="form-group">
                                    <label for="names">Nombres</label>
                                    <input type="text" class="form-control" id="names" v-model="student.names" placeholder="Nombres" :readonly="!isEditing"/>
                                </div>
                                <div class="form-group">
                                    <label for="last_names">Apellidos</label>
                                    <input type="text" class="form-control" id="last_names" v-model="student.last_names" placeholder="Apellidos" :readonly="!isEditing"/>
                                </div>
                                <div class="form-group">
                                    <label for="email">Correo</label>
                                    <input type="email" class="form-control" id="email" v-model="student.email" placeholder="Correo" :readonly="!isEditing"/>
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
                                    <input type="tel" class="form-control" id="phone_number" v-model="student.phone_number" placeholder="Teléfono" :readonly="!isEditing"/>
                                </div>
                                <div class="form-group">
                                    <label for="status">Estado</label>
                                    <select name="status" class="form-control" v-model="student.status" :disabled="!isEditing">
                                        <option value="activo">Activo</option>
                                        <option value="inactivo">Inactivo</option>
                                    </select>
                                </div>
                                <div class="d-flex flex-column flex-md-row gap-md-3 w-100">
                                    <div class="form-group flex-grow-1">
                                        <label for="birthday_date">Fecha de nacimiento</label>
                                        <input type="date" class="form-control" id="birthday_date" v-model="student.birthday_date" :readonly="!isEditing"/>
                                    </div>
                                    <div class="form-group flex-grow-1">
                                        <label for="country">País</label>
                                        <input type="text" class="form-control" id="country" v-model="student.country" placeholder="País" :readonly="!isEditing"/>
                                    </div>
                                    <div class="form-group flex-grow-1">
                                        <label for="city">Ciudad</label>
                                        <input type="text" class="form-control" id="city" v-model="student.city" placeholder="Ciudad" :readonly="!isEditing"/>
                                    </div>
                                </div>
                                <div class="d-flex flex-column flex-md-row gap-md-3 w-100">
                                    <div class="form-group flex-grow-1">
                                        <label for="address_type">Tipo</label>
                                        <select name="address_type" class="form-control" v-model="student.address_type" :disabled="!isEditing">
                                            <option value="jiron">Jr.</option>
                                            <option value="avenida">Av.</option>
                                            <option value="pasaje">Psj.</option>
                                            <option value="prolongacion">Prol.</option>
                                            <option value="calle">Calle</option>
                                        </select>
                                    </div>
                                    <div class="form-group flex-grow-1">
                                        <label for="address">Dirección</label>
                                        <input type="text" class="form-control" id="address" v-model="student.address" placeholder="Calle" :readonly="!isEditing"/>
                                    </div>
                                    <div class="form-group flex-grow-1">
                                        <label for="address_number">N°/Mzn/Lt</label>
                                        <input type="text" class="form-control" id="address_number" v-model="student.address_number" placeholder="Número" :readonly="!isEditing"/>
                                    </div>
                                </div>
                                <div class="d-flex flex-column flex-md-row gap-md-3 w-100">
                                    <div class="form-group flex-grow-1">
                                        <label for="document_type">Tipo</label>
                                        <select name="document_type" class="form-control" v-model="student.document_type" :disabled="!isEditing">
                                            <option value="pasaporte">Pasaporte</option>
                                            <option value="dni">DNI</option>
                                            <option value="cedula">Cédula de identidad</option>
                                        </select>
                                    </div>
                                    <div class="form-group flex-grow-1">
                                        <label for="document_number">Número</label>
                                        <input type="text" class="form-control" id="document_number" v-model="student.document_number" placeholder="Número de documento" :readonly="!isEditing"/>
                                    </div>
                                    <div class="form-group flex-grow-1">
                                        <label for="gender">Género</label>
                                        <select name="gender" class="form-control" v-model="student.gender" :disabled="!isEditing">
                                            <option value="M">Masculino</option>
                                            <option value="F">Femenino</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="speciality">Especialidad</label>
                                    <input type="text" class="form-control" id="speciality" v-model="student.speciality" placeholder="Especialidad" :readonly="!isEditing"/>
                                </div>
                                <div class="form-group">
                                    <label for="biography">Biografía</label>
                                    <textarea id="biography" class="form-control" v-model="student.biography" placeholder="Biografía del usuario" :readonly="!isEditing"></textarea> 
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
                            </fieldset>
                            <div v-if="isEditing" class="d-flex gap-3">
                                <button type="submit" class="btn btn-cyan">{{ loading ? "Actualizando..." : "Actualizar" }}</button>
                                <button type="button" class="btn btn-blue" @click="cancelEdit">Cancelar</button>
                            </div>
                        </form>
                    </div>
                    <div class="w-lg-50 w-md-70 w-100" v-if="isViewing">
                        <label>Imagen de perfil</label>
                        <img :src="getImagenUrl(student.photo)" class="card-img mb-3" alt="Foto perfil"/>
                    </div>
                </div>
                <!-- datos de matriculas -->
                <div >
                    <div class="d-flex gap-3" >
                        <h2 class="fs-5">Matrículas</h2>
                        <button type="button" class="btn btn-green" data-bs-toggle="modal" data-bs-target="#newEnrollment">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                            </svg>
                            Nuevo
                        </button>       
                    </div>
                    <!-- Modal matricula -->
                    <div class="modal fade" id="newEnrollment" tabindex="-1" aria-labelledby="newEnrollmentLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="newEnrollmentLabel">Nueva Matrícula</h1>
                                    <button type="button" class="btn-close btn-black" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <form @submit.prevent="createNewEnrollment">
                                        <fieldset>
                                            <div class="form-group">
                                                <label for="enrollment_date">Inicio de matrícula</label>
                                                <input type="date" class="form-control" id="enrollment_date" v-model="newEnrollment.enrollment_date"/>
                                            </div>
                                            <div class="form-group">
                                                <label for="end_enrollment_date">Fin de matrícula</label>
                                                <input type="date" class="form-control" id="end_enrollment_date" v-model="newEnrollment.end_enrollment_date"/>
                                            </div>
                                            <div class="form-group">
                                                <label for="course_id">Curso</label>
                                                <Multiselect
                                                    id="course_id"
                                                    v-model="selectedCourses" 
                                                    :options="availableCourses" 
                                                    :multiple="true"
                                                    :searchable="true" 
                                                    openDirection="bottom"
                                                    placeholder="Seleccionar cursos"
                                                    label="name_long"
                                                    selectLabel="Presiona enter para seleccionar"
                                                    selectedLabel="Seleccionado"
                                                    deselectLabel="Presiona enter para quitar"
                                                    track-by="id" >
                                                    <template #noOptions>
                                                        <span class="text-gray-500">No hay cursos disponibles</span>
                                                    </template>
                                                    <template #noResult>
                                                        <span class="text-gray-500"> No se encontraron coincidencias. </span>
                                                    </template>
                                                </Multiselect>
                                            </div>
                                            <div class="form-group">
                                                <label for="status">Estado</label>
                                                <select name="status" class="form-control" v-model="newEnrollment.status">
                                                    <option value="activo">Activo</option>
                                                    <option value="inactivo">Inactivo</option>
                                                </select>
                                            </div>
                                        </fieldset>
                                        <div class="modal-footer">
                                            <!-- TODO: CREAR createNewEnrollment PARA GENERAR UNA NUEVA MATRICULA -->
                                            <button type="button" class="btn btn-green" @click="createNewEnrollment">{{loading?'Creando...':'Crear'}}</button>
                                            <button type="button" class="btn btn-blue" data-bs-dismiss="modal">Cerrar</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- fin modal matricula-->
                    <div v-if="student.enrollments.length>0" class="table-responsive">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Curso</th>
                                    <th>Fecha de matrícula</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="enrollment in student.enrollments" :key="enrollment.id">
                                    <td>{{ enrollment.course.name_long }}</td>
                                    <td>{{ enrollment.enrollment_date }}</td>
                                    <td>{{ enrollment.status }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-else>
                        <p>Sin matrículas</p>
                    </div>
                </div>
                <!-- datos de certificados -->
                <div>
                    <div class="d-flex gap-3 alg-items-center">
                        <h2 class="fs-5">Certificados</h2>
                        <button type="button" class="btn btn-green" data-bs-toggle="modal" data-bs-target="#newCertificate">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                            </svg>
                            Nuevo
                        </button>       
                    </div>
                    <!-- Modal certificado-->
                    <div class="modal fade" id="newCertificate" tabindex="-1" aria-labelledby="newCertificateLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="newCertificateLabel">Nuevo Certificado</h1>
                                    <button type="button" class="btn-close btn-black" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <form @submit.prevent="createNewCertificate">
                                        <fieldset>
                                            <div class="form-group">
                                                <label for="issue_date">Fecha de emisión</label>
                                                <input type="date" class="form-control" id="issue_date" v-model="newCertificate.issue_date" />
                                            </div>
                                            <div class="form-group">
                                                <label for="course_id">Curso</label>
                                                <Multiselect   
                                                    v-model="selectedUserCourses" 
                                                    :options="availableUserCourses" 
                                                    :multiple="false"
                                                    :max="1"
                                                    :searchable="true" 
                                                    openDirection="bottom"
                                                    placeholder="Seleccionar curso"
                                                    label="names"
                                                    selectLabel="Presiona enter para seleccionar"
                                                    selectedLabel="Seleccionado"
                                                    deselectLabel="Presiona enter para quitar"
                                                    track-by="name_long" >
                                                    <template #noOptions>
                                                        <span class="text-gray-500">No hay cursos disponibles</span>
                                                    </template>
                                                    <template #noResult>
                                                        <span class="text-gray-500"> No se encontraron coincidencias. </span>
                                                    </template>
                                                </Multiselect>
                                            </div>
                                            <div class="form-group">
                                                <label for="start_date">Fecha de inicio</label>
                                                <input type="date" class="form-control" id="start_date" v-model="newCertificate.start_date" />
                                            </div>
                                            <div class="form-group">
                                                <label for="end_date">Fecha de fin</label>
                                                <input type="date" class="form-control" id="end_date" v-model="newCertificate.end_date" />
                                            </div>
                                            <div class="form-group">
                                                <label for="duration_in_hours">Duración</label>
                                                <input type="number" class="form-control" id="duration_in_hours" v-model="newCertificate.duration_in_hours" placeholder="Duración en horas" />
                                            </div>
                                            <div class="form-group">
                                                <label for="code">Código</label>
                                                <input type="text" class="form-control" id="code" v-model="newCertificate.code" placeholder="Código del certificado" />
                                            </div>
                                        </fieldset>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-green" @click="createNewCertificate">{{loading?'Creando...':'Crear'}}</button>
                                            <button type="button" class="btn btn-blue" data-bs-dismiss="modal">Cerrar</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- fin modal certificado-->
                    <div v-if="student.certificates.length>0" class="table-responsive">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Fecha de emisión</th>
                                    <th>Curso</th>
                                    <th>Duración</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="certificate in student.certificates" :key="certificate.id">
                                    <td>{{ certificate.issue_date }}</td>
                                    <td>{{ certificate.course.name_long }}</td>
                                    <td>{{ certificate.duration_in_hours }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-else>
                        <p>Sin certificados</p>
                    </div>
                </div>
            </div>           
            <div class="card-footer d-flex justify-content-center">                
                <button type="button" class="btn btn-blue" @click="goBack">Volver</button>
            </div>
        </div>
    </div>
</template>
<script>
import UserService from '@/services/UsersService.js';
import CourseService from '@/services/CoursesService.js';
import Preloader from '../../components/Preloader.vue';
import Multiselect from 'vue-multiselect';

export default{
    data(){
        return{
            name:'Detalles del Alumno',
            idstudent: this.$route.params.idalumno,
            cargando:false,
            student: null,
            loading:false,
            isViewing: false,
            isEditing: false,
            imagePreview: null,
            password:'',
            password_confirm:'',
            photoPreview:false,
            error:'',
            selectedCourses: [],
            availableCourses: [],
            selectedUserCourses:[],
            newCertificate: {
                user_id: this.idstudent,
                issue_date: '',
                course_id: '',
                start_date: '',
                fin_date: '',
                duration_in_hours: '',
                code:'',
            },
            newEnrollment: {
                user_id: this.idstudent,
                course_id: '',
                enrollment_date:'',
                end_enrollment_date:'',
                status: 'activo',
            },
            availableUserCourses: [],
        };
    },
    mounted() {
        if (this.$route.name === 'AlumnoDetallesVer') {
            this.isViewing = true;
        } else if (this.$route.name === 'AlumnoDetallesEditar') {
            this.isEditing = true;
        }
        this.getAvailableCourses();
    },
    created(){
        this.getStudentDetails();
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
        async getStudentDetails(){
            try{
                this.cargando=true;
                const response=await UserService.getUserDetails(this.idstudent);
                this.student=response.data.data;
            }catch(error){
                console.log(error);
            }finally{
                this.cargando=false;
            }
        },
        async getAvailableCourses(){
            try{
                this.cargando=true;
                const response= await CourseService.getCourses();
                this.availableCourses=response.data.data;
            }catch(error){
                console.log(error);
            }finally{
                this.cargando=false;
            }
        },
        async deleteStudent(){
            const confirmed = confirm('¿Estás seguro de que deseas eliminar este alumno?');
            if (confirmed) {
                try {
                    await UserService.deleteUser(this.idstudent);
                    this.$router.push({name:'Alumnos'});
                } catch (error) {
                    alert('Hubo un error al intentar eliminar el alumno.');
                }
            }
        },
        async updateStudent(){
            if (this.passwordMismatch) {
                return;
            }
            try{
                this.error='';
                this.loading=true;
                const formDataStudent = new FormData();
                Object.entries(this.student).forEach(([key, value]) => {
                    if (key === 'photo' && value instanceof File) {
                        formDataStudent.append(key, value);
                    } else if (key !== 'photo') {
                        formDataStudent.append(key, value);
                    }
                });
                await UserService.patchUser(this.idstudent,formDataStudent);
                this.isEditing = false;
                this.isViewing=true;
                this.$router.replace({name:'AlumnoDetallesVer',params:{idalumno:this.idstudent}})
                this.getStudentDetails();
            }catch(err){
                this.error = Object.values(err.response.data.errors).flat().join(" ");
            }finally{
                this.loading=false;                
            }
        },
        goBack(){
            this.$router.push({name: 'Alumnos'});
        },

        cancelEdit(){
            this.isEditing = false;
            this.isViewing = true;
            this.getStudentDetails();
            this.error='';
            this.$router.push({name:'AlumnoDetallesVer',params:{idalumno:this.idstudent}});
        },
        getImagenUrl(image) {
            if (image) {
                return process.env.VUE_APP_API_URL + "/storage/" + image; 
            }
        },
        editStudent(){
            this.isEditing = true;
            this.isViewing = false;
            this.$router.push({name:'AlumnoDetallesEditar',params:{idalumno:this.idstudent}});
        },
        handleImageUpload(event) {
            const file = event.target.files[0]; 
            if (file) {
                this.student.photo = file;  
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
        createNewCertificate(){
            //TODO: CREAR createNewCertificate PARA GENERAR UN NUEVO CERTIFICADO
        }
    }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>