<template>
    <div class="container">
        <div class="card p-4">

            <div class="head d-flex">
                <h1 class="fs-4">{{name}}</h1>
                <Preloader :visible="cargando"></Preloader>
                <div class="dropdown ms-auto" >
                    <button class="btn btn-info dropdown-toggle ms auto" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Opciones 
                    </button>
                    <ul class="dropdown-menu" v-if="student">
                        <li class="dropdown-item" @click="editStudent(student.id)">Editar</li>
                        <li class="dropdown-item" @click="deleteStudent">Eliminar</li>
                    </ul>
                </div>
            </div>

            <div v-if="student">
                <form @submit.prevent="updateStudent" class="w-50">
                    <div class="form-group">
                        <label for="names">Nombres</label>
                        <input type="text" class="form-control" id="names" v-model="student.names" readonly>
                    </div>
                    <div class="form-group">
                        <label for="last_names">Apellidos</label>
                        <input type="text" class="form-control" id="last_names" v-model="student.last_names" readonly>
                    </div>
                    <div class="form-group">
                        <label for="email">Correo</label>
                        <input type="email" class="form-control" id="email" v-model="student.email" readonly>
                    </div>
                    <div class="form-group">
                        <label for="phone_number">Celular</label>
                        <input type="text" class="form-control" id="phone_number" v-model="student.phone_number" readonly>
                    </div>
                    <div class="form-group">
                        <label for="speciality">Especialidad</label>
                        <input type="text" class="form-control" id="speciality" v-model="student.speciality" readonly>
                    </div>
                    <div class="form-group">
                        <label for="status">Estado</label>
                        <select name="status" class="form-control p-2" v-model="student.status" :readonly="!isEditing">
                            <option value="active" selected>Activo</option>
                            <option value="inactive" >Inactivo</option>
                        </select>
                    </div>
                    <div v-if="isEditing ">
                        <button type="submit" class="btn btn-outline-warning m-2">{{ loading ? "Actualizando..." : "Actualizar" }}</button>
                        <button type="button" class="btn btn-outline-secondary m-2" @click="cancelEdit">Cancelar</button>
                    </div>
                </form>
            </div>

            <div id="matriculas">
                <h2 class="fs-5">Matrículas</h2>
                <div v-if="student && student.enrollments">
                    <table id="studentsEnrollmentTable" class="table table-striped">
                        <thead>
                            <tr>
                                <!-- <th>Nombres</th> -->
                            </tr>
                        </thead>
                        <tbody >
                            <tr v-for="enroll in student.enrollments" :key="enroll.id" style="cursor:pointer"> 
                                <!-- <td @click="studentDetail(student.id)">{{ student.names }}</td> -->
                                
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-else>
                    <p>Sin cursos matriculados</p>
                </div>
            </div>
            <div id="certificados">
                <h2 class="fs-5">Certificados</h2>
                <div v-if="student && student.certificates">
                    <table id="studentsCertificatesTable" class="table table-striped">
                        <thead>
                            <tr>
                                <!-- <th>Nombres</th> -->
                            </tr>
                        </thead>
                        <tbody >
                            <tr v-for="certificate in student.certificates" :key="certificate.id" style="cursor:pointer"> 
                                <!-- <td @click="studentDetail(student.id)">{{ student.names }}</td> -->
                                
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-else>
                    <p>Sin certificados</p>
                </div>
            </div>
            <div id="evaluaciones">
                <h2 class="fs-5">Evaluaciones</h2>
                <div v-if="student && student.userEvaluations">
                    <table id="studentsUserEvaluationsTable" class="table table-striped">
                        <thead>
                            <tr>
                                <!-- <th>Nombres</th> -->
                            </tr>
                        </thead>
                        <tbody >
                            <tr v-for="evaluation in student.userEvaluations" :key="evaluation.id" style="cursor:pointer"> 
                                <!-- <td @click="studentDetail(student.id)">{{ student.names }}</td> -->
                                
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-else>
                    <p>Sin Evaluaciones</p>
                </div>

            </div>
            <div class="volver mx-auto">
                <button type="button" class="btn btn-primary" @click="goBack">Volver</button>
            </div>
        </div>
    </div>
</template>
<script>
import Preloader from '../../components/Preloader.vue';
import UserService from '@/services/UsersService.js'

export default{
    data(){
        return{
            name:'Detalles del Alumno',
            cargando:false,
            idstudent:this.$route.params.idalumno,
            student:null,
            isEditing:false,
            isViewing:false,
            loading:false,
        }
    },
    created(){
        this.getStudentDetail();
    },
    components:{
        Preloader
    },
    methods:{
        goBack(){
            this.$router.push({name:'Alumnos'});
        },
        async getStudentDetail(){
            try{
                this.cargando=true;
                const response=await UserService.getUserDetails(this.idstudent);
                this.student=response.data.data;
            }catch(error){
                console.log(error);
            }finally{
                this.cargando=false;
            }

        },
        editStudent(){
            this.isEditing=true;
            this.$router.push({name:'AlumnoDetallesEditar', params:{idalumno:this.idstudent}});
        },
        async updateStudent(){
            try
            {
                this.loading = true;
                this.cargando=true;
                await UserService.patchUser(this.idstudent,this.student);
                this.isEditing = false;
                this.$router.push({name:'AlumnoDetallesVer',params:{idalumno:this.idstudent}})
            }catch(error){
                console.log(error);
            }     
            finally{
                this.cargando=false;
                this.loading=false;
            }
        },
        async deleteStudent(){
            await UserService.deleteUser(this.idstudent);
            this.$router.push({name: 'Alumnos'});
        },
        cancelEdit(){
            this.isEditing=false;
            this.$router.push({name:'AlumnoDetallesVer', params:{idalumno:this.idstudent}});
        }
    }
}
</script>
