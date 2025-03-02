<template>
    <div class="container">
        <div class="card p-4">
            <div class="head d-flex">
                <h1 class="fs-4">{{ name }}</h1>
                <Preloader :visible="cargando"> </Preloader>          
                <div class="ms-auto">
                    <button type="button" class="btn btn-info m-1" @click="newTrainer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-plus-fill" viewBox="0 0 16 16">
                            <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                            <path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5"/>
                        </svg>
                        Nuevo
                    </button>            
                    <button type="button" class="btn btn-info m-1" @click="showFormTrainerPromove">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill-up" viewBox="0 0 16 16">
                        <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.354-5.854 1.5 1.5a.5.5 0 0 1-.708.708L13 11.707V14.5a.5.5 0 0 1-1 0v-2.793l-.646.647a.5.5 0 0 1-.708-.708l1.5-1.5a.5.5 0 0 1 .708 0M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                        <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"/>
                        </svg>
                        Promover
                    </button>
                </div>            
            </div>
            <div class="w-60">
                <form class="" v-if="showSearchBar" @submit.prevent="trainerPromotion(selectedUser?.id)">
                    <div class="form-group  d-flex flex-column ">
                        <div class="search-bar m-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                            </svg>
                            <input v-model="searchQuery" type="text" class=" search-bar-input" placeholder="Buscar usuarios..." @click="filterUsers" @input="filterUsers" @focus="inputFocus = true" @blur="handleBlur"/>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16" @click="reset">
                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                            </svg>
                        </div>
                        <div class="user-container m-2"  v-if="inputFocus && (filteredUsers.length >= 0 || searchQuery)" >
                            <ul class="usersList">
                                <li v-for="user in filteredUsers" :key="user.id" 
                                @click="addUserToInput(user)">
                                {{ user.names }}
                                </li>
                                <li v-if="searchQuery && filteredUsers.length ===0||filteredUsers.length ===0">Sin resultados.</li>
                            </ul>
                        </div> 
                        <div class="form-group d-flex flex-column m-2">
                            <label for="certifications">Certificaciones</label>
                            <textarea id="certifications" class="form-control p-2" v-model="trainer.certifications" placeholder="" required></textarea>

                        </div>
                    </div>
                    <div class=" mb-4">
                        <button type="submit" class="btn btn-info m-2">{{ loading ? "Agregando..." : "Agregar" }}</button>
                        <button type="button" id="button-cancel" class="btn btn-warring m-2" @click="showFormTrainerPromove">Cancelar</button>
                    </div>
                </form>
            </div>    
            <table id="trainersTable" class="table table-striped">
                <thead>
                    <tr>
                        <th>Foto</th>
                        <th>Nombre</th>
                        <th>Apellidos</th>
                        <th>Correo</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody >
                    <tr v-for="trainer in trainers" :key="trainer.id" style="cursor:pointer"> 

                        <td @click="trainerDetail(trainer.id)">{{ trainer.user.photo}}</td>
                        <td @click="trainerDetail(trainer.id)">{{ trainer.user.names}}</td>
                        <td @click="trainerDetail(trainer.id)">{{ trainer.user.last_names}}</td>
                        <td @click="trainerDetail(trainer.id)">{{ trainer.user.email}}</td>
                        <td >
                            <button type="button" :class="trainer.user.status === 'active' ? 'btn btn-success' : 'btn btn-danger'" @click="changeStatus(trainer.user_id)">
                                <svg v-if="trainer.user.status === 'active'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                    <path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0zM7.646 10.854a.5.5 0 0 1-.708 0L4 7.707 5.207 6.5l2.439 2.438 4.708-4.707 1.414 1.414-5.854 5.854z"/>
                                </svg>
                                <svg v-if="trainer.user.status === 'inactive'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                                </svg>
                                {{trainer.user.status}}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div>

            </div>
        </div>
    </div>
</template>

<script>
import TrainerService from '@/services/TrainersService.js';
import UserService from '@/services/UsersService.js';
import Preloader from '../../../components/Preloader.vue';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import $ from 'jquery';
import 'datatables.net-bs4';

