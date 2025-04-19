<template>
    <div class="container">
        <div class="card p-4">
            <div class="head d-flex">
                <h1 class="fs-4">{{name}}</h1>
                <Preloader :visible="cargando"></Preloader>
                <div class="dropdown ms-auto">
                    <button class="btn btn-black dropdown-toggle " type="button" data-bs-toggle="dropdown" aria-expanded="false">
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
            <form class="mb-3"  @submit.prevent="updateEnrollment">
                <div class="d-flex flex-md-row flex-column gap-3" v-if="enrollment">
                    <div class="w-md-50">
                        <label for="startDate">Inicio de matrícula</label>
                        <input type="date" id="startDate" class="form-control" v-model="enrollment.enrollment_date" :readonly="!isEditing">
                    </div>
                    <div class="w-md-50">
                        <label for="endDate">Fin de matrícula</label>
                        <input type="date" id="endDate" class="form-control" v-model="enrollment.end_enrollment_date" :readonly="!isEditing">
                    </div>
                </div>
                <div v-if="isEditing" class="d-flex justify-content-center gap-3 m-3">
                    <button type="submit" class="btn btn-cyan">{{ loading ? "Actualizando..." : "Actualizar" }}</button>
                    <button type="button" class="btn btn-blue" @click="cancelEdit">Cancelar</button>
                </div>
            </form>
            <section class="d-flex flex-md-row flex-column gap-3" v-if="enrollment">
                <!-- alumno -->
                <div class="w-md-50 w-100">
                    <div>
                        <h3 class="fs-5">Alumno matriculado</h3>
                    </div>
                    <div>
                        <div class="form-group">
                            <label for="name">Nombre</label>
                            <input type="text" class="form-control" id="name" v-model="enrollment.user.names" readonly>
                        </div>
                        <div class="form-group">
                            <label for="last_name">Apellidos</label>
                            <input type="text" class="form-control" id="last_name" v-model="enrollment.user.last_names" readonly>
                        </div>
                        <div class="form-group">
                            <label for="email">Correo</label>
                            <input type="text" class="form-control" id="email" v-model="enrollment.user.email" readonly>
                        </div>
                    </div>
                </div>
                <!-- curso -->
                <div class="w-md-50 w-100">
                    <div>
                        <h3 class="fs-5">Detalle del curso</h3>
                    </div>
                    <div>
                        <div class="form-group">
                            <label for="name_long">Nombre</label>
                            <input type="text" class="form-control" id="name_long" v-model="enrollment.course.name_long" readonly>
                        </div>
                        <div class="form-group">
                            <label for="price">Precio</label>
                            <input type="text" class="form-control" id="price" v-model="enrollment.course.price" readonly>
                        </div>
                        <div class="form-group">
                            <label for="description">Descripción</label>
                            <input type="text" class="form-control" id="description" v-model="enrollment.course.description" readonly>
                        </div>
                    </div>
                </div>
            </section>

            <section class="Payments" >
                <div class="d-flex align-items-center gap-3">
                    <h3>Pagos</h3>
                    <!-- Button trigger modal -->
                    <button type="button" class="btn btn-green" data-bs-toggle="modal" data-bs-target="#paymentModal">
                    Nuevo
                    </button>

                    <!-- Modal -->
                    <div class="modal fade" id="paymentModal" tabindex="-1" aria-labelledby="paymentModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="paymentModalLabel">Nuevo Pago</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form class="courses-form  p-4"  @submit.prevent="createPayment()">
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
                                <div class="modal-footer gap-3">
                                    <button type="submit" class="btn btn-green" data-bs-dismiss="modal">{{ loading ? "Agregando..." : "Agregar" }}</button>
                                    <button type="button" class="btn btn-blue" data-bs-dismiss="modal">Close</button>
                                </div>
                            </form>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                    <div v-if="enrollment.payments && enrollment.payments.length>0" class="table-responsive">
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
            </section>
            <div class="d-flex justify-content-center">
                <button type="button" id="button-cancel" class="btn btn-blue m-2" @click="goBack">Volver</button>
            </div>
        </div>
    </div>
</template>
<script>
import EnrollmentService from '@/services/EnrollmentsService.js';
import PaymentService from '@/services/PaymentsService.js';
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
        },
        async createPayment(){
            try{                
                this.newPayment.enrollment_id=this.enrollment.id;
                this.loading=true;
                this.cargando=true;
                if(this.quotas===0||this.quotas===1){
                    this.newPayment.amount=this.enrollment.course.price;
                    await PaymentService.postPayment(this.newPayment);
                    this.$router.push({name:'Pagos'});
                }
                else{
                    this.newPayment.amount=this.enrollment.course.price/this.quotas;
                    for(let i=0;i<this.quotas;i++){
                        await PaymentService.postPayment(this.newPayment);
                    }
                    this.getEnrollmentDetails();
                }
            }catch(error){
                console.log(error);
            }
            finally{
                this.loading=false;
                this.cargando=false;
            }
        
        },
    }
}
</script>
