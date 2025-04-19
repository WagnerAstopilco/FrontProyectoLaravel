<template>
    <div class="container">
        <div class="card p-4">
            <Preloader :visible="cargando"></Preloader>
            <div class="d-flex">
                <h1 class="fs-4">{{ name }}</h1>
                <div class="dropdown ms-auto">
                    <button class="btn btn-black dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Opciones
                    </button>
                    <ul class="dropdown-menu">
                        <div v-if="user">
                        <li><a class="dropdown-item" href="#" @click="edituser()">Editar</a></li>
                        <li><a class="dropdown-item" href="#" @click="deleteUser()">Eliminar</a></li>
                        </div>
                    </ul>
                </div>            
            </div>
            <div v-if="user">
                <div class="d-flex flex-lg-row flex-column gap-3 mx-auto">
                    <div class="w-lg-60 w-md-90 w-100">
                        <form @submit.prevent="updateUser">
                            <div class="form-group">
                                <label for="names">Nombres</label>
                                <input type="text" class="form-control" id="names" v-model="user.names" placeholder="Nombres" :readonly="!isEditing"/>
                            </div>
                            <div class="form-group">
                                <label for="last_names">Apellidos</label>
                                <input type="text" class="form-control" id="last_names" v-model="user.last_names" placeholder="Apellidos" :readonly="!isEditing"/>
                            </div>
                            <div class="form-group">
                                <label for="email">Correo</label>
                                <input type="email" class="form-control" id="email" v-model="user.email" placeholder="Correo" :readonly="!isEditing"/>
                            </div>
                            <div class="form-group" v-if="isEditing ">
                                <label for="password">Contraseña</label>
                                <input type="password" class="form-control" id="password" v-model="password" placeholder="Contraseña" />
                            </div>
                            <div class="form-group" v-if="isEditing ">
                                <label for="password">Confirmar Contraseña</label>
                                <input type="password" class="form-control" id="confirm_password" v-model="password_confirm" placeholder="Confirmar contraseña"/>
                                <small v-show="passwordMismatch" class="text-danger">Las contraseñas no coinciden</small>
                            </div>
                            <div class="form-group flex-grow-1">
                                <label for="role">Rol</label>
                                <select name="role" class="form-control" v-model="user.role" :disabled="!isEditing">
                                    <option value="admin">Administrador</option>
                                    <option value="comercial">Comercial</option>
                                    <option value="supervisor">Supervisor</option>
                                    <option value="alumno">Alumno</option>
                                    <option value="capacitador">Capacitador</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="phone_number">Teléfono</label>
                                <input type="text" class="form-control" id="phone_number" v-model="user.phone_number" placeholder="Teléfono" :readonly="!isEditing"/>
                            </div>
                            <div class="form-group">
                                <label for="status">Estado</label>
                                <select name="status" class="form-control" v-model="user.status" :disabled="!isEditing">
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                </select>
                            </div>
                            <div class="d-flex flex-column flex-md-row gap-md-3 w-100">
                                <div class="form-group flex-grow-1">
                                    <label for="birthday_date">Fecha de nacimiento</label>
                                    <input type="date" class="form-control" id="birthday_date" v-model="user.birthday_date" :readonly="!isEditing"/>
                                </div>
                                <div class="form-group flex-grow-1">
                                    <label for="country">País</label>
                                    <input type="text" class="form-control" id="country" v-model="user.country" placeholder="País" :readonly="!isEditing"/>
                                </div>
                                <div class="form-group flex-grow-1">
                                    <label for="city">Ciudad</label>
                                    <input type="text" class="form-control" id="city" v-model="user.city" placeholder="Ciudad" :readonly="!isEditing"/>
                                </div>
                            </div>
                        <div class="d-flex flex-column flex-md-row gap-md-3 w-100">
                            <div class="form-group flex-grow-1">
                                <label for="address_type">Tipo</label>
                                <select name="address_type" class="form-control" v-model="user.address_type" :disabled="!isEditing">
                                    <option value="jiron">Jr.</option>
                                    <option value="avenida">Av.</option>
                                    <option value="pasaje">Psj.</option>
                                    <option value="prolongacion">Prol.</option>
                                    <option value="calle">Calle</option>
                                </select>
                            </div>
                            <div class="form-group flex-grow-1">
                                <label for="address">Dirección</label>
                                <input type="text" class="form-control" id="address" v-model="user.address" placeholder="Calle" :readonly="!isEditing"/>
                            </div>
                            <div class="form-group flex-grow-1">
                                <label for="address_number">N°/Mzn/Lt</label>
                                <input type="text" class="form-control" id="address_number" v-model="user.address_number" placeholder="Número" :readonly="!isEditing"/>
                            </div>
                        </div>
                        <div class="d-flex flex-column flex-md-row gap-md-3 w-100">
                            <div class="form-group flex-grow-1">
                                <label for="document_type">Tipo</label>
                                <select name="document_type" class="form-control" v-model="user.document_type" :disabled="!isEditing">
                                    <option value="pasaporte">Pasaporte</option>
                                    <option value="dni">DNI</option>
                                    <option value="cedula">Cédula de identidad</option>
                                </select>
                            </div>
                            <div class="form-group flex-grow-1">
                                <label for="document_number">Número</label>
                                <input type="text" class="form-control" id="document_number" v-model="user.document_number" placeholder="Número de documento" :readonly="!isEditing"/>
                            </div>
                            <div class="form-group flex-grow-1">
                                <label for="gender">Género</label>
                                <select name="gender" class="form-control" v-model="user.gender" :disabled="!isEditing">
                                    <option value="M">Masculino</option>
                                    <option value="F">Femenino</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="speciality">Especialidad</label>
                            <input type="text" class="form-control" id="speciality" v-model="user.speciality" placeholder="Especialidad" :readonly="!isEditing"/>
                        </div>
                        <div class="form-group">
                            <label for="biography">Biografía</label>
                            <textarea id="biography" class="form-control" v-model="user.biography" placeholder="Biografía del usuario" :readonly="!isEditing"></textarea> 
                        </div>
                        <div class="form-group" v-if="isEditing">
                            <label for="image">Imagen</label>
                            <input type="file" class="form-control" id="image" @change="handleImageUpload" >
                            <div v-if="imagePreview">
                                <img :src="imagePreview" alt="Vista previa" class="img-fluid mt-2" />
                            </div>
                        </div>
                            <div v-show="error" class="error text-danger mt-2" role="alert">
                                <small>{{ error }}</small>
                            </div>
                            <div v-if="isEditing" class="d-flex gap-3 mt-3">
                                <button type="submit" class="btn btn-cyan">{{ loading ? "Actualizando..." : "Actualizar" }}</button>
                                <button type="button" class="btn btn-black" @click="cancelEdit()">Cancelar</button>
                            </div>
                        </form>
                    </div>
                    <div class="d-flex flex-column w-lg-50 w-md-70 w-100" v-if="isViewing">
                        <label>Imagen de perfil</label>
                        <img :src="getImagenUrl(user.photo)" class="card-img mb-3" alt="Foto perfil"/>
                    </div>
                </div>
            </div>           
            <div class="card-footer d-flex justify-content-center pb-0">
                <button type="button" class="btn btn-blue" @click="goBack()">Volver</button>
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
            name:'Detalles del Usuario',
            iduser: this.$route.params.idusuario,
            user: null,
            cargando:false,
            loading:false,
            isViewing: false,
            isEditing: false,
            imagePreview: null,
            password:'',
            password_confirm:'',
            photoPreview:false,
            error:'',
        };
    },
    mounted() {
        if (this.$route.name === 'UsuarioDetallesVer') {
            this.isViewing = true;
        } else if (this.$route.name === 'UsuarioDetallesEditar') {
            this.isEditing = true;
        }
    },
    created(){
        this.getUserDetails();
    },  
    computed: {
        passwordMismatch() {
            return this.password && this.password !== this.password_confirm;
        }
    },
    components:{
        Preloader
    },
    methods:{        
        async getUserDetails(){
            try{
                this.cargando=true;
                const response=await UserService.getUserDetails(this.iduser);
                this.user=response.data.data;
            }catch(error){
                console.log(error);
            }finally{
                this.cargando=false;
            }
        },
                
        async deleteUser(){
            const confirmed = confirm('¿Estás seguro de que deseas eliminar este usuario?');
            if (confirmed) {
                try {
                    await UserService.deleteUser(this.iduser);
                    this.$router.push({name:'Usuarios'});
                } catch (error) {
                    alert('Hubo un error al intentar eliminar el usuario.');
                }
            }
        },
        async updateUser(){
            if (this.passwordMismatch) {
                return;
            }
            try{
                this.error='';
                this.loading=true;
                const formDataUser = new FormData();
                Object.entries(this.user).forEach(([key, value]) => {
                    if (key === 'photo' && value instanceof File) {
                        formDataUser.append(key, value);
                    } else if (key !== 'photo') {
                        formDataUser.append(key, value);
                    }
                });
                await UserService.patchUser(this.user.id,formDataUser);
                this.isEditing = false;
                this.isViewing=true;
                this.$router.replace({name:'UsuarioDetallesVer',params:{idusuario:this.iduser}})
                this.getUserDetails();
            }catch(err){
                this.error = Object.values(err.response.data.errors).flat().join(" ");
            }finally{
                this.loading=false;                
            }
        },
        goBack(){
            this.$router.push({name: 'Usuarios'});
        },
        cancelEdit(){
            this.isEditing = false;
            this.isViewing = true;
            this.getUserDetails();
            this.error='';
            this.$router.push({ name: 'UsuarioDetallesVer', params: { idusuario: this.iduser } });
        },
        getImagenUrl(image) {
            if (image) {
                return process.env.VUE_APP_API_URL + "/storage/" + image; 
            }
        },
        edituser(){
            this.isEditing = true;
            this.isViewing = false;
            this.$router.push({ name: 'UsuarioDetallesEditar', params: { idusuario: this.iduser } });
        },
        handleImageUpload(event) {
            const file = event.target.files[0]; 
            if (file) {
                this.administrator.photo = file;  
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
    }
}
</script>