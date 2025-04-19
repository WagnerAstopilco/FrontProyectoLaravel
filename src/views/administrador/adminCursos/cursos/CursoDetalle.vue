<template>
    <div class="container">
        <div class="card p-4">
            <Preloader :visible="cargando"></Preloader>
            <div class="card-header d-flex pb-0">
                <h1 class="fs-4">{{ name }}</h1>
                <div class="dropdown ms-auto">
                    <button class="btn btn-secondary dropdown-toggle btn-black" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Opciones
                    </button>
                    <ul class="dropdown-menu">
                        <div v-if="course">
                        <li><a class="dropdown-item" @click="goToEditCourse()">Editar</a></li>
                        <li><a class="dropdown-item" @click="deleteCourse">Eliminar</a></li>
                        </div>
                    </ul>
                </div>            
            </div>
            <div v-if="course" class="card-body">
                <!-- datos del curso -->
                <div class="d-flex flex-lg-row flex-column gap-3 mx-auto">
                    <div class="w-lg-60 w-md-90 w-100">
                        <form @submit.prevent="updateCourse">
                            <div class="form-group">
                                <label for="start_date_course">Fecha de inicio</label>
                                <input type="date" class="form-control" id="start_date_course" v-model="course.start_date" :readonly="!isEditing"/>
                            </div>
                            <div class="form-group">
                                <label for="end_date_course">Fecha de fin</label>
                                <input type="date" class="form-control p-2" id="end_date_course" v-model="course.end_date" :readonly="!isEditing"/>
                            </div>
                            <div class="form-group">
                                <label for="name_long">Nombre</label>
                                <input type="text" class="form-control" id="name_long" v-model="course.name_long" :readonly="!isEditing">
                                <label for="name_short">Abreviación</label>
                                <input type="text" class="form-control" id="name_short" v-model="course.name_short" :readonly="!isEditing">
                                <label for="duration_in_hours">Duración</label>
                                <input type="text" class="form-control" id="duration_in_hours" v-model="course.duration_in_hours" :readonly="!isEditing">
                                <label for="category">Categoria</label>
                                <select name="category" class="form-control p-2" v-model="course.category_id" :readonly="!isEditing">
                                    <option value="" disabled selected>---Selecciona una Categoría---</option>
                                    <option v-for="category in categories" :key="category.id" :value="category.id">
                                        {{ category.name }}
                                    </option>
                                </select>
                                <label for="price">Precio</label>
                                <input type="number" class="form-control" id="price" v-model="course.price" :readonly="!isEditing">
                                <label for="discount">Descuento</label>
                                <input type="number" class="form-control" id="discount" v-model="course.discount" :readonly="!isEditing">
                                <label for="store">Tienda</label>
                                <input type="text" class="form-control p-2" id="store" v-model="course.store_id" placeholder="Tienda" :readonly="!isEditing">
                                <label for="name">Descripción</label>
                                <input type="text" class="form-control" id="name" v-model="course.description" :readonly="!isEditing">
                                <div v-if="isEditing">
                                    <label for="image">Imagen</label>
                                    <input type="file" class="form-control" id="image" @change="handleImageUpload">
                                    <div v-if="imagePreview">
                                        <img :src="imagePreview" alt="Vista previa" class="img-fluid mt-2" />
                                    </div>
                                </div>
                            </div>
                            <div v-if="error" class="error text-danger mt-2" role="alert">
                                <small>{{ error }}</small>
                            </div>
                            <div v-if="isEditing ">
                                <button type="submit" class="btn btn m-2" style="background-color:rgb(88,176,49);color:white">{{ loading ? "Actualizando..." : "Actualizar" }}</button>
                                <button type="button" class="btn btn m-2" style="background-color:rgb(0,87,163);color:white;" @click="cancelEdit">Cancelar</button>
                            </div>
                        </form>                        
                    </div>
                    <div class="d-flex flex-column w-lg-50 w-md-50 w-100 p-md-4 p-0" v-if="isViewing">
                        <label>Imagen del curso</label>
                        <img :src="getImagenUrl(course.image)" class="card-img mb-3" alt="CursoImagen"/>
                    </div>
                </div>
                <!-- capacitadores -->
                <section class="mb-3">
                    <div class="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                        <h3 class="mb-2 mb-md-0">Capacitadores</h3>
                        <button class="btn btn-green ms-0 ms-md-3" @click="showSearchTrainers=!showSearchTrainers">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-link-45deg" viewBox="0 0 16 16">
                                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z"/>
                                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z"/>
                            </svg>
                            Vincular
                        </button>
                    </div>

                    <form v-show="showSearchTrainers" class="w-lg-50 w-md-60 w-100 mb-4" @submit.prevent="addTrainersToCourse" >
                        <fieldset>
                            <Multiselect 
                                v-model="selectedTrainers" 
                                :options="availableTrainers" 
                                :multiple="true"
                                :searchable="true" 
                                :custom-label="getFullName" 
                                :showLabels="false"
                                openDirection="bottom"
                                placeholder="Seleccionar capacitadores"
                                label="names"
                                track-by="id" class="mb-3">
                                <template #noOptions>
                                    <span class="text-gray-500">No hay capacitadores disponibles</span>
                                </template>
                                <template #noResult>
                                    <span class="text-gray-500"> No se encontraron coincidencias. </span>
                                </template>
                            </Multiselect>
                        </fieldset>
                        <div>
                            <button type="submit" class="btn m-2 btn-cyan" >{{this.loadingTrainer?'Agregando...':'Agregar'}}</button>
                            <button type="button" class="btn m-2 btn-black" @click="showSearchTrainers=false">Cancelar</button>
                        </div>
                    </form>                    
                    <div v-if="trainers&&trainers.length > 0" class="table-responsive">
                        <table id="courseTrainersTable" class="table table-striped table-hover table-bordered">
                            <thead>
                                <tr>
                                    <th class="text-center">Nombre</th>
                                    <th class="text-center">Apellidos</th>
                                    <th class="text-center">Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="trainer in trainers" :key="trainer.id">
                                    <td class="text-center">{{ trainer.user.names }}</td>
                                    <td class="text-center">{{ trainer.user.last_names }}</td>
                                    <td class="text-center"><button type="button" class="btn btn-outline-danger mb-0" @click="deleteTrainerToCourse(trainer.id)">Elinimar</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div> 
                    <div v-if="course.trainers.length===0&&!showSearchTrainers">
                        <p>Sin capacitadores en el curso</p>
                    </div>
                </section>
                <!-- modulos -->
                <section class="mb-3">
                    <div class="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-2 gap-md-3">
                        <h3 class="mb-2 mb-md-0">Módulos</h3>
                        <div class="d-flex gap-3">
                            <button type="button" class="btn btn-blue" data-bs-toggle="modal" data-bs-target="#newModule">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                                </svg>
                                Nuevo
                            </button>
                            <button class="btn btn-green" @click="showNewModule=false;showSearchModule=!showSearchModule;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-link-45deg" viewBox="0 0 16 16">
                                    <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z"/>
                                    <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z"/>
                                </svg>
                                Vincular
                            </button>
                        </div>
                    </div>

                    <!-- modal nuevo modulo -->
                    <div class="modal fade" id="newModule" tabindex="-1" aria-labelledby="newModuleLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="newModuleLabel">Nuevo módulo</h1>
                                    <button type="button" class="btn-close btn-black" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <form @submit.prevent="createNewModule()">
                                        <fieldset>
                                            <div class="form-group">
                                                <label for="name">Nombre</label>
                                                <input type="text" class="form-control" id="name" v-model="newModule.name" placeholder="Nombre del módulo"/>
                                            </div>
                                            <div class="form-group">
                                                <label for="description">Descripción</label>
                                                <textarea id="description" class="form-control p-2" v-model="newModule.description" placeholder="Descripción del módulo"></textarea> 
                                            </div>
                                        </fieldset>
                                        <div class="modal-footer">
                                            <button type="submit" class="btn btn-cyan" data-bs-dismiss="modal">{{loadingModule?'Creando...':'Crear'}}</button>
                                            <button type="button" class="btn btn-black" data-bs-dismiss="modal">Cerrar</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- fin modal nuevo modulo -->
                    
                    <!-- agregar modulo -->
                    <div>
                        <form v-show="showSearchModule" class="w-lg-50 w-md-60 w-100" @submit.prevent="addModulesToCourse" >
                            <fieldset>
                                <multiselect 
                                    v-model="selectedModules" 
                                    :options="availableModules" 
                                    :multiple="true"
                                    :searchable="true" 
                                    :showLabels="false"
                                    openDirection="bottom"
                                    placeholder="Seleccionar módulos"
                                    label="name"
                                    track-by="id" class="mb-3">
                                    <template #noOptions>
                                        <span class="text-gray-500">No hay módulos disponibles</span>
                                    </template>
                                    <template #noResult>
                                        <span class="text-gray-500"> No se encontraron coincidencias. </span>
                                    </template>
                                </multiselect>
                            </fieldset>
                            <div>
                                <button type="submit" class="btn me-2 btn-cyan" >{{this.loadingModule?'Agregando...':'Agregar'}}</button>
                                <button type="button" class="btn ms-2 btn-black" @click="showSearchModule=false">Cancelar</button>
                            </div>
                        </form>
                    </div>
                    <div v-if="modulesToCourse && modulesToCourse.length>0">
                        <div class="table-responsive">
                            <table id="courseModulesTable" class="table table-striped table-hover table-bordered">
                                <thead>
                                    <tr>
                                        <th class="text-center">Órden</th>
                                        <th class="text-center">Nombre</th>
                                        <th class="text-center">Descripción</th>
                                        <th class="text-center">Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="courseModule in modulesToCourse" :key="courseModule.id" >
                                        <td class="text-center">{{ courseModule.order }}</td>
                                        <td>{{ courseModule.module.name }}</td>
                                        <td>{{ courseModule.module.description }}</td>
                                        <td class="d-flex justify-content-center gap-2">
                                            <button type="button" class="btn btn-success mb-0" @click="moduleUp(courseModule.id)">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-circle-fill" viewBox="0 0 16 16">
                                                <path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0m-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z"/>
                                            </svg>
                                            Subir
                                        </button>
                                        <button type="button" class="btn btn-info mb-0" @click="moduleDown(courseModule.id)">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-circle-fill" viewBox="0 0 16 16">
                                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z"/>
                                            </svg>
                                            Bajar
                                        </button>
                                            <button type="button" class="btn btn-outline-danger mb-0" @click="goToEditmodule(courseModule.module.id)">Editar</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div> 
                    <div v-show="modulesToCourse.length === 0 && !showSearchModule&&!showNewModule">
                        <p>Sin módulos en el curso</p>
                    </div>
                </section>
                <!-- evaluaciones -->
                <section class="mb-3">
                    <div class="d-flex gap-3">
                        <h3>Evaluaciones</h3>
                        <button type="button" class="btn btn-blue" data-bs-toggle="modal" data-bs-target="#newEvaluation">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                            </svg>
                            Nuevo
                        </button> 
                    </div>
                    <!-- Modal evaluación-->
                    <div class="modal fade" id="newEvaluation" tabindex="-1" aria-labelledby="newEvaluationLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="newEvaluationLabel">Nueva evaluación</h1>
                                    <button type="button" class="btn-close btn-black" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <form @submit.prevent="createNewEvaluation()">
                                        <fieldset>
                                            <div class="d-flex flex-md-row flex-column gap-3 w-100">
                                                <div class="form-group flex-grow-1">
                                                    <label for="title">Título</label>
                                                    <input type="text" class="form-control" id="title" v-model="newEvaluation.title" placeholder="Título de la evaluación"/>
                                                </div>
                                                <div class="form-group flex-grow-1">
                                                    <label for="state">Estado</label>
                                                    <select name="state" class="form-control" id="state" v-model="newEvaluation.state">
                                                        <option value="" disabled selected>---Selecciona un estado---</option>
                                                        <option value="activo">Activo</option>
                                                        <option value="inactivo">Inactivo</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="d-flex flex-md-row flex-column gap-3">
                                                <div class="form-group flex-grow-1">
                                                    <label for="start_date">Fecha de inicio</label>
                                                    <input type="date" class="form-control" id="start_date" v-model="newEvaluation.start_date"/>
                                                </div>
                                                <div class="form-group flex-grow-1">
                                                    <label for="end_date">Fecha de fin</label>
                                                    <input type="date" class="form-control" id="end_date" v-model="newEvaluation.end_date"/>
                                                </div>
                                            </div>
                                            <div class="d-flex flex-md-row flex-column gap-3">
                                                <div class="form-group flex-grow-1">
                                                    <label for="duration">Duración</label>
                                                    <input type="time" class="form-control" id="duration" v-model="newEvaluation.duration"/>
                                                </div>
                                                <div class="form-group flex-grow-1">
                                                    <label for="attempts_allowed">N° Intentos</label>
                                                    <input type="number" class="form-control" id="attempts_allowed" v-model="newEvaluation.attempts_allowed"/>
                                                </div>
                                            </div>
                                        </fieldset>
                                        <div class="modal-footer">
                                            <button type="submit" class="btn btn-cyan" data-bs-dismiss="modal">{{loadingEvaluation?'Creando...':'Crear'}}</button>
                                            <button type="button" class="btn btn-black" data-bs-dismiss="modal">Cerrar</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- fin modal evaluación-->
                    <div v-show="course.evaluations && course.evaluations.length > 0" class="table-responsive">
                        <table id="courseEvaluationsTable" class="table table-striped table-hover table-bordered">
                            <thead>
                                <tr>
                                    <th class="text-center">F. inicio</th>
                                    <th class="text-center">F. fin</th>
                                    <th class="text-center">Título</th>
                                    <th class="text-center">Duración</th>
                                    <th class="text-center">Intentos</th>
                                    <th class="text-center">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="evaluation in course.evaluations" :key="evaluation.id" class="table-pointer">
                                    <td class="text-center" @click="evaluationDetail(evaluation.id,this.course.id)">{{ evaluation.start_date }}</td>
                                    <td class="text-center" @click="evaluationDetail(evaluation.id,this.course.id)">{{ evaluation.end_date }}</td>
                                    <td class="text-center" @click="evaluationDetail(evaluation.id,this.course.id)">{{ evaluation.title }}</td>
                                    <td class="text-center" @click="evaluationDetail(evaluation.id,this.course.id)">{{ evaluation.duration }}</td>
                                    <td class="text-center" @click="evaluationDetail(evaluation.id,this.course.id)">{{ evaluation.attempts_allowed }}</td>
                                    <td>
                                        <button type="button" :class="evaluation.state === 'activo' ? 'btn btn-success' : 'btn btn-danger'" @click="changeStatus(evaluation.id)">
                                        <svg v-if="evaluation.state === 'activo'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                            <path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0zM7.646 10.854a.5.5 0 0 1-.708 0L4 7.707 5.207 6.5l2.439 2.438 4.708-4.707 1.414 1.414-5.854 5.854z"/>
                                        </svg>
                                        <svg v-if="evaluation.state === 'inactivo'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                                        </svg>
                                        {{evaluation.state}}
                                    </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div> 
                    <div v-show="course.evaluations.length===0">
                        <p>Sin evaluaciones en el curso</p>
                    </div>
                </section>
                <!-- materiales -->
                <section>
                    <div class="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-2 gap-md-3">
                        <h3 class="mb-2 mb-md-0">Materiales</h3> 
                        <div class="d-flex gap-3">
                            <button type="button" class="btn btn-blue" data-bs-toggle="modal" data-bs-target="#newMaterial">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                                </svg>
                                Nuevo
                            </button>
                            <button class="btn btn-green" @click="showSearchMaterial=!showSearchMaterial; showNewMaterial=false">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-link-45deg" viewBox="0 0 16 16">
                                    <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z"/>
                                    <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z"/>
                                </svg>
                                Vincular
                            </button>
                        </div>
                    </div>
                    <!-- Modal nuevo material -->
                    <div class="modal fade" id="newMaterial" tabindex="-1" aria-labelledby="newMaterialLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="newMaterialLabel">Nuevo material</h1>
                                    <button type="button" class="btn-close btn-black" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <form @submit.prevent="createMaterial()">
                                        <fieldset>
                                            <div class="form-group d-flex flex-column">
                                                <label for="title">Titulo</label>
                                                <input type="text" id="title" class="form-control p-2" v-model="newMaterial.title" placeholder="Titulo del material"/>
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
                    <!-- fin modal nuevo material-->
                    <!-- agregar material -->
                    <div>
                        <form v-show="showSearchMaterial" class="w-lg-50 w-md-60 w-100 mb-4" @submit.prevent="addMaterialToCourse" >
                            <fieldset>
                                <multiselect 
                                    v-model="selectedMaterials" 
                                    :options="availableMaterials" 
                                    :multiple="true"
                                    :searchable="true" 
                                    :showLabels="false"
                                    openDirection="bottom"
                                    placeholder="Seleccionar materiales"
                                    label="title"
                                    track-by="id" class="mb-3">
                                    <template #noOptions>
                                        <span class="text-gray-500">No hay materiales disponibles</span>
                                    </template>
                                    <template #noResult>
                                        <span class="text-gray-500"> No se encontraron coincidencias. </span>
                                    </template>
                                </multiselect>
                            </fieldset>
                            <div>
                                <button type="submit" class="btn m-2 btn-cyan" >{{this.loadingMaterial?'Agregando...':'Agregar'}}</button>
                                <button type="button" class="btn m-2 btn-black" @click="showSearchMaterial=false">Cancelar</button>
                            </div>
                        </form>
                    </div>
                    <div v-if="materialsList && materialsList.length > 0" class="table-responsive">
                        <table id="coursematerialsTable" class="table">
                            <thead>
                                <tr>
                                    <th class="text-center">Órden</th>
                                    <th class="text-center">Titulo</th>
                                    <th class="text-center">Tipo</th>
                                    <th class="text-center">Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="material in materialsList" :key="material.id">
                                    <td class="text-center">{{ material.order }}</td>
                                    <td>{{ material.material.title }}</td>
                                    <td class="text-center">{{ material.material.type }}</td>
                                    <td class="d-flex justify-content-center gap-2"> 
                                        <a v-if="material.material.type==='file'" :href="getFileUrl(material.material.file)" class="btn btn-blue" target="_blank">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
                                                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
                                                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/>
                                            </svg>
                                        </a>
                                        <a v-if="material.material.type==='link'||material.material.type==='video'" :href="material.material.url" class="btn btn-green" target="_blank">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
                                                <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"/>
                                                <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"/>
                                            </svg>
                                        </a>
                                        <button  v-if="material.material.type==='text'" type="button" class="btn btn-primary" @click="viewMaterial(material.material.id)">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                                            </svg>
                                        </button>
                                        <button type="button" class="btn btn-danger" @click="deleteMaterialToCourse(material.id)">
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
                    <div v-show="materialsList.length === 0 && !showSearchMaterial">
                        <p>Sin materiales en el curso</p>
                    </div>
                </section>
            </div>
            <div class="card-bottom d-flex">
                <button type="button" class="btn btn-blue mx-auto"  @click="goBack">Volver</button>
            </div>
        </div>
    </div>
