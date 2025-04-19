<template>
    <div class="container">
        <div class="card p-4">
            <Preloader :visible="cargando"></Preloader>
            <div class="mb-3">
                <h1 class="fs-4">{{name}}</h1>
            </div>
            <div class="w-lg-80 w-md-90 w-100 mx-auto ">
                <div class="mb-3">
                    <!-- Tabla de matrículas -->
                    <h2 class="fs-5">Mátriculas disponibles</h2>
                    <div class="table-responsive mt-3">
                        <table id="enrollmentsTable" class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Check</th>
                                    <th>Alumno</th>
                                    <th>Curso</th>
                                    <th>Costo</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="enrollment in enrollments" :key="enrollment.id">
                                    <td>
                                        <input type="radio" v-model="selectedEnrollment" :value="enrollment" >
                                    </td>
                                    <td>{{ enrollment.user.names}} {{ enrollment.user.last_names}}</td>
                                    <td>{{ enrollment.course.name_long }}</td>
                                    <td>{{ enrollment.course.price }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <form  @submit.prevent="createPayment()">
                    <legend class="fs-5">Datos del pago</legend>
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
                    <div class="d-flex justify-content-center gap-3">
                        <button type="submit" class="btn btn-green">{{ loading ? "Agregando..." : "Agregar" }}</button>
                        <button type="button" id="button-cancel" class="btn btn-blue" @click="goBack">Volver</button>
                    </div>
                    </form>
            </div>
        </div>
    </div>
</template>
<script>
import PaymentService from '@/services/PaymentsService';
import EnrollmentService from '@/services/EnrollmentsService.js'
import $ from 'jquery';
import 'datatables.net-bs4';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import Preloader from '../../components/Preloader.vue';

export default{
    data(){
        return{
            name:'Nuevo Pago',
            cargando:false,
            quotas:0,
            enrollments:[],
            selectedEnrollment:null,
            loading:false,
            newPayment:{
                enrollment_id:'',
                transaction_code:'', 
                voucher:'',
                amount:'',  
                type:'', 
                status:'',
                payment_date:'',
            }
        }
    },
    created(){
        this.getEnrollments();
    },
    beforeUnmount() {
        if ($.fn.dataTable.isDataTable('#enrollmentsTable')) {
            $('#enrollmentsTable').DataTable().destroy();
        }
    },
    components:{
        Preloader
    },
    methods:{
        goBack(){
            this.$router.push({name:'Pagos'});
        },        
        async getEnrollments(){
            try{
                this.cargando=true;
                const response=await EnrollmentService.getEnrollments();
                this.enrollments=response.data.data;
                this.$nextTick(() => {
                        if (!$.fn.dataTable.isDataTable('#enrollmentsTable')) {
                            $('#enrollmentsTable').DataTable();
                        }
                    });
            }catch(error){
                console.log(error);
            }finally{
                this.cargando=false;
            }
        },
        
        async createPayment(){
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
                    this.$router.push({name:'Pagos'});
                }
                else{
                    this.newPayment.amount=this.selectedEnrollment.course.price/this.quotas;
                    for(let i=0;i<this.quotas;i++){
                        await PaymentService.postPayment(this.newPayment);
                    }
                    this.$router.push({name:'Pagos'});
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