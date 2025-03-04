<template>
    <div class="container">
        <div class="card p-4">
            <div class="head d-flex">
                <h1 class="fs-4">{{ name }}</h1>
                <Preloader :visible="cargando"></Preloader>
                <div class="dropdown ms-auto">
                    <button class="btn btn-danger dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Opciones
                    </button>
                    <ul class="dropdown-menu">
                        <div v-if="Administrator">
                        <li><a class="dropdown-item" href="#" @click="editAdministrator()">Editar</a></li>
                        <li><a class="dropdown-item" href="#" @click="deleteAdministrator">Eliminar</a></li>
                        </div>
                    </ul>
                </div>            
            </div>
            <div v-if="Administrator" class="m-3">
                    <form @submit.prevent="updateAdministrator" class="w-50">
                        <div class="form-group m-2">
                            <label for="names">Nombres</label>
                            <input type="text" class="form-control" id="names" v-model="Administrator.names" :readonly="!isEditing">
                        </div>
                        <div class="form-group m-2">
                            <label for="last_names">Apellidos</label>
                            <input type="text" class="form-control" id="last_names" v-model="Administrator.last_names" :readonly="!isEditing">
                        </div>
                        <div class="form-group m-2">
                            <label for="email">Correo</label>
                            <input type="email" class="form-control" id="email" v-model="Administrator.email" :readonly="!isEditing">
                        </div>

                        <div class="form-group m-2">
                            <label for="phone_number">Celular</label>
                            <input type="text" class="form-control" id="phone_number" v-model="Administrator.phone_number" :readonly="!isEditing">
                        </div>
                        <div class="form-group m-2">
                            <label for="birthday_date">Inicio de matrícula</label>
                            <input type="date" id="birthday_date" class="form-control" v-model="Administrator.birthday_date" :readonly="!isEditing">
                        </div>
                        <div class="form-group m-2">
                            <label for="country">País</label>
                            <input type="text" class="form-control" id="country" v-model="Administrator.country" :readonly="!isEditing">
                        </div>
                        <div class="form-group m-2">
                            <label for="city">Ciudad</label>
                            <input type="text" class="form-control" id="city" v-model="Administrator.city" :readonly="!isEditing">
                        </div>
                        <div class="form-group m-2">
                            <label for="address">Dirección</label>
                            <input type="text" class="form-control" id="address" v-model="Administrator.address" :readonly="!isEditing">
                        </div>
                        <div class="form-group m-2">
                            <label for="document_type">Tipo de Documento</label>
                            <input type="text" class="form-control" id="document_type" v-model="Administrator.document_type" :readonly="!isEditing">
                        </div>
                        <div class="form-group m-2">
                            <label for="document_number">Número de Documento</label>
                            <input type="text" class="form-control" id="document_number" v-model="Administrator.document_number" :readonly="!isEditing">
                        </div>
                        <div class="form-group m-2">
                            <label for="gender">Género</label>
                            <input type="text" class="form-control" id="gender" v-model="Administrator.gender" :readonly="!isEditing">
                        </div>
                        <div class="form-group m-2">
                            <label for="speciality">Especialidad</label>
                            <input type="text" class="form-control" id="speciality" v-model="Administrator.speciality" :readonly="!isEditing">
                        </div>
                        <div class="form-group m-2">
                            <label for="biography">Biografía</label>
                            <input type="text" class="form-control" id="biography" v-model="Administrator.biography" :readonly="!isEditing">
                        </div>

                    <div v-if="isEditing ">
                        <button type="submit" class="btn btn-outline-warning m-2">{{ loading ? "Actualizando..." : "Actualizar" }}</button>
                        <button type="button" class="btn btn-outline-secondary m-2" @click="cancelEdit">Cancelar</button>
                    </div>
                    </form>
            </div>
            
            <div class="d-flex justify-content-center">
                <button type="button" class="btn btn-primary" @click="goBack">Volver</button>
            </div>
        </div>
    </div>
</template>
<script>
import UserService from '@/services/UsersService.js';
import Preloader from '../../components/Preloader.vue';

export default{
    data(){
        return{
            name:'Detalles del Administrador',
            Administrator: null,
            cargando:false,
            idadmin: this.$route.params.idadministrador,
            loading:'',
            isViewing: false,
            isEditing: false,
        };
    },
    created(){
        this.getAdministratorDetails();
    },  
    components:{
        Preloader
    },
    methods:{        
        async getAdministratorDetails(){
            try{
                this.cargando=true;
                const response=await UserService.getUserDetails(this.idadmin);
                this.Administrator=response.data.data;
                console.log("admin",this.Administrator);
            }catch(error){
                console.log(error);
            }finally{
                this.cargando=false;
            }
        },        
        async deleteAdministrator(){
            this.Administrator.role='comercial';
            await UserService.patchUser(this.idadmin,this.Administrator);
            this.$router.push({name:'Administradores'});
        },
        async updateAdministrator(){
            try{
                this.loading=true;
                this.cargando=true;
                await UserService.patchUser(this.idadmin,this.Administrator);
                this.$router.replace({name:'AdministradorDetallesVer',params:{idadministrador:this.idadmin}})
            }catch(error){
                console.log(error);
            }finally{
                this.loading=false;
                this.cargando=false;
                this.isEditing = false;
            }
        },
        goBack(){
            this.$router.push({name: 'Administradores'});
        },

        showFormCourseMaterial() {
            this.showSearchBar = !this.showSearchBar; 
        },
        cancelEdit(){
            this.isEditing = false;
            this.$router.push({ name: 'AdministradorDetallesVer', params: { idadministrador: this.idadmin } });
        },
        getImagenUrl(image) {
            if (image) {
                return process.env.VUE_APP_API_URL + "/storage/" + image; 
            }
        },
        editAdministrator(){
            this.isEditing = true;
            this.$router.push({ name: 'AdministradorDetallesEditar', params: { idadministrador: this.idadmin } });
        },
        
    }
}
</script>
<style scoped>
</style>