export default {
    data() {
        return {
            name:'Capacitadores',
            cargando:false,
            trainer:{
                certifications:'',
                user_id:'',
            },
            user:'',
            trainers:[],
            showSearchBar:false,
            searchQuery: '', 
            users: [], 
            filteredUsers:[],
            loading:"",
            inputFocus:false,
            selectedUser: null,
        };          
    },
    created() {
        this.getTrainers();
        this.getUsers();
    },
    beforeUnmount() {
        if ($.fn.dataTable.isDataTable('#trainersTable')) {
            $('#trainersTable').DataTable().destroy();
        }
    },
    components:{
        Preloader
    },
    methods: {
        async getTrainers(){
            try{
                this.cargando=true;
                const response=await TrainerService.getTrainers();
                this.trainers=response.data.data;
            }catch(error){
                console.log(error);
            }finally{
                this.cargando=false;
                this.$nextTick(() => {
                    $('#trainersTable').DataTable();
                });
            }
        },
        async getUsers(){
            try{
                this.cargando=true;
                const response=await UserService.getUsers();
                this.users = response.data.data.filter(user => user.role !== 'capacitador');
            }catch(error){
                console.log(error);
            }finally{
                this.cargando=false;
            }
        },
        trainerDetail(id) {
            console.log(id);
        this.$router.push({ name: 'CapacitadorDetallesVer', params: { idcapacitador: id } });
        },
        newTrainer(){
            this.$router.push({name:'CapacitadorNuevo'});
        },
        
        //
        showFormTrainerPromove() {
            this.showSearchBar = !this.showSearchBar; 
        },
        filterUsers() {
            if (this.searchQuery) {
                const results = this.users.filter(user => 
                    user.names.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
                this.filteredUsers = results.length > 0 ? results : [];
            } else {
                this.filteredUsers = this.users;
                console.log(this.filteredUsers.length);
            }
        },
        reset(){
            this.filteredUsers=[];
            this.searchQuery="";
        },
        handleBlur() {
            setTimeout(() => {
                this.inputFocus = false;
            }, 200); 
        },
        addUserToInput(user){
            this.selectedUser = user; 
            this.searchQuery = user.names;
        },        
        async trainerPromotion(userId){
            if (!userId) {
            alert("Por favor, selecciona un curso antes de agregar.");
            return;
            }
            const userPromoved = this.trainers.some(trainer => trainer.user_id === userId);
    
            if (userPromoved) {
                alert("Este usuario ya fue promovido.");
                return; 
            }
            try {
                this.loading = true;
                this.trainer.user_id=userId;
                this.selectedUser.role='capacitador'
                await UserService.patchUser(userId,this.selectedUser);
                await TrainerService.postTrainer(this.trainer);
            } catch (error) {
                alert("Hubo un error al promover al usuario");
            } finally {
                this.loading = false;
                this.showSearchBar = false;
            }          
        },
        async deleteTrainer(){
            const confirmed = confirm('¿Estás seguro de que deseas eliminar este capacitador?');
            if (confirmed) {
                try {
                    await TrainerService.deleteTrainer(this.idtrainer); 
                    this.$router.push({name: 'Capacitadores'});
                } catch (error) {
                    alert('Hubo un error al intentar eliminar el capacitador.');
                }
            }   
        },
        async changeStatus(id){
            const response=await UserService.getUserDetails(id);
            this.user=response.data.data;
            if(this.user.status==="active"){
                this.user.status='inactive'
            }
            else{
                this.user.status='active'
            }
            await UserService.patchUser(id,this.user);
            this.getTrainers(); 
        }

    }
};
</script>

<style scoped>
.search-bar{
    display: flex;
    flex-direction: row;
    align-items: center;
    border:3px solid rgb(19, 136, 103);
    border-radius: 10px;
    padding:5px;
}
.search-bar-input {
    background-color: transparent; 
    border: none; 
    outline: none; 
    padding: 8px 12px; 
    font-size: 16px;  
    color: #333;
    width: 100%;
}
.search-bar-input:focus {
    outline: none; 
}


.form-group {
    flex: 1;
    min-width: 250px;
    position: relative;
}

.search-bar {
    display: flex;
    align-items: center;
    border: 3px solid rgb(19, 136, 103);
    border-radius: 10px;
    padding: 5px;
    width: 100%;
}

.users-container {
    position: absolute;
    top: 100%; 
    left: 0;
    width: 100%;
    background: white;
    border: 1px solid #ccc;
    max-height: 200px; 
}

.usersList {
    list-style: none;
    padding: 0;
    margin: 0;
}

.usersList li {
    padding: 8px;
    cursor: pointer;
}

.usersList li:hover {
    background-color: #f1f1f1;
}
</style>