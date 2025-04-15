<template>
    <div class="container">
        <div class="card p-4">
            <div class="d-flex">
                <h1 class="fs-4">{{ name }}</h1>
                <Preloader :visible="cargando"></Preloader>
                <div class="dropdown ms-auto" >
                    <button class="btn btn-black dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Opciones
                    </button>
                    <ul class="dropdown-menu">
                        <div v-if="lesson">
                        <li><a class="dropdown-item" href="#" @click="goToEditLesson()">Editar</a></li>
                        <li><a class="dropdown-item" href="#" @click="deleteLesson(lesson.id)">Eliminar</a></li>
                        </div>
                    </ul>
                </div>     
            </div>
            <div v-if="lesson">
                <form @submit.prevent="updateLesson()" class="w-lg-50 w-md-70 w-100">
                    <fieldset >
                        <div class="form-group">
                            <label for="title">Título</label>
                            <input type="text" class="form-control" id="title" v-model="lesson.title" :readonly="!isEditing">
                        </div>
                        <div class="form-group">
                            <label for="state">Estado</label>
                            <input type="text" class="form-control" id="state" v-model="lesson.state" :readonly="!isEditing">
                        </div>
                        <div class="form-group">
                            <label for="description">Descripción</label>
                            <textarea class="form-control" id="description" v-model="lesson.description" :readonly="!isEditing"></textarea>
                        </div>
                    </fieldset>
                    <div v-if="isEditing ">
                        <button type="submit" class="btn btn-cyan m-2">{{ loading ? "Actualizando..." : "Actualizar" }}</button>
                        <button type="button" class="btn btn-black m-2" @click="cancelEditLesson()">Cancelar</button>
                    </div>
                </form>
                <!-- sessions -->
                <div>
                    <div class="d-flex align-items-center gap-3">
                        <h2 class="fs-5">Sesiones</h2>
                        <!-- Button trigger modal -->
                        <button type="button" class="btn btn-green" data-bs-toggle="modal" data-bs-target="#lessonSessionModal">Nueva</button>
                        <!-- Modal -->
                        <div class="modal fade" id="lessonSessionModal" tabindex="-1" aria-labelledby="lessonSessionModalLabel" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h1 class="modal-title fs-5" id="lessonSessionModalLabel">Nueva sessión en vivo</h1>
                                        <button type  ="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <form @submit.prevent="createNewLessonSession()">
                                            <fieldset>
                                                <input type="text" id="session_date" class="form-control p-2" v-model="newLessonSession.session_date" placeholder="Titulo de la sesión"/>
                                                <div class="form-group d-flex flex-column">
                                                    <label for="session_date">Fecha de sesión</label>
                                                </div>                    
                                                <div class="form-group d-flex flex-column">
                                                    <label for="start_time">Hora de sesión</label>
                                                    <input type="time" id="start_time" class="form-control p-2" v-model="newLessonSession.start_time" placeholder="Titulo de la sesión"/>
                                                </div>                    
                                                <div class="form-group">
                                                    <label for="type">Tipo</label>
                                                    <select name="type" v-model="newLessonSession.type" class="form-control p-2">
                                                        <option value="zoom">Zoom</option>
                                                        <option value="meet">Meet</option>
                                                    </select>
                                                </div>                                                
                                                <div class="form-group">
                                                    <label for="link">Enlace</label>
                                                    <input type="text" id="link" v-model="newLessonSession.link" class="form-control p-2" placeholder="Enlace a la sesión"/>
                                                </div>
                                                <div class="form-group">
                                                    <label for="password">Contraseña</label>
                                                    <input type="text" id="password" v-model="newLessonSession.password" class="form-control p-2" placeholder="Enlace a la sesión"/>
                                                </div>
                                                <p v-if="error" class="error">{{ error }}</p>     
                                            </fieldset>
                                            <div class="modal-footer d-flex justify-content-center gap-3">
                                                <button type="submit" class="btn btn-green" data-bs-dismiss="modal">{{ loading ? "Creando..." : "Crear"}}</button>
                                                <button type="button" class="btn btn-blue" data-bs-dismiss="modal">Cerrar</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="table-responsive" v-if="lesson.sessions.length>0">
                            <table id="lessonSessionsTable" class="table table-striped">
                                <thead>
                                    <tr>
                                        <th class="text-center">Fecha</th>
                                        <th class="text-center">Hora</th>
                                        <th class="text-center">Tipo</th>
                                        <th class="text-center">Enlace</th>
                                        <th class="text-center">Contraseña</th>
                                        <th class="text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="session in lesson.sessions"  class="table-pointer" :key="session.id">
                                        <td class="text-center">{{ session.session_date }}</td>
                                        <td class="text-center">{{ session.start_time }}</td>
                                        <td class="text-center">{{ session.type }}</td>
                                        <td class="text-center">{{ session.link }}</td>
                                        <td class="text-center">{{ session.password}}</td>
                                        <td class="text-center">
                                            <button type="button" class="btn btn-danger" @click="deleteLessonSession(session.id)">Eliminar</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div v-else>
                            <p>No hay sesiones disponibles</p>
                        </div>
                    </div>
                </div>
                <!-- materials -->
                <div>
                    <div class="d-flex align-items-center gap-3">
                        <h2 class="fs-5">Materiales</h2>
                        <!-- Button trigger modal -->
                        <button type="button" class="btn btn-green" data-bs-toggle="modal" data-bs-target="#materialsModal">Nuevo</button>
                        <!-- Modal -->
                        <div class="modal fade" id="materialsModal" tabindex="-1" aria-labelledby="materialsModalLabel" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h1 class="modal-title fs-5" id="materialsModalLabel">Nuevo material</h1>
                                        <button type  ="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <form @submit.prevent="createNewMaterial()">
                                            <fieldset>
                                                <div class="form-group d-flex flex-column">
                                                    <label for="titleMaterial">Titulo</label>
                                                    <input type="text" id="titleMaterial" class="form-control p-2" v-model="newMaterial.title" placeholder="Titulo del material"/>
                                                </div>                    
                                                <div class="form-group">
                                                    <label for="type">Tipo</label>
                                                    <select name="type" v-model="newMaterial.type" class="form-control p-2">
                                                        <option value="file">Archivo</option>
                                                        <option value="link">Enlace</option>
                                                        <option value="video">Video</option>
                                                        <option value="text">Texto</option>
                                                    </select>
                                                </div>
                                                <div class="form-group" v-if="newMaterial.type==='file'">
                                                    <label for="file">Archivo</label>
                                                    <input type="file" class="form-control" id="file" @change="handleFileUpload">
                                                </div>
                                                <div class="form-group" v-if="newMaterial.type==='link'||newMaterial.type==='video'">
                                                    <label for="link">Link</label>
                                                    <input type="text" id="link" v-model="newMaterial.url" class="form-control p-2" placeholder="Enlace al material"/>
                                                </div>
                                                <div class="form-group" v-if="newMaterial.type==='text'">
                                                    <label for="content">Contenido</label>
                                                    <textarea id="content" v-model="newMaterial.content" class="form-control p-2" placeholder="Contenido del material"></textarea>
                                                </div>
                                                <p v-if="error" class="error">{{ error }}</p>     
                                            </fieldset>
                                            <div class="modal-footer d-flex justify-content-center gap-3">
                                                <button type="submit" class="btn btn-green" data-bs-dismiss="modal">{{ loading ? "Creando..." : "Crear"}}</button>
                                                <button type="button" class="btn btn-blue" data-bs-dismiss="modal">Cerrar</button>
                                            </div>
                                        </form>                                            
                                    </div>                                
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="table-responsive" v-if="lesson.materials.length>0">
                            <table id="materialsTable" class="table table-striped">
                                <thead>
                                    <tr>
                                        <th class="text-center">Órden</th>
                                        <th class="text-center">Título</th>
                                        <th class="text-center">Tipo</th>
                                        <th class="text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="material in lesson.materials"  class="table-pointer" :key="material.id">
                                        <td class="text-center">{{ material.order_in_lesson }}</td>
                                        <td class="text-center">{{ material.title }}</td>
                                        <td class="text-center">{{ material.type }}</td>
                                        <td class="d-flex justify-content-center gap-2"> 
                                            <a v-if="material.type==='file'" :href="getFileUrl(material.file)" class="btn btn-blue" target="_blank">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
                                                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
                                                    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/>
                                                </svg>
                                            </a>
                                            <a v-if="material.type==='link'||material.type==='video'" :href="material.url" class="btn btn-green" target="_blank">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"/>
                                                    <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"/>
                                                </svg>
                                            </a>
                                            <button  v-if="material.type==='text'" type="button" class="btn btn-primary" @click="viewMaterial(material.id)">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                                                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                                                </svg>
                                            </button>
                                            <button type="button" class="btn btn-danger" @click="deleteMaterial(material.id)">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div v-else>
                            <p>No hay materiales disponibles</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-center p-3">
                <button type="button" class="btn btn-blue" @click="goBack()">Volver</button>
            </div>
        </div>
    </div>
