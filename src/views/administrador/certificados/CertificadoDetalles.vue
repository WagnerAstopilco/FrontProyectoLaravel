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
                        <div v-if="certificate">
                        <li><a class="dropdown-item" @click="editCertificate()">Editar</a></li>
                        <li><a class="dropdown-item" @click="deleteCertificate">Eliminar</a></li>
                        </div>
                    </ul>
                </div>   
            </div>

            <div class="d-flex gap-3" v-if="certificate">
                <div class="w-50">
                    <h3 class="fs-5">Alumno</h3>
                    <div class="form-group">
                        <label for="name">Nombre</label>
                        <input type="text" class="form-control w-80" id="name" v-model="certificate.user.names" readonly>
                    </div>
                    <div class="form-group">
                        <label for="last_name">Apellidos</label>
                        <input type="text" class="form-control w-80" id="last_name" v-model="certificate.user.last_names" readonly>
                    </div>
                    <div class="form-group">
                        <label for="email">Correo</label>
                        <input type="text" class="form-control w-80" id="email" v-model="certificate.user.email" readonly>
                    </div>
                </div>
                <div class="w-50">
                    <h3 class="fs-5">Curso</h3>
                    <div class="form-group">
                        <label for="name_long">Nombre</label>
                        <input type="text" class="form-control w-80" id="name_long" v-model="certificate.course.name_long" readonly>
                    </div>
                    <div class="form-group">
                        <label for="price">Precio</label>
                        <input type="text" class="form-control w-80" id="price" v-model="certificate.course.price" readonly>
                    </div>
                    <div class="form-group">
                        <label for="description">Descripción</label>
                        <input type="text" class="form-control w-80" id="description" v-model="certificate.course.description" readonly>
                    </div>
                </div>
            </div>
            <form  @submit.prevent="updateCertificate()">
                <legend>Detalles del certificado</legend>
                <fieldset class="d-flex flex-column justify-content-center align-items-center">
                    <div class="form-group w-80">
                        <label for="start_date">Fecha de inicio</label>
                        <input type="date" id="start_date" class="form-control" v-model="certificate.start_date" :readonly="isViewing">
                    </div>
                    <div class="form-group w-80">
                        <label for="end_date">Fecha de fin</label>
                        <input type="date" id="end_date" class="form-control" v-model="certificate.end_date" :readonly="isViewing">
                    </div>
                    <div class="form-group w-80">
                        <label for="duration_in_hours">Horas de duración</label>
                        <input type="number" id="duration_in_hours" class="form-control" v-model="certificate.duration_in_hours" :readonly="isViewing">
                    </div>
                    <div class="form-group w-80">
                        <label for="issue_date">Fecha de emisión</label>
                        <input type="date" id="issue_date" class="form-control" v-model="certificate.issue_date" :readonly="isViewing">
                    </div>
                    <div class="form-group w-80">
                        <label for="code">Código</label>
                        <input type="text" id="code" class="form-control" v-model="certificate.code" :readonly="isViewing">
                    </div>
                </fieldset>    
                <div v-if="isEditing" class="d-flex justify-content-center align-items-center">
                    <button type="submit" class="btn btn-cyan m-2">{{ loading ? "Actualizando..." : "Actualizar" }}</button>
                    <button type="button" class="btn btn-blue m-2" @click="cancelEdit">Cancelar</button>
                </div>
            </form>

            <div class="d-flex justify-content-center">
                <button type="button" id="button-cancel" class="btn btn-blue m-2" @click="goBack">Volver</button>
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
                await CertificateService.patchCertificate(this.certificate.id, this.certificate);
                this.isEditing = false;
                this.isViewing = true;
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
