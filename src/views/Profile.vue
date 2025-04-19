<script setup>
import { ref, reactive, computed, onMounted, onBeforeMount, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

import setNavPills from "@/assets/js/nav-pills.js";
import setTooltip from "@/assets/js/tooltip.js";
import UserService from '@/services/UsersService';

import ArgonButton from "@/components/ArgonButton.vue";

const body = document.getElementsByTagName("body")[0];

const route = useRoute();
const store = useStore();

const userState = reactive({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("access_token") || null,
});

const form = ref({
  names: '',
  last_names: '',
  email: '',
  password: '',
  role: '',
  status: '',
  phone_number: '',
  birthday_date: '',
  country: '',
  city: '',
  address_type: '',
  address: '',
  address_number: '',
  document_type: '',
  document_number: '',
  gender: '',
  photo: '',
  speciality: '',
  biography: '',
});

const isViewing = ref(route.name === "UsuarioDetallesVer");
const isEditing = ref(route.name === "UsuarioDetallesEditar");
const password = ref('');
const password_confirm = ref('');
const error = ref('');
const loading = ref(false);
const imagePreview = ref(null);

onMounted(() => {
  store.state.isAbsolute = true;
  setNavPills();
  setTooltip();

  if (userState.user) {
    Object.keys(form.value).forEach(key => {
      form.value[key] = userState.user[key] ?? '';
    });
  }
});

onBeforeMount(() => {
  store.state.imageLayout = "profile-overview";
  store.state.showNavbar = false;
  store.state.showFooter = true;
  store.state.hideConfigButton = true;
  body.classList.add("profile-overview");
});

onBeforeUnmount(() => {
  store.state.isAbsolute = false;
  store.state.imageLayout = "default";
  store.state.showNavbar = true;
  store.state.showFooter = true;
  store.state.hideConfigButton = false;
  body.classList.remove("profile-overview");
});

const passwordMismatch = computed(() => {
  return password.value && password.value !== password_confirm.value;
});

const previewImage = (file) => {
  const reader = new FileReader();
  reader.onloadend = () => {
    imagePreview.value = reader.result;
  };
  if (file) reader.readAsDataURL(file);
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.value.photo = file;
    previewImage(file);
  }
};

const getImagenUrl = (image) => {
  if (image) {
    return import.meta.env.VITE_API_URL + "/storage/" + image;
  }
};
const edituser=()=>{
  isEditing.value = true;
  isViewing.value = false;
};

const cancelEdit = () => {
  isEditing.value = false;
  isViewing.value = true;
};

const updateUser = async () => {
  if (passwordMismatch.value) return;

  try {
    loading.value = true;
    error.value = '';

    const formDataUser = new FormData();
    Object.entries(form.value).forEach(([key, value]) => {
      if (key === 'photo' && value instanceof File) {
        formDataUser.append(key, value);
      } else if (key !== 'password') {
        formDataUser.append(key, value);
      }
    });

    if (password.value && password.value.trim() !== '') {
      formDataUser.append('password', password.value);
    }
    console.log(userState.user.id)

    const response = await UserService.patchUser(userState.user.id, formDataUser);
    console.log(response)
    
    if (response.status === 200 && response.data.data) {
      userState.user = response.data.data;
      localStorage.setItem("user", JSON.stringify(response.data.data));

      isEditing.value = false;
      isViewing.value = true;
    } else {
      error.value = "La actualización no se completó correctamente.";
    }

  } catch (err) {
    if (err.response?.data?.errors) {
      error.value = Object.values(err.response.data.errors).flat().join(" ");
    } else {
      error.value = "Ocurrió un error al actualizar.";
    }
  } finally {
    loading.value = false;
  }
};

</script>

