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
                    <div class="w-lg-60 w-md-90 w-100">
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
                    <div class="d-flex flex-column w-lg-50 w-md-70 w-100" v-if="isViewing">
                        <label>Imagen de perfil</label>
                        <img :src="getImagenUrl(student.photo)" class="card-img mb-3" alt="Foto perfil"/>
                    </div>
                </div>
                <!-- datos de matriculas -->
                <div >
                    <div class="d-flex align-items-center gap-3" >
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
                                    <form class="courses-form col-12 mx-auto"  @submit.prevent="createNewEnrollment()">
                                        <div class="form-group">
                                            <label for="startDate">Inicio de matrícula</label>
                                            <input type="date" id="startDate" class="form-control" v-model="newEnrollment.enrollment_date" required>
                                        </div>
                                        <div class="form-group">
                                            <label for="endDate">Fin de matrícula</label>
                                            <input type="date" id="endDate" class="form-control" v-model="newEnrollment.end_enrollment_date" required>
                                        </div>                                     
                                        <div class="form-group ">
                                            <label>Cursos</label>
                                            <Multiselect 
                                                    v-model="selectedCourses" 
                                                    :options="availableCourses" 
                                                    :multiple="true"
                                                    :searchable="true" 
                                                    :showLabels="false"
                                                    openDirection="bottom"
                                                    placeholder="Selecciona el curso"
                                                    label="name_long"
                                                    track-by="id">
                                                    <template #noOptions>
                                                        <span class="text-gray-500">No hay cursos disponibles</span>
                                                    </template>
                                                    <template #noResult>
                                                        <span class="text-gray-500"> No se encontraron coincidencias. </span>
                                                    </template>
                                                </Multiselect>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="submit" class="btn btn-green" data-bs-dismiss="modal">{{loading?'Creando...':'Crear'}}</button>
                                            <button type="button" class="btn btn-blue" data-bs-dismiss="modal">Cerrar</button>
                                        </div>
                                    </form>
                                    <!--  -->
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- fin modal matricula-->
                    <div v-if="studentEnrollments.length>0" class="table-responsive">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Curso</th>
                                    <th>Fecha de matrícula</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="enrollment in studentEnrollments" :key="enrollment.id">
                                    <td>{{ enrollment.course.name_long }}</td>
                                    <td>{{ enrollment.enrollment_date }}</td>
                                    <td>{{ enrollment.status }}</td>
                                    <td>
                                        <button type="button" class="btn btn-outline-danger" @click="deleteEnrollment(enrollment.id)">Eliminar</button>
                                    </td>
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
                    <div class="d-flex align-items-center gap-3 ">
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
                                    <div v-if="student.enrollments.length>0">
                                        <form class="courses-form  p-4"  @submit.prevent="createNewCertificate()">
                                            <!--  -->
                                            <div class="form-group ">
                                                <label for="issue_date">Fecha de emisión</label>
                                                <input type="date" id="issue_date" class="form-control" v-model="newCertificate.issue_date" required>
                                            </div>
                                            <div class="form-group d-flex flex-column">
                                                <label for="courses">Cursos matriculados</label>
                                                <Multiselect 
                                                    v-model="selectedCourse" 
                                                    :options="coursesStudent" 
                                                    :searchable="true" 
                                                    :showLabels="false"
                                                    openDirection="bottom"
                                                    placeholder="Selecciona el curso"
                                                    label="name_long"
                                                    track-by="id"
                                                    @change="setDataCertificate()">
                                                    <template #noOptions>
                                                        <span class="text-gray-500">El estudiante no esta matriculado en ningún curso</span>
                                                    </template>
                                                    <template #noResult>
                                                        <span class="text-gray-500"> No se encontraron coincidencias. </span>
                                                    </template>
                                                </Multiselect>
                                            </div>
                                            <div v-if="selectedCourse" class="form-group d-flex flex-column">
                                                <div>
                                                    <label for="start_date">Fecha de inicio</label>
                                                    <input type="date" id="start_date" class="form-control" v-model="newCertificate.start_date" required>
                                                </div>
                                                <div>
                                                    <label for="end_date">Fecha de fin</label>
                                                    <input type="date" id="end_date" class="form-control" v-model="newCertificate.end_date" required>
                                                </div> 
                                                <div>
                                                    <label for="duration_in_hours">Duración en horas</label>
                                                    <input type="number" id="duration_in_hours" class="form-control" v-model="newCertificate.duration_in_hours" required>
                                                </div>
                                                <div>
                                                    <label for="code">Código</label>
                                                    <input type="text" id="code" class="form-control" v-model="newCertificate.code" required>
                                                </div>
                                            </div>                                        
                                            <div class="modal-footer">
                                                <button type="submit" class="btn btn-green" data-bs-dismiss="modal">{{loading?'Creando...':'Crear'}}</button>
                                                <button type="button" class="btn btn-blue" data-bs-dismiss="modal">Cerrar</button>
                                            </div>
                                        </form>
                                    </div>
                                    <div v-else>
                                        <p>El estudiante no tiene matrículas activas</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- fin modal certificado-->
                    <div v-if="studentCertificates.length>0" class="table-responsive">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Fecha de emisión</th>
                                    <th>Curso</th>
                                    <th>Duración (H)</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="certificate in studentCertificates" :key="certificate.id">
                                    <td>{{ certificate.issue_date }}</td>
                                    <td>{{ certificate.course.name_long }}</td>
                                    <td>{{ certificate.duration_in_hours }}</td>
                                    <td>
                                        <button type="button" class="btn btn-outline-danger" @click="deleteCertificate(certificate.id)">Eliminar</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-else>
                        <p>Sin certificados</p>
                    </div>
                </div>
                <!-- Datos de pagos -->
                <div>
                    <div class="d-flex align-items-center gap-3 ">
                        <h2 class="fs-5">Pagos</h2>
                        <button type="button" class="btn btn-green" data-bs-toggle="modal" data-bs-target="#newPayment">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                            </svg>
                            Nuevo
                        </button>   
                        <!-- Modal pagos-->
                    <div class="modal fade" id="newPayment" tabindex="-1" aria-labelledby="newPaymentLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="newPaymentLabel">Nuevo Pago</h1>
                                    <button type="button" class="btn-close btn-black" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <div v-if="student.enrollments.length>0">
                                        <div class="table-responsive mt-3">
                                            <h2 class="fs-5">Mátriculas disponibles</h2>
                                            <table id="enrollmentsTable" class="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>Check</th>
                                                        <th>Curso</th>
                                                        <th>Costo</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="enrollment in studentEnrollments" :key="enrollment.id">
                                                        <td>
                                                            <input type="radio" v-model="selectedEnrollment" :value="enrollment" >
                                                        </td>
                                                        <td>{{ enrollment.course.name_long }}</td>
                                                        <td>{{ enrollment.course.price }}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <form class="courses-form  p-4"  @submit.prevent="createNewPayment()">
                                            <fieldset>
                                                <div class="form-group ">
                                                    <label for="payment_date">Fecha de pago</label>
                                                    <input type="date" id="payment_date" class="form-control" v-model="newPayment.payment_date" required>
                                                </div>
                                                <div class="form-group ">
                                                    <label for="transaction_code">Código de TRX</label>
                                                    <input type="text" id="transaction_code" class="form-control" v-model="newPayment.transaction_code" required>
                                                </div>
                                                <div class="form-group ">
                                                    <label for="voucher">Voucher</label>
                                                    <input type="text" id="voucher" class="form-control" v-model="newPayment.voucher" required>
                                                </div>
                                                <div class="form-group ">
                                                    <label for="amount">Cuotas</label>
                                                    <input type="number" id="amount" class="form-control" v-model="quotas" required>
                                                </div>
                                                <div class="form-group d-flex flex-column">
                                                    <label for="type">Tipo</label>
                                                    <select name="type" class="form-control p-2" v-model="newPayment.type" required>
                                                        <option value="" disabled selected>---Selecciona un tipo de pago---</option>
                                                        <option value="transferencia">Transferencia</option>
                                                        <option value="yape">Yape</option>
                                                        <option value="plin">Plin</option>
                                                        <option value="tarjeta">Tarjeta</option>
                                                    </select>
                                                </div>
                                                <div class="form-group d-flex flex-column">
                                                    <label for="status">Estado</label>
                                                    <select name="status" class="form-control p-2" v-model="newPayment.status" required>
                                                        <option value="" disabled selected>---Selecciona un estado de la TRX---</option>
                                                        <option value="pendiente">Pendiente</option>
                                                        <option value="completada">Completado</option>
                                                        <option value="fallida">Fallido</option>
                                                    </select>
                                                </div>
                                            </fieldset>
                                            <div class="modal-footer">
                                                <button type="submit" class="btn btn-green" data-bs-dismiss="modal">{{loading?'Creando...':'Crear'}}</button>
                                                <button type="button" class="btn btn-blue" data-bs-dismiss="modal">Cerrar</button>
                                            </div>
                                        </form>
                                    </div>
                                    <div v-else>
                                        <p>El estudiante no tiene matrículas activas</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- fin modal pagos-->    
                    </div>
                    <div v-if="studentEnrollments.some(enroll => enroll.payments && enroll.payments.length > 0)" class="table-responsive">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Curso</th>
                                    <th>Fecha de pago</th>
                                    <th>TRX Código</th>
                                    <th>Monto</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-for="enroll in studentEnrollments" :key="enroll.id">
                                    <tr v-for="payment in enroll.payments" :key="payment.id">
                                        <td>{{ enroll.course.name_long }}</td>
                                    <td>{{ payment.payment_date }}</td>
                                    <td>{{ payment.transaction_code }}</td>
                                    <td>{{ payment.amount }}</td>
                                    <td>{{ payment.status }}</td>
                                    <td>
                                        <button type="button" class="btn btn-outline-danger" @click="deletePayment(payment.id)">
                                        Eliminar
                                        </button>
                                    </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                    <div v-else>
                        <p>Sin pagos</p>
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
import CourseService from '@/services/CoursesService.js';
import EnrollmentService from '@/services/EnrollmentsService.js';
import CertificateService from '@/services/CertificatesService.js';
import PaymentService from '@/services/PaymentsService.js';
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
            availableUserCourses: [],
            selectedUserCourses:[],
            newCertificate: {
                user_id: '',
                course_id: '',
                issue_date: '',
                start_date: '',
                end_date: '',
                duration_in_hours: '',
                code:'',
            },
            newEnrollment: {
                user_id:'',
                course_id: '',
                enrollment_date:'',
                end_enrollment_date:'',
                status: 'activo',
            },
            newPayment:{
                enrollment_id:'',
                transaction_code:'', 
                voucher:'',
                amount:'',  
                type:'', 
                status:'',
                payment_date:'',
            },
            quotas:0,
            selectedEnrollment:null,
            coursesStudent: [],
            selectedCourse: null,
            studentEnrollments: [],
            studentCertificates: [],
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
    watch: {
        selectedCourse() {
            this.setDataCertificate();
        }
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
                this.getCoursesStudent();
                this.getStudentEnrollments();
                this.getCerficatesStudent();
            }catch(error){
                console.log(error);
            }finally{
                this.cargando=false;
            }
        },
        async getAvailableCourses() {
            const response = await CourseService.getCourses();
            const allCourses = response.data.data;
                const assignedCourseIds = this.student.enrollments.map(enroll => enroll.course_id);

                this.availableCourses = allCourses.filter(course => 
                    !assignedCourseIds.includes(course.id)
                );
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
        async createNewEnrollment(){
            this.loading=true;
            this.error='';
            try{
                this.newEnrollment.user_id=this.student.id;
                for(let course of this.selectedCourses){
                    this.newEnrollment.course_id=course.id;
                    await EnrollmentService.postEnrollment(this.newEnrollment);
                }    
                this.getStudentDetails();            
            }catch(err){
                this.error = Object.values(err.response.data.errors).flat().join(" ");
            }finally{
                this.loading=false;                
            }
        },
        setDataCertificate(){
            this.newCertificate.start_date=this.selectedCourse.start_date;
            this.newCertificate.end_date=this.selectedCourse.end_date;
            this.newCertificate.duration_in_hours=this.selectedCourse.duration_in_hours;
        },
        async getCoursesStudent(){
            try {
                console.log(this.student.enrollments)
                if (this.student.enrollments.length>0) {
                    const promises = this.student.enrollments.map(enroll =>
                        CourseService.getCourseDetails(enroll.course_id)
                    );
                    const responses = await Promise.all(promises);
                    this.coursesStudent = responses.map(response => response.data.data);
                } else {
                    this.coursesStudent = [];                   
                }
            } catch (error) {
                console.log(error);
            }
        },
        async getCerficatesStudent(){
            const promises= this.student.certificates.map(cert =>
                CertificateService.getCertificateDetails(cert.id)
            );
            const responses=await Promise.all(promises);
            this.studentCertificates=responses.map(response => response.data.data);
            console.log("certificados del est",this.studentCertificates);
        },
        async getStudentEnrollments(){
            const promises= this.student.enrollments.map(enroll =>
                EnrollmentService.getEnrollmentDetails(enroll.id)
            );
            const responses=await Promise.all(promises);
            this.studentEnrollments=responses.map(response => response.data.data);
            console.log("cursos del est",this.studentEnrollments);
            
        },
        async createNewCertificate(){
            try{
                this.newCertificate.user_id=this.student.id;
                this.newCertificate.course_id=this.selectedCourse.id;                
                this.loading=true;
                await CertificateService.postCertificate(this.newCertificate);
                this.getStudentDetails();
            }catch(error){
                console.log(error);
            }
            finally{
                this.loading=false;
            }
        },
        async deleteEnrollment(enrollmentId){
            const confirmed = confirm('¿Estás seguro de que deseas eliminar esta matrícula?');
            if (confirmed) {
                try {
                    await EnrollmentService.deleteEnrollment(enrollmentId);
                    this.getStudentDetails();
                } catch (error) {
                    alert('Hubo un error al intentar eliminar la matrícula.');
                }
            }
        },
        async deleteCertificate(certificateId){
            const confirmed = confirm('¿Estás seguro de que deseas eliminar este certificado?');
            if (confirmed) {
                try {
                    await CertificateService.deleteCertificate(certificateId);
                    this.getStudentDetails();
                } catch (error) {
                    alert('Hubo un error al intentar eliminar el certificado.');
                }
            }
        },
        async deletePayment(paymentId){
            const confirmed = confirm('¿Estás seguro de que deseas eliminar este pago?');
            if (confirmed) {
                try {
                    await PaymentService.deletePayment(paymentId);
                    this.getStudentDetails();
                } catch (error) {
                    alert('Hubo un error al intentar eliminar el pago.');
                }
            }
        },
        async createNewPayment(){
            console.log(this.selectedEnrollment);
            try{
                if (!this.selectedEnrollment) {
                    alert("Selecciona una matrícula");
                    return;
                }
                this.newPayment.enrollment_id=this.selectedEnrollment.id;
                this.loading=true;
                if(this.quotas===0||this.quotas===1){
                    this.newPayment.amount=this.selectedEnrollment.course.price;
                    await PaymentService.postPayment(this.newPayment);
                    this.getStudentDetails();
                }
                else{
                    this.newPayment.amount=this.selectedEnrollment.course.price/this.quotas;
                    for(let i=0;i<this.quotas;i++){
                        await PaymentService.postPayment(this.newPayment);
                    }
                    this.getStudentDetails();
                }
            }catch(error){
                console.log(error);
            }
            finally{
                this.loading=false;
            }

        }
    }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>