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
                        <div v-if="evaluation">
                        <li><a class="dropdown-item" href="#" @click="goToEditEvaluation()">Editar</a></li>
                        <li><a class="dropdown-item" href="#" @click="deleteEvaluation(evaluation.id)">Eliminar</a></li>
                        </div>
                    </ul>
                </div>     
            </div>
            <div v-if="evaluation" class="d-flex flex-lg-row flex-column gap-3">
                <div class="w-lg-60 w-md-90 w-100">
                
                    <form @submit.prevent="updateEvaluation()" class="w-100">
                        <fieldset>
                            <div class="form-group d-flex flex-column">
                                <label for="title">Titulo</label>
                                <input type="text" id="title" class="form-control" v-model="evaluation.title" placeholder="Titulo de la evaluación" :readonly="!isEditing"/>
                            </div>
                            <div class="form-group d-flex flex-column">
                                <label for="start_date">Fecha de inicio</label>
                                <input type="date" id="start_date" class="form-control" v-model="evaluation.start_date" placeholder="Titulo de la evaluación" :readonly="!isEditing"/>
                            </div>
                            <div class="form-group d-flex flex-column">
                                <label for="end_date">Fecha de fin</label>
                                <input type="date" id="end_date" class="form-control" v-model="evaluation.end_date" placeholder="Titulo de la evaluación" :readonly="!isEditing"/>
                            </div>
                            <div class="form-group d-flex flex-column">
                                <label for="duration">Duración</label>
                                <input type="time" id="duration" class="form-control" v-model="evaluation.duration" placeholder="Titulo de la evaluación" :readonly="!isEditing"/>
                            </div>
                            <div class="form-group d-flex flex-column">
                                <label for="attempts_allowed">Intentos permitidos</label>
                                <input type="number" id="attempts_allowed" class="form-control" v-model="evaluation.attempts_allowed" placeholder="Titulo de la evaluación" :readonly="!isEditing"/>
                            </div>
                            <div class="form-group">
                                    <label for="state">Estado</label>
                                    <select name="state" v-model="evaluation.state" class="form-control" :disabled="!isEditing">
                                        <option value="activo">Activo</option>
                                        <option value="inactivo">Inactivo</option>
                                    </select>
                                </div>
                            <p v-if="error" class="error">{{ error }}</p>     
                        </fieldset>
                        <div v-if="isEditing" class="d-flex justify-content-center gap-3">
                            <button type="submit" class="btn btn-cyan">{{ loading ? "Actualizando..." : "Actualizar" }}</button>
                            <button type="button" class="btn btn-blue" @click="cancelEdit()">Cancelar</button>
                        </div>
                    </form>
                </div>                
            </div>
            <div v-if="evaluation">
                <div>
                    
                    <div class="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-3">
                        <h2 class="fs-5">Preguntas</h2>
                        <!-- Button trigger modal -->
                        <button type="button" class="btn btn-green " data-bs-toggle="modal" data-bs-target="#questionModal">
                            Nueva
                        </button>
                    </div>
                    <!-- Modal -->
                    <div class="modal fade" id="questionModal" tabindex="-1" aria-labelledby="questionModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="questionModalLabel">Nueva Pregunta</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <fieldset>
                                    <div class="form-group d-flex flex-column">
                                        <label for="question_text">Enunciado</label>
                                        <input type="text" id="question_text" class="form-control p-2" v-model="newQuestion.question_text" placeholder="Enunciado de la pregunta"/>
                                    </div>
                                    <div class="form-group">
                                        <label for="type">Tipo</label>
                                        <select name="type" v-model="newQuestion.type" class="form-control p-2">
                                            <option value="opcion multiple">Opción multiple</option>
                                            <option value="abierta">Abierta</option>
                                        </select>
                                    </div>
                                    <div class="form-group d-flex flex-column">
                                        <label for="weight">Puntaje</label>
                                        <input type="number" id="weight" class="form-control p-2" v-model="newQuestion.weight" placeholder="Enunciado de la pregunta"/>
                                    </div>
                                    <div v-if="newQuestion.type === 'opcion multiple'">
                                        <div class="form-group" v-for="(option, key) in options" :key="key">
                                            <label :for="'option-' + key">Opción {{ key.toUpperCase() }}</label>
                                            <input type="text"
                                                class="form-control mb-2"
                                                :id="'option-' + key"
                                                v-model="option.option"
                                                :placeholder="'Escribe la opción ' + key.toUpperCase()" />

                                            <div class="form-check">
                                            <input class="form-check-input"
                                                    type="radio"
                                                    name="is_correct"
                                                    :id="'correct-' + key"
                                                    :value="key"
                                                    v-model="correctAnswer">
                                            <label class="form-check-label" :for="'correct-' + key">
                                                Marcar como correcta
                                            </label>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-green" data-bs-dismiss="modal" @click="createNewQuestion()">Crear</button>
                            <button type="button" class="btn btn-blue" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div v-if="evaluation.questions.length>0">
                    <div class="table-responsive">
                        <table id="questionsTable" class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Tipo</th>
                                    <th>Puntaje</th>
                                    <th>Enunciado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="question in evaluation.questions" :key="question.id">
                                    <td>{{ question.type }}</td>
                                    <td>{{ question.weight }}</td>
                                    <td>{{ question.question_text }}</td>
                                    <td><button class="btn btn-outline-danger" @click="deleteQuestion(question)">Eliminar</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div v-else>
                        <p>Sin preguntas disponibles</p>
                    </div>
            </div>
            <div class="d-flex justify-content-center">
                <button type="button" class="btn btn-blue" @click="goBack">Volver</button>
            </div>
        </div>
    </div>
