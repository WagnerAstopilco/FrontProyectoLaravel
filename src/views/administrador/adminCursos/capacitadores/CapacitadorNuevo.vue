<template>
    <div class="container">
        <div class="card p-4">
            <div class="head">
                <h1 class="card-title fs-4">{{ name }}</h1>
                <div class="card-body col-8 mx-auto">
                    <form @submit.prevent="createUserTrainer" >
                        <div class="form-group d-flex flex-column">
                            <label for="names">Nombres</label>
                            <input type="text" class="form-control p-2" id="names" v-model="user.names" placeholder="Nombres" required/>
                        </div>
                        <div class="form-group d-flex flex-column">
                            <label for="last_names">Apellidos</label>
                            <input type="text" class="form-control p-2" id="last_names" v-model="user.last_names" placeholder="Apellidos" required/>
                        </div>
                        <div class="form-group d-flex flex-column">
                            <label for="email">Correo</label>
                            <input type="email" class="form-control p-2" id="email" v-model="user.email" placeholder="Correo" required/>
                        </div>
                        <div class="form-group d-flex flex-column">
                            <label for="password">Contraseña</label>
                            <input type="password" class="form-control p-2" id="password" v-model="user.password" placeholder="Contraseña" required/>
                        </div>
                        <div class="form-group d-flex flex-column">
                            <label for="certifications">Certificaciones</label>
                            <textarea id="certifications" class="form-control p-2" v-model="trainer.certifications" placeholder=""></textarea>

                        </div>
                        <div class="d-flex justify-content-center">
                            <button type="submit" class="btn btn-info m-2" style="background-color:rgb(88,176,49);color:white;">{{ loading ? "Agregando..." : "Agregar" }}</button>
                            <button type="button" class="btn btn-primary m-2" style="background-color:rgb(0,87,163);color:white;" @click="goBack">Volver</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import TrainerService from '@/services/TrainersService.js'
import UserService from '@/services/UsersService.js'

export default{
    data(){
        return{
            name:'Nuevo Capacitador',
            user:{
                names: '',              
                last_names: '',                         
                email: '',             
                password: '',               
                role: 'capacitador',              
                status: 'active',    
            },
            trainer:{
                certifications:'',
                user_id:'',
            },
            loading:false,
        };
    },

    methods:{
        goBack(){
            this.$router.push({name:'Capacitadores'});
        },
        async createUserTrainer(){
            try{
                this.loading=true;
                const response = await UserService.postUser(this.user);
                const userId = response.data.data.id;
                this.trainer.user_id=userId;
                const response1 = await TrainerService.postTrainer(this.trainer);
                const trainerId = response1.data.data.id;
                this.$router.push({name: 'CapacitadorDetallesVer',params: { idcapacitador: trainerId },});
            }catch(error){
                console.error('Error response:', error.response);
                if (error.response && error.response.data) {
                    console.log('Detalles del error:', error.response.data);
                }
            }finally{
                this.loading=false;
            }
        },        
    },
};
</script>