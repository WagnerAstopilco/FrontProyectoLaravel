<template>
    <div class="container">
        <div class="card p-4">
            <div class="head d-flex">
                <h1 class="fs-4">{{name}}</h1>
                <Preloader :visible="cargando"></Preloader>
                <div class="ms-auto">
                    <button type="button" class="btn btn-info" @click="newPayment">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                        </svg>
                        Nuevo</button>            
                </div>
            </div>
            <div class="table-responsive mt-3">

                <table id="paymentsTable" class="table table-striped">
                    <thead>
                        <tr>
                            <th>Fecha de pago</th>
                            <th>Código de TRX</th>
                            <th>Tipo</th>
                            <th>Monto</th>
                            <th>Estudiante</th>
                            <th>Curso</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody >
                        <tr v-for="pay in this.payments" :key="pay.id" @click="payDetail(pay.id)" style="cursor:pointer"> 
                            <td >{{ pay.payment_date }}</td>
                            <td >{{ pay.transaction_code }}</td>
                            <td >{{ pay.type }}</td>
                            <td >{{ pay.amount }}</td>
                            <td >{{ pay.enrrolement_id }}</td>
                            <td >{{ pay.enrrolement_id }}</td>
                            <td >{{ pay.status }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
import Preloader from '../../components/Preloader.vue';
import PaymentService from '@/services/PaymentsService.js';
import $ from 'jquery';
import 'datatables.net-bs4';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';

export default{
    data(){
        return{
            name:'Pagos',
            payments:[],
            cargando:false,
        }
    },
    created(){
        this.getPayments();
    },
    beforeUnmount() {
        if ($.fn.dataTable.isDataTable('#paymentsTable')) {
            $('#paymentsTable').DataTable().destroy();
        }
    },
    components:{
        Preloader
    },
    methods:{
        async getPayments(){
            try{
                this.cargando=true;
                const response= await PaymentService.getPayments();
                this.payments=response.data.data;
                this.$nextTick(() => {
                    if (!$.fn.dataTable.isDataTable('#paymentsTable')) {
                        $('#paymentsTable').DataTable();
                    }
                });
            }catch(error){
                console.log(error);
            }finally{
                this.cargando=false;
            }
        },
        newPayment(){
            this.$router.push({name: 'PagoNuevo'});
        },
        payDetail(id){
            this.$router.push({name:'PagoDetallesVer',params:{idpago:id}})
            console.log("idenviado",id)
        }
    },
}
</script>

