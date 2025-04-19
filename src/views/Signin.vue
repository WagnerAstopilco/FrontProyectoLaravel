<script setup>
import { ref, onBeforeUnmount,computed, onBeforeMount, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import apiClient from "../axios";
import UserService from '@/services/UsersService';

const body = document.getElementsByTagName("body")[0];

const store = useStore();
const route = useRoute();
const router = useRouter();
const isSingIn = ref(false);
const isSingUp = ref(false);

const email = ref('');
const password = ref('');

const toggleSignup = () => {
  isSingUp.value = !isSingUp.value;
  isSingIn.value = !isSingIn.value;
  router.push({ name: 'Signin' });
};

const toggleSignin = () => {
  isSingUp.value = !isSingUp.value;
  isSingIn.value = !isSingIn.value;
  router.push({ name: 'Signup' });
};

const loginWithGoogle = () => {
  window.location.href = "http://127.0.0.1:8000/auth/redirect/google";
};

const login = async (e) => {
  e.preventDefault();

  try {
    const response = await apiClient.post('/login', {
      email: email.value,
      password: password.value,
    });

    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    const user = response.data.user;
    if (user.role === 'admin') {
      await router.push({ name: 'Usuarios' });
    } else if (user.role === 'supervisor') {
      await router.push({ name: 'Capacitadores' });
    } else if (user.role === 'capacitador') {
      await router.push({ name: 'Cursos' });
    }else if (user.role === 'comercial') {
      await router.push({ name: 'Pagos' });
    }
  } catch (error) {
    console.error('Error en login:', error);
    alert('Credenciales incorrectas');
  }
};

const nombres = ref('');
const apellidos = ref('');
const emailRegistro = ref('');
const passwordRegistro = ref('');
const passwordRegistro_confirm = ref('');
const aceptaTerminos = ref(false);


const passwordRegistroMismatch = computed(() => {
  return passwordRegistro.value && passwordRegistro.value !== passwordRegistro_confirm.value;
});

const register = async (e) => {
  e.preventDefault();
  if (!aceptaTerminos.value) {
    alert('Debe aceptar los términos y condiciones para continuar');
    return;
  }

  if (passwordRegistroMismatch.value) return;

  const newUser={
    names: nombres.value,
    last_names: apellidos.value,
    email: emailRegistro.value,
    password: passwordRegistro.value,
    role: 'alumno',
    status: 'activo'
  }
  const formData = new FormData();
            formData.append("names", newUser.names);
            formData.append("last_names", newUser.last_names);
            formData.append("email", newUser.email);
            formData.append("password", newUser.password);
            formData.append("role", newUser.role);
            formData.append("status", newUser.status);

  try {
    await UserService.postUser(formData)

    alert('Usuario registrado correctamente');
    isSingIn.value = true;
    isSingUp.value = false;
    router.push({ name: 'Signin' });
  } catch (error) {
    console.error('Error al registrar:', error);
    alert('Error al registrar usuario');
  }
};

onBeforeMount(() => {
  store.state.hideConfigButton = true;
  store.state.showNavbar = false;
  store.state.showSidenav = false;
  store.state.showFooter = false;
  body.classList.remove("bg-gray-100");
});
onBeforeUnmount(() => {
  store.state.hideConfigButton = false;
  store.state.showNavbar = true;
  store.state.showSidenav = true;
  store.state.showFooter = true;
  body.classList.add("bg-gray-100");
});
onMounted(() => {
  if (route.name === 'Signin') {
    isSingIn.value = true;
  } else if (route.name === 'Signup') {
    isSingUp.value = true;
  }
});
</script>
<template>
  <main class="row gx-0 min-vh-100" style="background-image: url('/background_principal.png'); background-size: cover; background-position: center;">
    

    <div class="col-12 col-lg-6 d-flex justify-content-center justify-content-lg-end align-items-center p-4">
      <img src="/Logo_blanco.png" alt="Logo" class="img-fluid w-75 w-lg-60" />
    </div>

    <div class="col-12 col-lg-6 d-flex justify-content-center align-items-center p-4">

      <!-- Login -->
      <div 
        class="w-100 w-md-75 w-lg-60 rounded-3 p-4 p-md-5 d-flex flex-column align-items-center text-center justify-content-center"
        style="background-color:rgb(2,33,96);"
        v-if="isSingIn"
      >
        <h2 class="fs-2 text-white mb-3">Iniciar Sesión</h2>

        <button class="btn btn-outline-secondary w-100 mb-3" @click="loginWithGoogle">
          <img src="/google-icon.png" alt="Google" /> Iniciar Sesión Con Google
        </button>

        <p class="text-white my-3 position-relative">o ingresar con Email</p>

        <form @submit="login" class="w-100">
          <input type="email" v-model="email" class="form-control bg-transparent text-white border-white mb-3" placeholder="Email" required />
          <input type="password" v-model="password" class="form-control bg-transparent text-white border-white mb-3" placeholder="Password" required />

          <div class="remember-me p-2 d-flex justify-content-center">
            <label for="remember" style="color:rgb(88,176,49)">
              <input type="checkbox" id="remember" />
              <span class="custom-checkbox"></span>
              Recordar Contraseña
            </label>
          </div>

          <div class="d-flex justify-content-center">
            <button type="submit" class="btn w-50 text-white" style="background-color:rgb(29,176,215)">Iniciar Sesión</button>
          </div>
        </form>

        <div class="mt-4">
          <a href="/forgotPass" class="text-white d-block mb-2">¿Olvidaste la contraseña?</a>
          <p class="text-white">¿No tienes cuenta?
            <a href="#" @click="toggleSignin" class="text-success" style="cursor:pointer">Crear Cuenta</a>
          </p>
        </div>
      </div>

      <!-- Registro -->
      <div 
        class="w-100 w-md-75 w-lg-60 rounded-3 p-4 p-md-5 d-flex flex-column align-items-center text-center justify-content-center"
        style="background-color:rgb(2,33,96);"
        v-if="isSingUp"
      >
        <h2 class="fs-2 text-white mb-3">Crear cuenta</h2>

        <button class="btn btn-outline-secondary w-100 mb-3" @click="loginWithGoogle">
          <img src="/google-icon.png" alt="Google" /> Crear Cuenta Con Google
        </button>

        <p class="text-white my-3 position-relative">o ingresar con Email</p>

        <form @submit="register" class="w-100">
          <input type="text" v-model="nombres" class="form-control bg-transparent text-white border-white mb-2" placeholder="Nombres" required />
          <input type="text" v-model="apellidos" class="form-control bg-transparent text-white border-white mb-2" placeholder="Apellidos" required />
          <input type="email" v-model="emailRegistro" class="form-control bg-transparent text-white border-white mb-2" placeholder="Correo" required />
          <input type="password" v-model="passwordRegistro" class="form-control bg-transparent text-white border-white mb-2" placeholder="Contraseña" required />
          <input type="password" v-model="passwordRegistro_confirm" class="form-control bg-transparent text-white border-white mb-2" placeholder="Confirmar Contraseña" required />

          <div class="remember-me p-2 d-flex justify-content-center align-items-center">
            <label for="remember" style="color:white">
              <input type="checkbox" id="remember" v-model="aceptaTerminos" />
              <span class="custom-checkbox-singup"></span>
              Yo acepto, los
              <a href="#" style="color:rgb(88,176,49)">términos y condiciones</a>
            </label>
          </div>

          <div class="d-flex justify-content-center">
            <button type="submit" class="btn w-50 text-white" style="background-color:rgb(29,176,215)">Crear Cuenta</button>
          </div>
        </form>

        <div class="mt-4">
          <p class="text-white">¿Ya tienes una cuenta?
            <a href="#" @click="toggleSignup" class="text-success" style="cursor:pointer">Inicia Sesión</a>
          </p>
        </div>
      </div>

    </div>
  </main>
</template>



<style scoped>
.divider {
    display: flex;
    align-items: center;
    text-align: center;
    color: white; 
    font-size: 14px;
    margin: 20px 0;
}

.divider .line {
    flex-grow: 1;
    height: 1px;
    background-color: white; 
    margin: 0 5px;
}
.remember-me {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: white; 
}

.remember-me label {
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 8px;
}


.remember-me input[type="checkbox"] {
    display: none;
}


.custom-checkbox {
    width: 16px;
    height: 16px;
    border: 2px solid #58B031; 
    border-radius: 50%; 
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}


.remember-me input[type="checkbox"]:checked + .custom-checkbox::after {
    content: "✔";
    font-size: 12px;
    color: #58B031; 
    font-weight: bold;
}

.custom-checkbox-singup {
    width: 16px;
    height: 16px;
    border: 2px solid #ffffff; 
    border-radius: 50%; 
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}


.remember-me input[type="checkbox"]:checked + .custom-checkbox-singup::after {
    content: "✔";
    font-size: 12px;
    color: #ffffff; 
    font-weight: bold;
}

</style>