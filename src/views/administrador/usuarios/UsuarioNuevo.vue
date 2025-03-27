<template>
    <div class="container">
        <div class="card p-4">
            <div>
                <h1 class="fs-4">{{ name }}</h1>                
            </div>
            <div class="card-body w-lg-80 w-md-90 w-100 mx-auto">
                <form @submit.prevent="createAdministrator" >
                    <div class="form-group">
                        <label for="names">Nombres</label>
                        <input type="text" class="form-control" id="names" v-model="user.names" placeholder="Nombres"/>
                    </div>
                    <div class="form-group">
                        <label for="last_names">Apellidos</label>
                        <input type="text" class="form-control" id="last_names" v-model="user.last_names" placeholder="Apellidos"/>
                    </div>
                    <div class="form-group">
                        <label for="email">Correo</label>
                        <input type="email" class="form-control" id="email" v-model="user.email" placeholder="Correo"/>
                    </div>
                    <div class="form-group">
                        <label for="password">Contraseña</label>
                        <input type="password" class="form-control" id="password" v-model="password" placeholder="Contraseña"/>
                    </div>
                    <div class="form-group">
                        <label for="password">Confirmar Contraseña</label>
                        <input type="password" class="form-control" id="confirm_password" v-model="password_confirm" placeholder="Confirmar contraseña"/>
                        <small v-show="passwordMismatch" class="text-danger p-1" >Las contraseñas no coinciden</small>
                    </div>
                    <div class="form-group">
                        <label for="phone_number">Teléfono</label>
                        <input type="text" class="form-control" id="phone_number" v-model="user.phone_number" placeholder="Teléfono"/>
                    </div>
                    <div class="d-flex flex-column flex-md-row gap-md-3 w-100">
                        <div class="form-group flex-grow-1">
                            <label for="birthday_date">Fecha de nacimiento</label>
                            <input type="date" class="form-control" id="birthday_date" v-model="user.birthday_date"/>
                        </div>
                        <div class="form-group flex-grow-1">
                            <label for="country">País</label>
                            <input type="text" class="form-control" id="country" v-model="user.country" placeholder="País"/>
                        </div>
                        <div class="form-group flex-grow-1">
                            <label for="city">Ciudad</label>
                            <input type="text" class="form-control" id="city" v-model="user.city" placeholder="Ciudad"/>
                        </div>
                    </div>
                    <div class="d-flex flex-column flex-md-row gap-md-3 w-100">
                        <div class="form-group flex-grow-1">
                            <label for="address_type">Tipo</label>
                            <select name="address_type" class="form-control" v-model="user.address_type">
                                <option value="jiron">Jr.</option>
                                <option value="avenida">Av.</option>
                                <option value="pasaje">Psj.</option>
                                <option value="prolongacion">Prol.</option>
                                <option value="calle">Calle</option>
                            </select>
                        </div>
                        <div class="form-group flex-grow-1">
                            <label for="address">Dirección</label>
                            <input type="text" class="form-control" id="address" v-model="user.address" placeholder="Calle"/>
                        </div>
                        <div class="form-group flex-grow-1">
                            <label for="address_number">N°/Mzn/Lt</label>
                            <input type="text" class="form-control" id="address_number" v-model="user.address_number" placeholder="Número"/>
                        </div>
                    </div>
                    <div class="d-flex flex-column flex-md-row gap-md-3 w-100">
                        <div class="form-group flex-grow-1">
                            <label for="document_type">Tipo</label>
                            <select name="document_type" class="form-control" v-model="user.document_type">
                                <option value="pasaporte">Pasaporte</option>
                                <option value="dni">DNI</option>
                                <option value="cedula">Cédula de identidad</option>
                            </select>
                        </div>
                        <div class="form-group flex-grow-1">
                            <label for="document_number">Número</label>
                            <input type="text" class="form-control" id="document_number" v-model="user.document_number" placeholder="Número de documento"/>
                        </div>
                        <div class="form-group flex-grow-1">
                            <label for="gender">Género</label>
                            <select name="gender" class="form-control" v-model="user.gender">
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="speciality">Especialidad</label>
                        <input type="text" class="form-control" id="speciality" v-model="user.speciality" placeholder="Especialidad"/>
                    </div>
                    <div class="form-group">
                        <label for="biography">Biografía</label>
                        <textarea id="biography" class="form-control" v-model="user.biography" placeholder="Biografía del usuario"></textarea> 
                    </div>
                    <div class="form-group">
                        <label for="image">Fotografía</label>
                        <input type="file" class="form-control" id="image" @change="UserPhotoUpload">
                        <div v-if="photoPreview" class="">
                            <img :src="photoPreview" alt="Vista previa" class="img-fluid mt-2" />
                        </div>
                    </div>
                    <div v-show="error" class="error text-danger mt-2" role="alert">
                        <small>{{ error }}</small>
                    </div>
                    <div class="d-flex justify-content-center gap-3 mt-4">
                        <button type="submit" class="btn btn-green">{{ loading ? "Creando..." : "Crear" }}</button>
                        <button type="button" class="btn btn-blue" @click="goBack">Volver</button>
                    </div>
                </form>
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
                names:'',
                last_names:'',
                email:'',
                password: '',               
                role: 'admin',              
                status: 'activo',   
                phone_number:'',
                birthday_date:'',
                country:'',
                city:'',
                address_type:'jiron',
                address:'',
                address_number:'',
                document_type:'dni',
                document_number:'',
                gender:'M',
                speciality:'',
                biography:'',
                photo:'',
            },
            error:'',
            loading:false,
            password:'',
            password_confirm:'',
            photoPreview:false,
        };
    },
    computed: {
        passwordMismatch() {
            return this.password && this.password !== this.password_confirm;
        }
    },
    methods:{
        UserPhotoUpload(event){
            const file = event.target.files[0];  
            if (file) {
                this.user.photo=file; 
                this.previewImage(file);
            }
        },
        previewImage(file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                this.imagePreview = reader.result;
            };
            if (file) {
                reader.readAsDataURL(file); 
            }
        },
        async createAdministrator(){
            if (this.passwordMismatch) {
                return;
            }
            try{
                this.error = "";
                this.loading=true;
                this.user.password = this.password;
                const formDataAdmin = new FormData();
                Object.entries(this.user).map(([key, value]) => formDataAdmin.append(key, value));
                const response =await UserService.postUser(formDataAdmin);
                const idNewAdmin=response.data.data.id;
                this.$router.push({name: 'AdministradorDetallesVer',params: { idadministrador: idNewAdmin },});
            }catch (err) {
                if (err.response && err.response.data && err.response.data.errors) {
                    this.error = Object.values(err.response.data.errors).flat().join(" ");
                } else {
                    this.error = "Ocurrió un error inesperado al crear el administrador.";
                }
            }finally{
                this.loading=false;
            }
        },   
        goBack(){
            this.$router.push({name:'Administradores'});
        },    
    },
};
</script>