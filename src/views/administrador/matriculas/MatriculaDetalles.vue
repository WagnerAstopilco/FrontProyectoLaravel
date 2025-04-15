<template>
    <div class="container">
        <div class="card p-4">
            <div class="head d-flex">
                <h1 class="fs-4">{{name}}</h1>
                <Preloader :visible="cargando"></Preloader>
                <div class="dropdown ms-auto">
                    <button class="btn btn-info dropdown-toggle " type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Opciones
                    </button>
                    <ul class="dropdown-menu">
                        <div v-if="enrollment">
                        <li><a class="dropdown-item" @click="editEnroll()">Editar</a></li>
                        <li><a class="dropdown-item" @click="deleteEnroll">Eliminar</a></li>
                        </div>
                    </ul>
                </div>   
            </div>
            <form class="courses-form col-12 mx-auto p-4"  @submit.prevent="updateEnrollment">
                    <div class="d-flex">
                        <div class="col-6 m-2" v-if="enrollment">
                            <div class=" w-50">
                                <label for="startDate">Inicio de matrícula</label>
                                <input type="date" id="startDate" class="form-control" v-model="enrollment.enrollment_date" :readonly="!isEditing">
                            </div>
                            <div>
                                <h3 class="fs-5">Alumno matriculado</h3>
                            </div>
                            <div>
                                <div>
                                    <div class="form-group">
                                        <label for="name">Nombre</label>
                                        <input type="text" class="form-control w-50" id="name" v-model="enrollment.user.names" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label for="last_name">Apellidos</label>
                                        <input type="text" class="form-control w-50" id="last_name" v-model="enrollment.user.last_names" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label for="email">Correo</label>
                                        <input type="text" class="form-control w-50" id="email" v-model="enrollment.user.email" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label for="email">Correo</label>
                                        <input type="text" class="form-control w-50" id="email" v-model="enrollment.user.role" readonly>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-6 m-2" v-if="enrollment">
                            <div class="w-50">
                                <label for="endDate">Fin de matrícula</label>
                                <input type="date" id="endDate" class="form-control" v-model="enrollment.end_enrollment_date" :readonly="!isEditing">
                            </div>
                            <div>
                                <h3 class="fs-5">Curso</h3>
                            </div>
                            <div>
                                <div class="">
                                    <div class="form-group">
                                        <label for="name_long">Nombre</label>
                                        <input type="text" class="form-control w-50" id="name_long" v-model="enrollment.course.name_long" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label for="price">Precio</label>
                                        <input type="text" class="form-control w-50" id="price" v-model="enrollment.course.price" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label for="description">Descripción</label>
                                        <input type="text" class="form-control w-50" id="description" v-model="enrollment.course.description" readonly>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="isEditing ">
                        <button type="submit" class="btn btn-outline-warning m-2">{{ loading ? "Actualizando..." : "Actualizar" }}</button>
                        <button type="button" class="btn btn-outline-secondary m-2" @click="cancelEdit">Cancelar</button>
                    </div>
                </form>
                <div class="Payments" >
                    <div class="d-flex align-items-center gap-3">
                        <h3>Pagos</h3>
                    </div>
                        <div v-if="enrollment.payments && enrollment.payments.length>0">
                            <table id="paymentsEnrollTable" class="table table-striped table-pointer">
                                <thead>
                                    <tr>
                                        <th class="text-center">Fecha de pago</th>
                                        <th class="text-center">Tipo</th>
                                        <th class="text-center">Código Trx</th>
                                        <th class="text-center">Monto</th>
                                        <th class="text-center">Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="payment in enrollment.payments" :key="payment.id" @click="goToPaymentDetails(payment.id)">
                                        <td class="text-center">{{ payment.payment_date }}</td>
                                        <td class="text-center">{{ payment.type }}</td>
                                        <td class="text-center">{{ payment.transaction_code }}</td>
                                        <td class="text-center">{{ payment.amount }}</td>
                                        <td class="text-center">{{ payment.status }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div> 
                        <div v-else>
                            <p>Sin pagos vinculados</p>
                        </div>
                    </div>
                <div class="d-flex justify-content-center">
                    <button type="button" id="button-cancel" class="btn btn-warning m-2" @click="goBack">Volver</button>
                </div>
        </div>
    </div>
</template>
<script>
import EnrollmentService from '@/services/EnrollmentsService.js';
import Preloader from '../../components/Preloader.vue';
import $ from 'jquery';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-bs4';

export default{
    data(){
        return{
            name:'Detalles de matrícula',
            idenrollment:this.$route.params.idmatricula,
            cargando:false,
            enrollment:'',
            isEditing:'',
            isViewing:'',
            loading:false,
        }
    },
    created(){
        this.getEnrollmentDetails();  
    },
    beforeUnmount() {
        if ($.fn.dataTable.isDataTable('#paymentsEnrollTable')) {
            $('#paymentsEnrollTable').DataTable().destroy();
        }
    },
    components:{
        Preloader
    },
    methods:{
        async getEnrollmentDetails(){
            try{
                this.cargando=true;
                const response = await EnrollmentService.getEnrollmentDetails(this.idenrollment);
                this.enrollment=response.data.data;

                this.$nextTick(() => {
                    if (this.enrollment && this.enrollment.payments && this.enrollment.payments.length > 0) {
                            $('#paymentsEnrollTable').DataTable();  
                        }
                });
            }catch(error){
                console.log(error);
            }finally{
                this.cargando=false;
            }
        },
        editEnroll(){
            this.isEditing = true;
            this.isViewing = false;
            this.$router.push({ name: 'MatriculaDetallesEditar', params: { idmatricula: this.idenrollment } });
        },
        async updateEnrollment(){
            try
            {
                this.loading = true;
                this.cargando=true;
                await EnrollmentService.patchEnrollment(this.idenrollment, this.enrollment);
                this.isEditing = false;
                this.$router.replace({name: 'MatriculaDetallesVer',params:  { idmatricula: this.idenrollment }});
            }catch(error){
                console.log(error);
            }     
            finally{
                this.loading=false;
                this.cargando=false;
            }
        },
        async deleteEnroll(){
            const confirmed = confirm('¿Estás seguro de que deseas eliminar esta matrícula?');
            if (confirmed) {
                try {
                    await EnrollmentService.deleteEnrollment(this.idenrollment);
                    this.$router.push({ name: 'Matriculas' });
                } catch (error) {
                    alert('Hubo un error al intentar eliminar el material.');
                }
            }   
        },
        cancelEdit(){
            this.isEditing = false;
            this.isViewing = true;
            this.$router.push({ name: 'MatriculaDetallesVer', params: { idmatricula: this.idenrollment }});
        },
        goBack(){
            this.$router.push({name:'Matriculas'});
        },
        goToPaymentDetails(paymentId) {
            this.$router.push({ name: 'PagoDetallesVer', params: { idpago: paymentId } });
        }
    }
}
</script>