</template>
<script>
import EvaluationService from '@/services/EvaluationsService.js'
import QuestionService from '@/services/QuestionsService.js'
import OptionService from '@/services/OptionsService.js'
import Preloader from '../../components/Preloader.vue';
export default{
    data(){
        return{
            name:'Detalles de la evaluación',
            evaluation:null,
            idevaluacion: this.$route.params.idevaluacion,
            idcurso: this.$route.params.idcurso,
            cargando:false,
            isEditing:false,
            isViewing:false,
            loading:false,
            error:'',
            newQuestion:{
                evaluation_id:'',
                type:'abierta',
                question_text:'',
                weight:'',
            },
            options: {
                a: { option: '', is_correct: false },
                b: { option: '', is_correct: false },
                c: { option: '', is_correct: false },
                d: { option: '', is_correct: false },
                e: { option: '', is_correct: false }
            },
            correctAnswer: null,
        }
    },
    mounted() {
        this.getEvaluationDetails();
    },
    components:{
        Preloader,
    },
    methods: {
        goBack(){
            this.$router.push({ name: 'CursoDetalleVer', params: { idcurso: this.idcurso } });
        },
        cancelEdit(){
            this.isEditing=false;
            this.isViewing=true;
            this.$router.push({ name: 'EvaluacionDetallesVer', params: { idevaluacion: this.idevaluacion, idcurso: this.idcurso } });
        },
        goToEditEvaluation(){
            this.isEditing = true;
            this.isViewing = false;
            this.$router.push({ name: 'EvaluacionDetallesEditar', params: { idevaluacion: this.idevaluacion, idcurso: this.idcurso } });
        },
        deleteEvaluation(){

        },
        async getEvaluationDetails(){
            try{
                this.cargando=true;
                const response=await EvaluationService.getEvaluationDetails(this.idevaluacion);
                this.evaluation=response.data.data;
                console.log(this.evaluation);
            }catch(error){
                console.log(error);
            }finally{
                this.cargando=false;
            }
        },
        async updateEvaluation(){
            try{
                this.cargando=true;
                this.loading=true;
                this.evaluation.duration = this.evaluation.duration?.slice(0, 5);
                await EvaluationService.patchEvaluation(this.evaluation.id, this.evaluation);
                this.$router.replace({name: 'EvaluacionDetallesVer', params: { idevaluacion: this.idevaluacion, idcurso: this.idcurso }});
                this.isEditing=false;
                this.isViewing=true;
            }catch(error){
                console.log(error);
            }finally{
                this.loading=false;
                this.cargando=false;
            }
        },
        async createNewQuestion() {
            try {
                this.cargando = true;
                this.error = null;
                let optionsToSend = [];
                if (this.newQuestion.type === 'opcion multiple') {
                    for (const key in this.options) {
                        const optionText = this.options[key].option.trim();
                        if (optionText !== '') {
                            optionsToSend.push({
                                option: optionText,
                                is_correct: (key === this.correctAnswer) ? 1 : 0
                            });
                        }
                    }

                    if (optionsToSend.length < 2) {
                        alert('Debes ingresar al menos 2 opciones.');
                        return;
                    }

                    const hasCorrect = optionsToSend.some(opt => opt.is_correct === 1);
                    if (!hasCorrect) {
                        alert('Debes marcar una opción valida como correcta.');
                        return;
                    }
                }
                this.newQuestion.evaluation_id=this.evaluation.id;
                const response = await QuestionService.postQuestion(this.newQuestion);
                const questionId = response.data.data.id;
                if (this.newQuestion.type === 'opcion multiple') {
                    for (const optionData of optionsToSend) {
                        optionData.question_id = questionId;
                        await OptionService.postOption(optionData);
                    }
                }

                this.getEvaluationDetails();
                this.resetQuestionForm();

            } catch (error) {
                console.log(error);
            } finally {
                this.cargando = false;
            }
        },
        async deleteQuestion(question){
            if(question.type==='opcion multiple'){
                const response= await OptionService.getOptions();
                const allOptions=response.data.data;
                const questionOptions = allOptions.filter(opt => opt.question_id === question.id);
                for (const option of questionOptions) {
                    await OptionService.deleteOption(option.id);
                }
                await QuestionService.deleteQuestion(question.id);
                this.getEvaluationDetails();
            }else{
                await QuestionService.deleteQuestion(question.id);
                this.getEvaluationDetails();
            }
        }
    },

}
</script>