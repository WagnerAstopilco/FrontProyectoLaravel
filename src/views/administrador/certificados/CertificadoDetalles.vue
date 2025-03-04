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
                        <div v-if="certificate">
                        <li><a class="dropdown-item" @click="editCertificate()">Editar</a></li>
                        <li><a class="dropdown-item" @click="deleteCertificate">Eliminar</a></li>
                        </div>
                    </ul>
                </div>   
            </div>
            <form class="courses-form col-12 mx-auto p-4"  @submit.prevent="updateCertificate">
                    <div class="d-flex">
                        <div class="col-6 m-2" v-if="certificate">
                            <div class=" w-50">
                                <label for="startDate">Fecha de emisíon</label>
                                <input type="date" id="startDate" class="form-control" v-model="certificate.issue_date" :readonly="!isEditing">
                            </div>
                            <div class=" w-50">
                                <label for="code">Código</label>
                                <input type="text" id="code" class="form-control" v-model="certificate.code" :readonly="!isEditing">
                            </div>
                            <div>
                                <h3 class="fs-5">Alumno matriculado</h3>
                            </div>
                            <div>
                                <div>
                                    <div class="form-group">
                                        <label for="name">Nombre</label>
                                        <input type="text" class="form-control w-50" id="name" v-model="certificate.user.names" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label for="last_name">Apellidos</label>
                                        <input type="text" class="form-control w-50" id="last_name" v-model="certificate.user.last_names" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label for="email">Correo</label>
                                        <input type="text" class="form-control w-50" id="email" v-model="certificate.user.email" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label for="email">Correo</label>
                                        <input type="text" class="form-control w-50" id="email" v-model="certificate.user.role" readonly>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-6 m-2" v-if="certificate">
                            <div>
                                <h3 class="fs-5">Curso</h3>
                            </div>
                            <div>
                                <div class="">
                                    <div class="form-group">
                                        <label for="name_long">Nombre</label>
                                        <input type="text" class="form-control w-50" id="name_long" v-model="certificate.course.name_long" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label for="price">Precio</label>
                                        <input type="text" class="form-control w-50" id="price" v-model="certificate.course.price" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label for="description">Descripción</label>
                                        <input type="text" class="form-control w-50" id="description" v-model="certificate.course.description" readonly>
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

                <div class="d-flex justify-content-center">
                    <button type="button" id="button-cancel" class="btn btn-warning m-2" @click="goBack">Volver</button>
                </div>
        </div>
    </div>
</template>
<script>
import CertificateService from '@/services/CertificatesService.js';
import Preloader from '../../components/Preloader.vue';
export default{
    data(){
        return{
            name:'Detalles del certificado',
            idcertificate:this.$route.params.idcertificado,
            cargando:false,
            certificate:'',
            isEditing:'',
            isViewing:'',
            loading:false,
        }
    },
    created(){
        this.getCertificateDetails();  
    },

    components:{
        Preloader
    },
    methods:{
        async getCertificateDetails(){
            try{
                this.cargando=true;
                const response = await CertificateService.getCertificateDetails(this.idcertificate);
                this.certificate=response.data.data;
            }catch(error){
                console.log(error);
            }finally{
                this.cargando=false;
            }
        },
        editCertificate(){
            this.isEditing = true;
            this.isViewing = false;
            this.$router.push({ name: 'CertificadoDetallesEditar', params: { idcertificado: this.idcertificate } });
        },
        async updateCertificate(){
            try
            {
                this.loading = true;
                this.cargando=true;
                await CertificateService.patchEnrollment(this.idcertificate, this.certificate);
                this.isEditing = false;
                this.$router.replace({ name: 'CertificadoDetallesEditar', params: { idcertificado: this.idcertificate }});
            }catch(error){
                console.log(error);
            }     
            finally{
                this.loading=false;
                this.cargando=false;
            }
        },
        async deleteCertificate(){
            const confirmed = confirm('¿Estás seguro de que deseas eliminar este certificado?');
            if (confirmed) {
                try {
                    await CertificateService.deleteCertificate(this.idcertificate);
                    this.$router.push({ name: 'Certificados' });
                } catch (error) {
                    alert('Hubo un error al intentar eliminar certificado.');
                }
            }   
        },
        cancelEdit(){
            this.isEditing = false;
            this.isViewing = true;
            this.$router.push({ name: 'CertificadoDetallesEditar', params: { idcertificado: this.idcertificate }});
        },
        goBack(){
            this.$router.push({name:'Certificados'});
        }
    }
}
</script>
