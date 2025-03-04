<template>
    <div class="container">
        <div class="card p-4">
            <div class="head d-flex">
                <h1 class="fs-4">{{name}}</h1>
                <Preloader :visible="cargando"></Preloader>
                <div class="ms-auto">
                    <button type="button" class="btn btn-info" @click="newCertificate">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                        </svg>
                        Nuevo</button>            
                </div>
            </div>

            <table id="certificatesTable" class="table table-striped">
                <thead>
                    <tr>
                        <th>Fecha de emisión</th>
                        <th>Alumno</th>
                        <th>Curso</th>

                    </tr>
                </thead>
                <tbody >
                    <tr v-for="certificate in certificates" :key="certificate.id" @click="certificateDetail(certificate.id)" style="cursor:pointer"> 
                        <td >{{ certificate.issue_date }}</td>
                        <td>{{ certificate.user.names }} {{ certificate.user.last_names }}</td>
                        <td>{{ certificate.course.name_long }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import Preloader from '../../components/Preloader.vue';
import CertificateService from '@/services/CertificatesService.js'
import $ from 'jquery';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-bs4';

export default{
    data(){
        return{
            name:'Certificados',
            certificates:[],
            cargando:false,
        }
    },
    created(){
        this.getCertificates();
    },
    beforeUnmount() {
        if ($.fn.dataTable.isDataTable('#certificatesTable')) {
            $('#certificatesTable').DataTable().destroy();
        }
    },
    components:{
        Preloader
    },
    methods:{
        async getCertificates(){
            try{
                this.cargando=true;
                const response= await CertificateService.getCertificates();
                this.certificates=response.data.data;
                this.$nextTick(() => {
                    $('#certificatesTable').DataTable();
                });
            }catch(error){
                console.log(error);
            }finally{
                this.cargando=false;
            }
        },
        newCertificate(){
            this.$router.push({name: 'CertificadoNuevo'});
        },
        certificateDetail(id){
            this.$router.push({name:'CertificadoDetallesVer',params:{idcertificado:id}})
        }
    },
}
</script>

