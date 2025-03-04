<template>
    <div class="container">
        <div class="card p-4">
            <div class="head">
                <h1 class="card-title fs-4">{{ name }}</h1>
                <div class="card-body col-8 mx-auto">
                    <form @submit.prevent="createAdministrator" >
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
import UserService from '@/services/UsersService.js'

export default{
    data(){
        return{
            name:'Nuevo Administrador',
            user:{
                names: '',              
                last_names: '',                         
                email: '',             
                password: '',               
                role: 'admin',              
                status: 'active',    
            },
            loading:false,
            idadmin:this.$route.params.idadministrador
        };
    },

    methods:{
        goBack(){
            this.$router.push({name:'Administradores'});
        },
        async createAdministrator(){
            try{
                this.loading=true;
                await UserService.postUser(this.user);
                this.$router.push({name: 'AdministradorDetallesVer',params: { idadministrador: this.idadmin },});
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