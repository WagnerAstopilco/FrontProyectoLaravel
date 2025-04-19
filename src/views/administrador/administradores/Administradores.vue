<template>
    <div class="container">
        <div class="card p-4">
            <Preloader :visible="cargando"> </Preloader>          
            <div class="d-flex flex-column flex-md-row align-items-center pb-0 ">
                <h1 class="fs-4">{{ name }}</h1>
                <div class="d-flex w-100 justify-content-center justify-content-md-end gap-2 m-md-3 m-1">
                    <button type="button" class="btn btn-green" @click="goToNewAdmin">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-plus-fill" viewBox="0 0 16 16">
                            <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                            <path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5"/>
                        </svg>
                        Nuevo
                    </button>            
                    <button type="button" class="btn btn-blue" @click="showSearchUsers=!showSearchUsers">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill-up" viewBox="0 0 16 16">
                        <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.354-5.854 1.5 1.5a.5.5 0 0 1-.708.708L13 11.707V14.5a.5.5 0 0 1-1 0v-2.793l-.646.647a.5.5 0 0 1-.708-.708l1.5-1.5a.5.5 0 0 1 .708 0M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                        <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"/>
                        </svg>
                        Promover
                    </button>
                </div>            
            </div>
            <div class="">
                <div v-show="showSearchUsers">
                    <form  class="w-100 d-flex flex-column flex-md-row gap-3" @submit.prevent="userPromotion" >
                        <fieldset class="w-lg-50 w-md-60 w-100">
                            <Multiselect                                 
                                v-model="selectedUsers" 
                                :options="availableUsers" 
                                :multiple="true"
                                :searchable="true" 
                                :showLabels="false"
                                openDirection="bottom"
                                placeholder="Seleccionar usuarios"
                                label="names"
                                selectLabel="Presiona enter para seleccionar"
                                selectedLabel="Seleccionado"
                                deselectLabel="Presiona enter para quitar"
                                track-by="id" >
                                <template #noOptions>
                                    <span class="text-gray-500">No hay usuarios disponibles</span>
                                </template>
                                <template #noResult>
                                    <span class="text-gray-500"> No se encontraron coincidencias. </span>
                                </template>
                            </Multiselect>
                        </fieldset>
                        <div class="d-flex justify-content-center gap-3">
                            <button type="submit" class="btn btn-cyan" >{{this.loadingPromotion?'Promoviendo...':'Promover'}}</button>
                            <button type="button" class="btn btn-black" @click="showSearchUsers=false">Cancelar</button>
                        </div>
                    </form>
                </div>
                <div class="table-responsive">
                    <table id="administratorsTable" class="table table-striped">
                        <thead>
                            <tr>
                                <th class="text-center d-none d-md-table-cell">Foto</th>
                                <th class="text-center">Nombre</th>
                                <th class="text-center">Apellidos</th>
                                <th class="text-center d-none d-md-table-cell">Correo</th>
                                <th class="text-center">Estado</th>
                            </tr>
                        </thead>
                        <tbody >
                            <tr v-for="administrator in administrators" :key="administrator.id" style="cursor:pointer"> 
                                <td class="d-none d-md-table-cell"><img :src="getImagenUrl(administrator.photo)" class="card-img img-fluid" style="max-width: 80px; max-height: 120px;" alt="Foto perfil" @click="goToAdminDetail(administrator.id)"></td>
                                <td @click="goToAdminDetail(administrator.id)">{{ administrator.names}}</td>
                                <td @click="goToAdminDetail(administrator.id)">{{ administrator.last_names}}</td>
                                <td @click="goToAdminDetail(administrator.id)" class="d-none d-md-table-cell">{{ administrator.email}}</td>
                                <td>
                                    <button type="button" :class="administrator.status === 'activo' ? 'btn btn-success' : 'btn btn-danger'" @click="changeStatus(administrator.id)">
                                        <svg v-if="administrator.status === 'activo'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                            <path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0zM7.646 10.854a.5.5 0 0 1-.708 0L4 7.707 5.207 6.5l2.439 2.438 4.708-4.707 1.414 1.414-5.854 5.854z"/>
                                        </svg>
                                        <svg v-if="administrator.status === 'inactivo'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                                        </svg>
                                        {{administrator.status}}
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>  
        </div>
    </div>
</template>

<script>
import UserService from '@/services/UsersService.js';
import TrainerService from '@/services/TrainersService.js';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import $ from 'jquery';
import 'datatables.net-bs4';
import Preloader from '../../components/Preloader.vue';
import Multiselect from 'vue-multiselect';

export default {
    data() {
        return {
            name:'Administradores',
            admin:'',
            cargando:false,
            administrators:[],
            loading:false,
            loadingPromotion:false,
            
            showSearchUsers: false,
            selectedUsers:[],
            availableUsers:[],
        };          
    },
    created() {
        this.getAdministrators();
    },
    beforeUnmount() {
        if ($.fn.dataTable.isDataTable('#administratorsTable')) {
            $('#administratorsTable').DataTable().destroy();
        }
    },
    components:{
        Preloader,
        Multiselect
    },
    methods: {
        async getAdministrators(){
            try{
                this.cargando=true;
                const response=await UserService.getUsers();
                this.administrators=response.data.data.filter(user=>user.role==='admin');
                this.getAvailableUsers();
                this.$nextTick(() => {
                    $('#administratorsTable').DataTable();
                });
            }catch(error){
                console.log(error);
            }finally{
                this.cargando=false;
            }
        },
        async getAvailableUsers(){
            const response=await UserService.getUsers();
            this.availableUsers = response.data.data.filter(user => user.role !== 'admin');
        },
        goToNewAdmin(){
            this.$router.push({name:'AdministradorNuevo'});
        },
        goToAdminDetail(id) {
            this.$router.push({ name: 'AdministradorDetallesVer', params: { idadministrador: id } });
        },
        async userPromotion() {
            if (this.selectedUsers.length === 0) {
                alert("Debe seleccionar al menos un usuario.");
                return;
            }
            this.loadingPromotion = true;
            try {
                for(const user of this.selectedUsers){
                    if(user.role==='capacitador'){
                        await TrainerService.deleteTrainer(user.trainer.id);
                    }
                }
                const updatePromises = this.selectedUsers.map(user => {
                    const formData = new FormData();
                    formData.append('role', 'admin');
                    return UserService.patchUser(user.id, formData);
                });
                await Promise.all(updatePromises);
                this.selectedUsers = [];
                this.showSearchUsers=false;
                this.getAdministrators();
                
            } catch (error) {
                console.error("Error:", error);
            } finally {
                this.loadingPromotion = false;
            }
        },
        async changeStatus(id){
            const response= await UserService.getUserDetails(id);
            this.admin=response.data.data;
            if(this.admin.status==="activo"){
                this.admin.status='inactivo'
            }
            else{
                this.admin.status='activo'
            }
            const formDataAdmin = new FormData();
            formDataAdmin.append("status", this.admin.status);
            try{
                this.cargando=true
                await UserService.patchUser(this.admin.id,formDataAdmin);
                this.getAdministrators();
            }catch(err){
                console.log(err);
            }
        },
        getImagenUrl(photo) {
            if (photo) {
                return process.env.VUE_APP_API_URL + "/storage/" + photo; 
            }
        },
    }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>