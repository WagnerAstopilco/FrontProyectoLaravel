<template>
    <div class="container">
        <div class="card p-4">
            <h1 class="fs-4">{{name}}</h1>
            <Preloader :visible="cargando"></Preloader>
            <div class="col-8 mx-auto">
                    <!-- Tabla de matrículas -->
                    <div class="table-responsive mt-3">
                        <h2 class="fs-5">Mátriculas disponibles</h2>
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

                <form class="courses-form  p-4"  @submit.prevent="createPayment()">
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
                    <div class="d-flex justify-content-center">
                        <button type="submit" class="btn btn-info m-2">{{ loading ? "Agregando..." : "Agregar" }}</button>
                        <button type="button" id="button-cancel" class="btn btn-warning m-2" @click="goBack">Volver</button>
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
                console.log(this.enrollments);
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
<style scoped>
.search-bar-student{
    display: flex;
    flex-direction: row;
    align-items: center;
    border:3px solid rgb(19, 136, 103);
    border-radius: 10px;
    padding:5px;
}
.search-bar-student-input {
    background-color: transparent; 
    border: none; 
    outline: none; 
    padding: 8px 12px; 
    font-size: 16px;  
    color: #333;
    width: 100%;
}
.search-bar-student-input:focus {
    outline: none; 
}

.student-container {
    position: absolute;
    top: 100%; 
    left: 0;
    width: 100%;
    background: white;
    border: 1px solid #ccc;
    max-height: 200px; 
}

.studentsList {
    list-style: none;
    padding: 0;
    margin: 0;
}

.studentsList li {
    padding: 8px;
    cursor: pointer;
}

.studentsList li:hover {
    background-color: #f1f1f1;
}

</style>