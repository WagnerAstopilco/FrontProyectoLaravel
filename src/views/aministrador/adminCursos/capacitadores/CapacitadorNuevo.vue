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
                            <input type="text" class="form-control p-2" id="last_names" placeholder="Apellidos" required/>
                        </div>
                        <div class="form-group d-flex flex-column">
                            <label for="email">Correo</label>
                            <input type="email" class="form-control p-2" id="email" placeholder="Correo" required/>
                        </div>
                        <div class="form-group d-flex flex-column">
                            <label for="password">Contraseña</label>
                            <input type="text" class="form-control p-2" id="password" placeholder="Contraseña" required/>
                        </div>
                        <div class="form-group">
                        <label for="confirmPassword">Confirmar Contraseña</label>
                            <input type="text" id="confirmPassword" class="form-control" v-model="confirmPassword" placeholder="Confirma tu contraseña" required/>
                        </div>
                        <div class="form-group d-flex flex-column">
                            <label for="certifications">Certificaciones</label>
                            <textarea id="certifications" class="form-control p-2" placeholder=""></textarea>

                        </div>
                        <div class="d-flex justify-content-center">
                            <button type="submit" class="btn btn-info m-2">{{ loading ? "Agregando..." : "Agregar" }}</button>
                            <button type="button" class="btn btn-primary m-2" @click="goBack">Volver</button>
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
            name:'Detalles del Capacitador',
            password: '',
            confirmPassword: '',
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
    computed: {
        passwordMismatch() {
        return this.password !== this.confirmPassword || this.confirmPassword === '';
    },
    },
    methods:{
        goBack(){
            this.$router.push({name:'Capacitadores'});
        },
        async createUserTrainer(){
            if (!this.passwordMismatch) {
                alert("Las contraseñas no coinciden. Por favor, verifícalas.");
                return;
            }
            this.user.password = this.password;
            try{
                this.loading=true;
                const response = await UserService.postUser(this.user);
                console.log("respuesta user",response);
                const userId = response.data.data.id;
                this.trainer.user_id=userId;
                const response1 = await TrainerService.postTrainer(this.trainer);
                console.log("respuesta trainer",response1);
                const trainerId = response1.data.data.id;
                this.$router.push({name: 'CapacitadorDetallesEditar',params: { idcapacitador: trainerId },});
            }catch(error){
                console.log(error);
            }finally{
                this.loading=false;
            }
        }
    },
};
</script>