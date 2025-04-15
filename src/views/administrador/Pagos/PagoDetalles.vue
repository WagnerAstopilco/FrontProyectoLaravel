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
                        <div v-if="payment">
                        <li><a class="dropdown-item" @click="editPayment()">Editar</a></li>
                        <li><a class="dropdown-item" @click="deletePayment">Eliminar</a></li>
                        </div>
                    </ul>
                </div> 
                
            </div>
            <div v-if="payment" class="d-flex">
                <div class="w-50">
                    <form class="courses-form p-4"  @submit.prevent="updatePayment()">
                        <div class="form-group ">
                            <label for="payment_date">Fecha de pago</label>
                            <input type="date" id="payment_date" class="form-control" v-model="payment.payment_date" :readonly="!isEditing">
                        </div>
                        <div class="form-group ">
                            <label for="transaction_code">Código de TRX</label>
                            <input type="text" id="transaction_code" class="form-control" v-model="payment.transaction_code" :readonly="!isEditing">
                        </div>
                        <div class="form-group ">
                            <label for="voucher">Voucher</label>
                            <input type="text" id="voucher" class="form-control" v-model="payment.voucher" :readonly="!isEditing">
                        </div>
                        <div class="form-group ">
                            <label for="amount">Monto de couta</label>
                            <input type="text" id="amount" class="form-control" v-model="payment.amount" :readonly="!isEditing">
                        </div>
                        <div class="form-group d-flex flex-column">
                            <label for="type">Tipo</label>
                            <select name="type" class="form-control p-2" v-model="payment.type" :disabled="!isEditing">
                                <option value="" disabled selected>---Selecciona un tipo de pago---</option>
                                <option value="transferencia">Transferencia</option>
                                <option value="yape">Yape</option>
                                <option value="plin">Plin</option>
                                <option value="tarjeta">Tarjeta</option>
                            </select>
                        </div>
                        <div class="form-group d-flex flex-column">
                            <label for="status">Estado</label>
                            <select name="status" class="form-control p-2" v-model="payment.status" :disabled="!isEditing">
                                <option value="" disabled selected>---Selecciona un estado de la TRX---</option>
                                <option value="pendiente">Pendiente</option>
                                <option value="completada">Completado</option>
                                <option value="fallida">Fallido</option>
                            </select>
                        </div>
                        
                        <div v-if="isEditing ">
                            <button type="submit" class="btn btn-outline-warning m-2">{{ loading ? "Actualizando..." : "Actualizar" }}</button>
                            <button type="button" class="btn btn-outline-secondary m-2" @click="cancelEdit">Cancelar</button>
                        </div>
                    </form>
                </div>
                <div class="w-50 p-4">
                    <div v-if="enrollment" class="m-2">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">Datos del alumno</h5>
                            </div>
                            <img :src="enrollment.user.photo" class="card-img-top" alt="student image">
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item">Nombre: {{ this.enrollment.user.names }}</li>
                                <li class="list-group-item">Apellidos: {{ this.enrollment.user.last_names }}</li>
                                <li class="list-group-item">Correo: {{ this.enrollment.user.email }}</li>
                            </ul>
                        </div>                        
                    </div>
                    <div v-if="enrollment" class="m-2">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">Datos del curso</h5>
                            </div>
                            <img :src="enrollment.course.image" class="card-img-top" alt="course image">
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item">Nombre: {{ this.enrollment.course.name_long }}</li>
                                <li class="list-group-item">Descripción: {{ this.enrollment.course.description }}</li>
                                <li class="list-group-item">Precio: {{ this.enrollment.course.price }}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-center">
                <button type="button" id="button-cancel" class="btn btn-warning m-2" @click="goBack">Volver</button>
            </div>
        </div>
    </div>
</template>
<script>
import PaymentService from '@/services/PaymentsService';
import EnrollmentService from '@/services/EnrollmentsService';
import Preloader from '../../components/Preloader.vue';

export default{
    data(){
        return{
            name:'Detalles del pago',
            idpayment:this.$route.params.idpago,
            cargando:false,
            payment:null,
            enrollment:null,
            isEditing:false,
            isViewing:false,
            loading:false,
        }
    },
    created(){
        this.getPaymentDetails();
    },
    components:{
        Preloader
    },
    methods:{
        async getPaymentDetails(){
            try{
                this.cargando=true;
                const response=await PaymentService.getPaymentDetails(this.idpayment);
                this.payment=response.data.data;
                this.getEnrollment();
            }catch(error){
                console.log(error);
            }finally{
                this.cargando=false;
            }
        },
        async getEnrollment(){
            try{
                this.cargando=true;
                const response=await EnrollmentService.getEnrollmentDetails(this.payment.enrollment_id);
                this.enrollment=response.data.data;

            }catch(error){
                console.log(error);
            }finally{
                this.cargando=false;
            }
        },
        editPayment(){
            this.isEditing = true;
            this.isViewing = false;
            this.$router.push({ name: 'PagoDetallesEditar', params: { idpago: this.idpayment } });
        },
        cancelEdit(){
            this.isEditing = false;
            this.isViewing = true;
            this.$router.push({ name: 'PagoDetallesVer', params: { idpago: this.idpayment } });
        },
        goBack(){
            this.$router.push({ name: 'Pagos'});
        },
        async deletePayment(){
            const confirmed = confirm('¿Estás seguro de que deseas eliminar este pago?');
            if (confirmed) {
                try {
                    await PaymentService.deletePayment(this.idpayment);
                    this.$router.push({ name: 'Pagos' });
                } catch (error) {
                    alert('Hubo un error al intentar eliminar el pago.');
                }
            }   
        },
        async updatePayment(){
            try{
                this.cargando=true;
                this.loading=true;
                await PaymentService.patchPayment(this.payment.id, this.payment);
                this.$router.replace({ name: 'PagoDetallesVer', params:{idpago: this.idpayment} });
                this.isEditing=false;
                this.isViewing=true;
            }catch(error){
                console.log(error);
            }finally{
                this.loading=false;
                this.cargando=false;
            }
        },
    }
}
</script>