</template>
<script>
import CourseService from '@/services/CoursesService.js';
import CourseMaterialService from '@/services/CourseMaterialService.js';
import MaterialService from '@/services/MaterialsService.js';
import CategoryService from '@/services/CategoryService.js';
import TrainerService from '@/services/TrainersService.js';
import EvaluationService from '@/services/EvaluationsService.js';
import ModuleService from '@/services/ModulesService.js';
import CourseModuleService from '@/services/CourseModuleService.js';
import Preloader from '../../../components/Preloader.vue';
import $ from 'jquery';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-bs4';

import Multiselect from "vue-multiselect";


export default {
    data() {
        return {
            name:"Detalles del Curso",
            idcurso:this.$route.params.idcurso,
            cargando: false,
            course:null,
            trainers:[],
            categories: [],
            isViewing: false,
            isEditing: false,
            loading: false,
            loadingTrainer: false,
            loadingModule: false,
            loadingEvaluation: false,
            loadingMaterial: false,
            imagePreview: null,
            evaluation:null,
            error:'',

            materialsList:[],
            newModule:{
                name:'',
                description:'',
            },
            newCourseModule:{
                course_id:'',
                module_id:'',
                order:'',
            },
            newEvaluation:{
                title:'',
                start_date:'',
                end_date:'',
                duration:'',
                attempts_allowed:'',
                state:'',
                course_id:'',
            },
            newMaterial: {
                title:'',
                grade:'curso',
                type: 'file ',
                file:'',
                url: '',
                content: '',
            },
            newCourseMaterial:{
                order:'',
                material_id:'',
                course_id:'',
            },

            showSearchTrainers:false,
            selectedTrainers:[],
            availableTrainers:[],

            showNewModule:false,
            showSearchModule:false,
            selectedModules:[],
            availableModules:[],
            modulesToCourse:[],

            showNewEvaluation:false,

            showNewMaterial:false,
            showSearchMaterial:false,
            selectedMaterials:[],
            availableMaterials:[],
        };
    },
    mounted() {
        if (this.$route.name === 'CursoDetalleVer') {
            this.isViewing = true;
        } else if (this.$route.name === 'CursoDetalleEditar') {
            this.isEditing = true;
        }
    },
    created() {
        this.getCourseDetails();
        this.getCategories();
        this.getAvailableTrainers();
    },
    beforeUnmount() {
        if ($.fn.dataTable.isDataTable('#courseEvaluationsTable')) {
            $('#courseEvaluationsTable').DataTable().destroy();
        }
        if ($.fn.dataTable.isDataTable('#coursematerialsTable')) {
            $('#coursematerialsTable').DataTable().destroy();
        }
        if ($.fn.dataTable.isDataTable('#courseModulesTable')) {
            $('#courseModulesTable').DataTable().destroy();
        }
        if ($.fn.dataTable.isDataTable('#courseTrainersTable')) {
            $('#courseTrainersTable').DataTable().destroy();
        }
    },
    components: {
        Preloader,
        Multiselect
    },
    methods: {
        async getCourseDetails() {
            try{
                this.cargando=true;
                const response = await CourseService.getCourseDetails(this.idcurso);
                this.course = response.data.data;
                this.getMaterialsLinked();
                this.getAvailableTrainers();
                this.getModulesToCourse();
                this.getAvailableModules();
                this.getAvailableMaterials();
                this.getTrainers(this.course);
                this.$nextTick(() => {
                    $('#courseTrainersTable').DataTable();
                    $('#courseModulesTable').DataTable();
                    $('#courseEvaluationsTable').DataTable();
                }); 
            }catch(error){
                console.log(error);
            }finally{
                this.cargando=false;                
            }
        },
        async getModulesToCourse(){
            const allCourseModule=await CourseModuleService.getCourseModules();
            this.modulesToCourse = allCourseModule.data.data.filter(courseModule => courseModule.course_id === this.course.id);
        },
        async getCategories(){
            try{
                this.cargando=true;
                const response = await CategoryService.getCategories();
                this.categories = response.data.data;
            }catch(error){
                console.log(error);
            }
            finally
            {
                this.cargando=false;
            }
        },
        async getTrainers(course) {
            try {
                const trainerPromises = course.trainers.map(trainer =>
                    TrainerService.getTrainerDetails(trainer.id)
                );
                const responses = await Promise.all(trainerPromises);

                this.trainers = responses.map(response => response.data.data);
            } catch (error) {
                console.error("Error al obtener los entrenadores:", error);
            }
        },
        goToEditCourse(){
            this.isEditing = true;
            this.isViewing = false;
            this.$router.push({ name: 'CursoDetalleEditar', params: { idcurso: this.idcurso } });
        },
        goBack() {
            this.$router.push({ name: 'Cursos' }); 
        },
        async updateCourse() {
            this.error = "";
            this.loading = true;
            const formData = new FormData();
            formData.append('name_long', this.course.name_long);
            formData.append('name_short', this.course.name_short);
            formData.append('price', this.course.price);
            formData.append('discount', this.course.discount);
            formData.append('description', this.course.description);
            formData.append('start_date', this.course.start_date);
            formData.append('end_date', this.course.end_date)
            formData.append('duration_in_hours', this.course.duration_in_hours)
            formData.append('store_id', this.course.store_id);
            formData.append('category_id', this.course.category_id);
            if (this.course.image && this.course.image instanceof File) {
                formData.append("image", this.course.image);
            }
            try {
                this.error = "";
                this.loading = true;
                await CourseService.patchCourse(this.idcurso, formData);
                this.isEditing = false;
                this.isViewing = true;  
                this.getCourseDetails();
                this.$router.replace({ name: "CursoDetalleVer", params: { idcurso: this.idcurso } });
            } catch (err) {
                this.error = Object.values(err.response.data.errors).flat().join(" ");
                
            } finally {
                this.loading = false;
            }
        },
        async deleteCourse(){
            const confirmed = confirm('¿Estás seguro de que deseas eliminar este curso?');
            if (confirmed) {
                try {
                    await CourseService.deleteCourse(this.course.id ); 
                    this.$router.push({ name: 'Cursos' });
                } catch (error) {
                    alert('Hubo un error al intentar eliminar el curso.');
                }
            }   
        },
        getImagenUrl(image) {
            if (image) {
                return process.env.VUE_APP_API_URL + "/storage/" + image; 
            }
        },
        cancelEdit(){
            this.isEditing = false;
            this.isViewing = true;
            this.getCourseDetails();
            this.error='';
            this.$router.push({ name: 'CursoDetalleVer', params: { idcurso: this.idcurso} });
        },
        handleImageUpload(event) {
            const file = event.target.files[0]; 
            if (file) {
                this.course.image = file;  
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
        goToEditmodule(id){
            this.$router.push({ name: 'ModuloDetalleEditar', params: { idmodulo: id } });
        },
        async getAvailableTrainers(){
            try {
                const response = await TrainerService.getTrainers();
                const allTrainers = response.data.data;
                if (this.course && this.course.trainers) {
                    const courseTrainersIds = this.course.trainers.map(trainer => trainer.id);
                    this.availableTrainers = allTrainers.filter(trainer => !courseTrainersIds.includes(trainer.id));
                } else {
                    this.availableTrainers = allTrainers;
                }
            } catch (error) {
                console.log(error);
            } 
        },
        async getAvailableModules(){
            try {
                const response = await ModuleService.getModules();
                const allModules = response.data.data;
                
                this.availableModules = allModules.filter(module => 
                    !this.modulesToCourse.some(courseModule => courseModule.module_id === module.id)
                );
                } catch (error) {
                    console.log(error);
                }
        },
        async addTrainersToCourse(){
            if (!this.selectedTrainers || this.selectedTrainers.length === 0) {
                alert("Debe seleccionar al menos un capacitador.");
                return;
            }
            this.loadingTrainer = true;
            try {
                const requestData = {
                    trainer_ids: this.selectedTrainers.map(trainer => trainer.id)
                };
                await CourseService.postTrainersToCourse(this.course.id, requestData);
                this.selectedTrainers = [];
                this.showSearchTrainers=false;
                this.getCourseDetails();
            } catch (error) {
                console.error("Error al agregar capacitadores:", error);
            } finally {
                this.loadingTrainer = false;
            }
        },
        async addModulesToCourse(){
            if (!this.selectedModules || this.selectedModules.length === 0) {
                alert("Debe seleccionar al menos un módulo.");
                return;
            }
            this.loadingModule = true;
            try {
                for(let module of this.selectedModules){
                    let newCourseModule = {
                        course_id:this.idcurso,
                        module_id:module.id,
                        order:this.course.modules.length+1
                    }
                    await CourseModuleService.postCourseModule(newCourseModule);
                }
                this.selectedModules = [];
                this.showSearchModules=false;
                this.getCourseDetails();
            } catch (error) {
                console.error("Error al agregar modulos:", error);
            } finally {
                this.loadingModule = false;
                this.showSearchModule=false;
            }
        },
        async deleteTrainerToCourse(trainerId){
            const confirmed = confirm('¿Estás seguro de que deseas quitar este capacitador del curso?');
            if (confirmed) {
                try {
                    await CourseService.deleteTrainerToCourse(trainerId,this.idcurso);
                    this.getCourseDetails(); 
                } catch (error) {
                    alert('Hubo un error al intentar eliminar el capacitador.');
                }
            }   
        },
        async deleteMaterialToCourse(materialId){
            const confirmed = confirm('¿Estás seguro de que deseas eliminar este material del curso?');
            if (confirmed) {
                try {
                    this.reorderedMaterials(materialId);
                    await CourseMaterialService.deleteCourseMaterial(materialId);
                    this.getCourseDetails(); 
                } catch (error) {
                    alert('Hubo un error al intentar eliminar el curso.');
                }
            }   
        },
        reorderedMaterials(materialId){
            const materialToDelete=this.course.materials.find(material=>material.id===materialId);
            const materialsToReorder=this.course.materials.filter(material=>material.order>materialToDelete.order);
            for(let material of materialsToReorder){
                material.order=material.order-1;
                CourseMaterialService.patchCourseMaterial(material.id,material);
            }
        },
        getFullName (trainer) {
            return `${trainer.user.names} ${trainer.user.last_names}`;
        },
        async moduleUp(courseModuleId) {
            try {
                this.cargando=true;
                const { data } = await CourseModuleService.getCourseModuleDetails(courseModuleId);
                const moduleToUp = data.data; ;
                if (moduleToUp.order === 1) {
                    alert("Esta módulo ya tiene N° de orden 1");
                    this.cargando=false;
                    return;
                }
                const { data: modulesData } = await CourseModuleService.getCourseModules();
                const moduleToDown = modulesData.data.find(module => module.order === (moduleToUp.order - 1)&& module.course_id === moduleToUp.course_id);
                moduleToDown.order=moduleToUp.order
                moduleToUp.order=moduleToUp.order-1;
                await CourseModuleService.patchCourseModule(moduleToDown.id, moduleToDown);
                await CourseModuleService.patchCourseModule(moduleToUp.id,moduleToUp);
                this.getCourseDetails();
            } catch (error) {
                console.error( error);
            }finally{
                this.cargando=false;
            }
        },
        async moduleDown(courseModuleId) {
            try {
                this.cargando = true;
                const { data } = await CourseModuleService.getCourseModuleDetails(courseModuleId);
                const moduleToDown = data.data;
                if (moduleToDown.order === this.course.modules.length) {
                    alert("Este módulo ya tiene el último N° de orden");
                    this.cargando=false;
                    return;
                }
                const { data: modulesData } = await CourseModuleService.getCourseModules();
                const allModules = modulesData.data;
                const moduleToUp = allModules.find(module => module.order === (moduleToDown.order + 1)&&module.course_id === moduleToDown.course_id);
                moduleToUp.order=moduleToDown.order;
                moduleToDown.order=moduleToDown.order+1;
                await CourseModuleService.patchCourseModule(moduleToUp.id, moduleToUp);
                await CourseModuleService.patchCourseModule(moduleToDown.id,moduleToDown);

                this.getCourseDetails();
            } catch (error) {
                console.error(error);
            } finally {
                this.cargando = false;
            }
        },
        async createNewEvaluation(){
            try{
                this.cargando=true;
                this.newEvaluation.course_id=this.course.id;
                await EvaluationService.postEvaluation(this.newEvaluation);
                this.getCourseDetails();
            }catch(error){
                console.log(error);
            }finally{
                this.cargando=false;
            }
        },
        async createNewModule(){
            try{
                this.cargando=true;
                const response=await ModuleService.postModule(this.newModule);
                const module_id=response.data.data.id;
                this.newCourseModule.course_id=this.course.id;
                this.newCourseModule.module_id=module_id;
                this.newCourseModule.order=this.course.modules.length+1;
                await CourseModuleService.postCourseModule(this.newCourseModule);
                this.getCourseDetails();
            }catch(error){
                console.log(error);
            }finally{
                this.cargando=false;
            }
        },
        handleFileUpload(event) {
            const file = event.target.files[0];  
            if (file) {
                this.newMaterial.file=file; 
            }
        },
        async createMaterial() {
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
                    const response=await MaterialService.postMaterial(formData);
                    const materialId=response.data.data.id;
                    this.newCourseMaterial.material_id=materialId;
                    this.newCourseMaterial.course_id=this.course.id;
                    this.newCourseMaterial.order=this.course.materials.length+1;
                    await CourseMaterialService.postCourseMaterial(this.newCourseMaterial);
                    this.$router.push({name: 'CursoDetalleVer',params: { idcurso: this.idcurso },});
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
    async getMaterialsLinked(){
            this.materialsList=[];
            for(let material of this.course.materials){
                const response=await CourseMaterialService.getCourseMaterialDetails(material.id);
                this.materialsList.push(response.data.data);
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
        async getAvailableMaterials() {
            this.availableMaterials = [];
            try {
                const response = await MaterialService.getMaterials();
                const allMaterials = response.data.data; 
                const linkedMaterialIds = this.course.materials.map(m => m.material_id);
                this.availableMaterials = allMaterials.filter(m => !linkedMaterialIds.includes(m.id));

            } catch (error) {
                console.error("Error al obtener materiales disponibles:", error);
                this.availableMaterials = [];
            }
        },

        addMaterialToCourse(){
            for(let material of this.selectedMaterials){
                let newCourseMaterial = {
                    course_id:this.idcurso,
                    material_id:material.id,
                    order:this.course.materials.length+1
                }
                CourseMaterialService.postCourseMaterial(newCourseMaterial);
            }
            this.selectedMaterials = [];
            this.getCourseDetails(this.id);
        },
        async changeStatus(id){
            const response= await EvaluationService.getEvaluationDetails(id);
            this.evaluation=response.data.data;
            if(this.evaluation.state==="activo"){
                this.evaluation.state='inactivo'
            }
            else{
                this.evaluation.state='activo'
            }
            try{
                this.cargando=true
                await EvaluationService.patchEvaluation(id,this.evaluation);
                this.getCourseDetails();
            }catch(err){
                console.log(err);
            }
            finally{
                this.cargando=false;
            }
        },
        evaluationDetail(evaluationId,courseId){
            this.$router.push({ name: 'EvaluacionDetallesVer', params: { idevaluacion: evaluationId, idcurso: courseId } });
        }

    }
};
</script>
