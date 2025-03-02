<template>
    <div class="container">
        <div class="card p-4">
            <div class="head ">
                <h1 class="fs-4">{{name}}</h1>
            </div>
            <div class="card-body col-8 mx-auto">
                <form @submit.prevent="addStudent">
                    <div class="form-group d-flex flex-column">
                        <label for="names">Nombres</label>
                        <input type="text" class="form-control p-2" id="names" v-model="newUserStudent.names" placeholder="Nombres del alumno" required/>
                    </div>
                    <div class="form-group d-flex flex-column">
                        <label for="las_names">Apellidos</label>
                        <input type="text" class="form-control p-2" id="last_names" v-model="newUserStudent.last_names" placeholder="Apellidos del alumno" required/>
                    </div>
                    <div class="form-group d-flex flex-column">
                        <label for="email">Correo</label>
                        <input type="email" class="form-control p-2" id="email" v-model="newUserStudent.email" placeholder="ejmplo@correo.com" required/>
                    </div>
                    <div class="form-group d-flex flex-column">
                        <label for="password">Contraseña</label>
                        <input type="password" class="form-control p-2" id="password" v-model="newUserStudent.password" placeholder="Contraseña" required/>
                        <p v-if="error" class="error">{{ error }}</p> 
                    </div>
                    <div class="d-flex justify-content-center">
                    <button type="submit" class="btn btn-info m-2">{{ loading ? "Agregando..." : "Agregar" }}</button>
                    <button type="button" class="btn btn-primary m-2" @click="goBack">Volver</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
import UserService from '@/services/UsersService.js';

export default {
    data() {
        return {
            name:'Nuevo Alumno',
            newUserStudent:{
                names:'',
                last_names:'',
                email:'',
                password:'',
                role:'alumno',
                status:'active',
            },
            error: "",
            loading: false,
        };
    },

    methods: {
        goBack() {
            this.$router.push({ name: 'Alumnos' }); 
        },
        async addStudent() {
            this.error = "";
            this.loading = true;
            try {
                const response = await UserService.postUser(this.newUserStudent);
                const studentId = response.data.data.id;
                this.$router.push({name: 'AlumnoDetallesVer',params: { idalumno: studentId },});
            } catch (err) {
                console.log(err);
                if (err.response && err.response.status === 422) {
                this.error = Object.values(err.response.data.errors).flat().join(" ");
                } else {
                this.error = "Error al agregar el estudiante.";
                }
            } finally {
                this.loading = false;
            }
        },
    }
};
</script>