<template>
  <main>
    <div class="container-fluid">
      <div
        class="page-header min-height-300"
        style="
          background-image: url(&quot;https://images.unsplash.com/photo-1531512073830-ba890ca4eba2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80&quot;);
          margin-right: -24px;
          margin-left: -34%;
        "
      >
        <span class="mask bg-gradient-success opacity-6"></span>        
      </div>
      <div class="card shadow-lg mt-n6">
        <div class="card-body p-3">
          <div class="row gx-4">
            <div class="col-auto">
              <div class="avatar avatar-xl position-relative">
                <img
                  :src="getImagenUrl(form.photo)"
                  alt="profile_image"
                  class="shadow-sm w-100 border-radius-lg"
                />
              </div>
            </div>
            <div class="col-auto my-auto">
              <div class="h-100">
                <h5 class="mb-1">{{form.names}} {{ form.last_names }}</h5>
                <p class="mb-0 font-weight-bold text-sm">{{form.role}}</p>
              </div>
            </div>            
          </div>
        </div>
      </div>
    </div>
    <div class="p-4 container-fluid">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header pb-0">
              <div class="d-flex align-items-center">
                <h1 class="fs-4 mb-0">Perfil del Usuario</h1>
                <argon-button color="success" size="sm" class="ms-auto" @click="edituser()"
                  >Editar</argon-button
                >
              </div>
            </div>
            <div class="card-body">
              <form @submit.prevent="updateUser">
                <fieldset>
                  <legend class="fs-5">Datos personales</legend>
                  <div class="form-group">
                      <label for="names">Nombres</label>
                      <input type="text" class="form-control" id="names" v-model="form.names" placeholder="Nombres" :readonly="!isEditing"/>
                  </div>
                  <div class="form-group">
                      <label for="last_names">Apellidos</label>
                      <input type="text" class="form-control" id="last_names" v-model="form.last_names" placeholder="Apellidos" :readonly="!isEditing"/>
                  </div>
                  <div class="form-group">
                      <label for="email">Correo</label>
                      <input type="email" class="form-control" id="email" v-model="form.email" placeholder="Correo" :readonly="!isEditing"/>
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
                  <div class="d-flex flex-column flex-md-row gap-md-3 w-100">
                      <div class="form-group flex-grow-1">
                          <label for="birthday_date">Fecha de nacimiento</label>
                          <input type="date" class="form-control" id="birthday_date" v-model="form.birthday_date" :readonly="!isEditing"/>
                      </div>
                      <div class="form-group flex-grow-1">
                          <label for="country">País</label>
                          <input type="text" class="form-control" id="country" v-model="form.country" placeholder="País" :readonly="!isEditing"/>
                      </div>
                      <div class="form-group flex-grow-1">
                          <label for="city">Ciudad</label>
                          <input type="text" class="form-control" id="city" v-model="form.city" placeholder="Ciudad" :readonly="!isEditing"/>
                      </div>
                  </div>
                  <div class="form-group flex-grow-1">
                      <label for="role">Rol</label>
                      <select name="role" class="form-control" v-model="form.role" disabled>
                          <option value="admin">Administrador</option>
                          <option value="comercial">Comercial</option>
                          <option value="supervisor">Supervisor</option>
                          <option value="alumno">Alumno</option>
                          <option value="capacitador">Capacitador</option>
                      </select>
                  </div>
                </fieldset>
                <fieldset>
                  <legend class="fs-5">Datos de vivienda</legend>
                  <div class="d-flex flex-column flex-md-row gap-md-3 w-100">
                      <div class="form-group flex-grow-1">
                          <label for="address_type">Tipo</label>
                          <select name="address_type" class="form-control" v-model="form.address_type" :disabled="!isEditing">
                              <option value="jiron">Jr.</option>
                              <option value="avenida">Av.</option>
                              <option value="pasaje">Psj.</option>
                              <option value="prolongacion">Prol.</option>
                              <option value="calle">Calle</option>
                          </select>
                      </div>
                      <div class="form-group flex-grow-1">
                          <label for="address">Dirección</label>
                          <input type="text" class="form-control" id="address" v-model="form.address" placeholder="Calle" :readonly="!isEditing"/>
                      </div>
                      <div class="form-group flex-grow-1">
                          <label for="address_number">N°/Mzn/Lt</label>
                          <input type="text" class="form-control" id="address_number" v-model="form.address_number" placeholder="Número" :readonly="!isEditing"/>
                      </div>
                  </div>
                </fieldset>
                <fieldset>
                  <legend class="fs-5">Datos de contacto</legend>
                  <div class="form-group">
                      <label for="phone_number">Teléfono</label>
                      <input type="text" class="form-control" id="phone_number" v-model="form.phone_number" placeholder="Teléfono" :readonly="!isEditing"/>
                  </div>
                </fieldset>
                <fieldset>
                  <legend class="fs-5">Datos de documento</legend>
                  <div class="d-flex flex-column flex-md-row gap-md-3 w-100">
                      <div class="form-group flex-grow-1">
                          <label for="document_type">Tipo</label>
                          <select name="document_type" class="form-control" v-model="form.document_type" :disabled="!isEditing">
                              <option value="pasaporte">Pasaporte</option>
                              <option value="dni">DNI</option>
                              <option value="cedula">Cédula de identidad</option>
                          </select>
                      </div>
                      <div class="form-group flex-grow-1">
                          <label for="document_number">Número</label>
                          <input type="text" class="form-control" id="document_number" v-model="form.document_number" placeholder="Número de documento" :readonly="!isEditing"/>
                      </div>
                      <div class="form-group flex-grow-1">
                          <label for="gender">Género</label>
                          <select name="gender" class="form-control" v-model="form.gender" :disabled="!isEditing">
                              <option value="M">Masculino</option>
                              <option value="F">Femenino</option>
                          </select>
                      </div>
                  </div>
                </fieldset>
                <fieldset>
                  <legend class="fs-5">Otros datos</legend>
                  <div class="form-group">
                      <label for="speciality">Especialidad</label>
                      <input type="text" class="form-control" id="speciality" v-model="form.speciality" placeholder="Especialidad" :readonly="!isEditing"/>
                  </div>
                  <div class="form-group">
                      <label for="biography">Biografía</label>
                      <textarea id="biography" class="form-control" v-model="form.biography" placeholder="Biografía del usuario" :readonly="!isEditing"></textarea> 
                  </div>
                  <div class="form-group" v-if="isEditing">
                      <label for="image">Imagen</label>
                      <input type="file" class="form-control" id="image" @change="handleImageUpload" >
                      <div v-if="imagePreview">
                          <img :src="imagePreview" alt="Vista previa" class="img-fluid mt-2" />
                      </div>
                  </div>
                </fieldset>
                <div v-show="error" class="error text-danger mt-2" role="alert">
                    <small>{{ error }}</small>
                </div>
                <div v-if="isEditing" class="d-flex gap-3 mt-3">
                    <button type="submit" class="btn btn-cyan">{{ loading ? "Actualizando..." : "Actualizar" }}</button>
                    <button type="button" class="btn btn-black" @click="cancelEdit()">Cancelar</button>
                </div>
            </form>
            <div class="d-flex flex-column w-lg-50 w-md-70 w-100" v-if="isViewing&& form.photo">
                        <label>Imagen de perfil</label>
                        <img :src="getImagenUrl(form.photo)" class="card-img mb-3" alt="Foto perfil"/>
                    </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  </main>
</template>
