<script setup>
import { ref,onBeforeUnmount, onBeforeMount, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute,useRouter } from "vue-router";
// import Navbar from "@/examples/PageLayout/Navbar.vue";
// import ArgonInput from "@/components/ArgonInput.vue";
// import ArgonSwitch from "@/components/ArgonSwitch.vue";
// import ArgonButton from "@/components/ArgonButton.vue";
const body = document.getElementsByTagName("body")[0];

const store = useStore();
const route = useRoute();
const router = useRouter();
const isSingIn = ref(false);
const isSingUp = ref(false);
const toggleSignup = () => {
  isSingUp.value = !isSingUp.value;
  isSingIn.value = !isSingIn.value;
  router.push({name:'Signin'})
};
const toggleSignin = () => {
  isSingUp.value = !isSingUp.value;
  isSingIn.value = !isSingIn.value;
  router.push({name:'Signup'})
};
const goToDashboard=()=>{
  router.push({name:'Dashboard'})
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
onMounted(()=>{
  if (route.name === 'Signin') {
      isSingIn.value = true;
  } else if (route.name === 'Signup') {
      isSingUp.value = true;
  }
});
</script>
<template>
  <main class="d-flex" style="background-image: url('/background_principal.png'); background-size: cover; background-position: center;">
    <div class="min-vh-100 col-6 d-flex justify-content-end align-items-center">
      <img src="/Logo_blanco.png" alt="" class="w-60">
    </div>

    <div class="min-vh-100 col-6 d-flex justify-content-center align-items-center">
      <div class="col-6 min-vh-70 rounded-3 p-5 d-flex flex-column align-items-center text-center justify-content-center" style="background-color:rgb(2,33,96);" v-if="isSingIn">
        <h2 class="fs-2 p-2" style="color:white">Iniciar Sesión</h2>
        
        <button class="btn btn-outline-secondary w-80">
            <img src="/google-icon.png" alt="Google"> Iniciar Sesión Con Google
        </button>
        <div class="mt-2 position-relative text-center">
          <p
            class="text-sm font-weight-bold mb-2  text-border d-inline z-index-2 text-white px-7" 
          >
            o ingresar con Email
          </p>
        </div>
        <form>
            
          <input type="email" class="w-80 m-3 p-2 rounded-3 bg-transparent text-white border-white" placeholder="Email" required>
          <input type="password" class="w-80 m-3 p-2 rounded-3 bg-transparent text-white border-white" placeholder="Password" required>
          <div class="remember-me p-2  d-flex justify-content-center">
            <label for="remember" style="color:rgb(88,176,49)" >
                <input type="checkbox" class="" id="remember">
                <span class="custom-checkbox"></span>
                Recordar Contraseña
            </label>
          </div>
          <div class="m-2">            
            <button type="submit" @click="goToDashboard" class="btn btn-primary w-50" style="background-color:rgb(29,176,215)">Iniciar Sesión</button>
          </div>
        </form>
        
        <div class="">
            <a  class="p-3" style="color:white" href="/forgotPass">¿Olvidaste la contraseña?</a>
            <p class="p-3" style="color:white">¿No tienes cuenta? <a  href="#" @click="toggleSignin" style="color:rgb(88,176,49);cursor:pointer">Crear Cuenta</a></p>
        </div>
      </div>


      <div class="col-6 min-vh-70 rounded-3 p-5 d-flex flex-column align-items-center text-center justify-content-center" style="background-color:rgb(2,33,96);" v-if="isSingUp">
        <h2 class="fs-2 p-2" style="color:white">Crear cuenta</h2>
        
        <button class="btn btn-outline-secondary w-80">
            <img src="/google-icon.png" alt="Google"> Iniciar Sesión Con Google
        </button>
        <div class="mt-2 position-relative text-center">
          <p
            class="text-sm font-weight-bold mb-2  text-border d-inline z-index-2 text-white px-7" 
          >
            o ingresar con Email
          </p>
        </div>
        <form>
            
          <input type="email" class="w-80 m-2 p-2 rounded-3 bg-transparent text-white border-white" placeholder="Nombres" required>
          <input type="email" class="w-80 m-2 p-2 rounded-3 bg-transparent text-white border-white" placeholder="Apellidos" required>
          <input type="email" class="w-80 m-2 p-2 rounded-3 bg-transparent text-white border-white" placeholder="Correo" required>
          <input type="password" class="w-80 m-2 p-2 rounded-3 bg-transparent text-white border-white" placeholder="Contraseña" required>
          <input type="password" class="w-80 m-2 p-2 rounded-3 bg-transparent text-white border-white" placeholder="Confirmar Contraseña" required>
          <div class="remember-me p-2  d-flex justify-content-center align-items-center">
            <label for="remember" style="color:white" >
                <input type="checkbox" class="" id="remember">
                <span class="custom-checkbox-singup"></span>
                Yo acepto, los
                <a href="#"  style="color:rgb(88,176,49)">términos y condiciones</a>
            </label>
          </div>
          <div class="m-2">            
            <button type="submit" class="btn btn-primary w-50" style="background-color:rgb(29,176,215)">Crear Cuenta</button>
          </div>
        </form>
        
        <div class="">
            <p class="p-3" style="color:white">¿Ya tienes una cuenta? <a href="#" @click="toggleSignup" style="color:rgb(88,176,49);cursor:pointer">Inicia Sesión</a></p>
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