</template>
<script>
import LessonService from '@/services/LessonsService.js'
import MaterialService from '@/services/MaterialsService.js'
import LessonSessionService from '@/services/LessonSessionsService.js'
import Preloader from '../../components/Preloader.vue';
export default {
    data() {
        return {
            name: 'Detalles de la lección',
            cargando: false,  
            lesson: null,
            idmodulo: this.$route.params.idmodulo,
            idleccion: this.$route.params.idleccion,
            isEditing: false,
            isViewing: true,
            loading: false,
            error:'',
            newMaterial: {
                title:'',
                grade:'leccion',
                type: 'file ',
                file:'',
                url: '',
                content: '',
                order_in_lesson:'',
                lesson_id:'',
            },
            newLessonSession:{
                lesson_id:'',
                session_date:'',
                start_time:'',
                type:'meet',
                link:'',
                password:'',
            }
        }
    },
    components:{
        Preloader,
    },
    created(){
        this.getLessonDetails();
    },
    methods: {
        goBack(){
            this.$router.push({ name: 'ModuloDetalleVer', params: { idmodulo: this.idmodulo } });
        },
        goToEditLesson(){
            this.isEditing = true;
            this.isViewing = false;
            this.$router.push({ name: 'LeccionDetallesEditar', params: { idmodulo: this.idmodulo, idleccion: this.idleccion } });
        },
        cancelEditLesson(){
            this.isEditing = false;
            this.isViewing = true;
            this.$router.push({ name: 'LeccionDetallesVer', params: { idmodulo: this.idmodulo, idleccion: this.idleccion } });
        },
        async deleteLesson(lessonId){
            const confirmed = confirm('¿Estás seguro de que deseas eliminar esta lección?');
            if (confirmed) {
                try {
                    await LessonService.deleteLesson(lessonId); 
                    this.$router.push({ name: 'Lecciones' });
                } catch (error) {
                    alert('Hubo un error al intentar eliminar el Módulo.');
                }
            } 
        },
        async getLessonDetails() {
            try{
                this.cargando = true;
                const response = await LessonService.getLessonDetails(this.idleccion);
                this.lesson = response.data.data;
            }catch(error){
                console.log(error);
            }finally{
                this.cargando=false;
            }    
                
        },
        async updateLesson(){
            try{
                this.cargando=true;
                this.loading=true;
                await LessonService.patchLesson(this.lesson.id, this.lesson);
                this.$router.replace({ name: 'LeccionDetallesVer', params: { idmodulo: this.idmodulo, idleccion: this.idleccion } });
                this.isEditing=false;
                this.isViewing=true;
            }catch(error){
                console.log(error);
            }finally{
                this.loading=false;
                this.cargando=false;
            }
        },
        getFileUrl(file) {
            if (file) {
                return process.env.VUE_APP_API_URL + "/storage/" + file; 
            }
        },
        viewMaterial(id) {
            this.$router.push({ name: 'MaterialDetalleVer', params: { idmaterial: id } });
        },
        async deleteMaterial(materialId){
            const confirmed = confirm('¿Estás seguro de que deseas eliminar este material?');
            if (confirmed) {
                try {
                    this.reorderedMaterials(materialId);
                    await MaterialService.deleteMaterial(materialId);
                    this.getLessonDetails(); 
                } catch (error) {
                    alert('Hubo un error al intentar eliminar el curso.');
                }
            }   
        },
        async reorderedMaterials(materialId){
            const materialToDelete=this.lesson.materials.find(material=>material.id===materialId);
            const materialsToReorder=this.lesson.materials.filter(material=>material.order_in_lesson>materialToDelete.order_in_lesson);
            const formData = new FormData();
            if(materialsToReorder.length>0){
                for(let material of materialsToReorder){
                    material.order_in_lesson=material.order_in_lesson-1;
                    formData.append("order_in_lesson", material.order_in_lesson);
                    await MaterialService.patchMaterial(material.id,formData);
                }
            }
        },
        handleFileUpload(event) {
            const file = event.target.files[0];  
            if (file) {
                this.newMaterial.file=file; 
            }
        },
        async createNewMaterial() {
            this.error = "";
            this.loading = true;
            const formData = new FormData();
                formData.append("title", this.newMaterial.title);
                formData.append("grade", this.newMaterial.grade);
                formData.append("type", this.newMaterial.type);
                formData.append("url", this.newMaterial.url);
                formData.append("content", this.newMaterial.content);            
                if (this.newMaterial.file) {
                    formData.append("file", this.newMaterial.file);
                }
                try {
                    this.newMaterial.order_in_lesson=this.lesson.materials.length+1;
                    formData.append("order_in_lesson", this.newMaterial.order_in_lesson); 
                    this.newMaterial.lesson_id=this.lesson.id;           
                    formData.append("lesson_id", this.newMaterial.lesson_id);            
                    await MaterialService.postMaterial(formData);                    
                    this.getLessonDetails();
            } catch (err) {
                console.log(err);
                if (err.response && err.response.status === 422) {
                this.error = Object.values(err.response.data.errors).flat().join(" ");
                } else {
                this.error = "Error al agregar el material.";
                }
            } finally {
                this.loading = false;
            }
        },
        async createNewLessonSession(){
            this.newLessonSession.lesson_id=this.lesson.id;
            await LessonSessionService.postLessonSession(this.newLessonSession);
            this.getLessonDetails();
        }
    },
};
</script>