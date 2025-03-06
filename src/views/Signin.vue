<script setup>
import { onBeforeUnmount, onBeforeMount } from "vue";
import { useStore } from "vuex";
// import Navbar from "@/examples/PageLayout/Navbar.vue";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonSwitch from "@/components/ArgonSwitch.vue";
import ArgonButton from "@/components/ArgonButton.vue";
const body = document.getElementsByTagName("body")[0];

const store = useStore();
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
</script>
<template>
  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <!-- <navbar
          isBlur="blur  border-radius-lg my-3 py-2 start-0 end-0 mx-4 shadow"
          v-bind:darkMode="true"
          isBtn="bg-gradient-success"
        /> -->
      </div>
    </div>
  </div>
  <main class="mt-0 main-content">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <div
              class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0"
            >
              <div class="card card-plain">
                <div class="pb-0 card-header text-start">
                  <h4 class="font-weight-bolder">Inicio de Sesión</h4>
                  <p class="mb-0">Ingresa tu correo y contraseña para iniciar sesión</p>
                </div>
                <div class="card-body">
                  <form role="form">
                    <div class="mb-3">
                      <argon-input
                        id="email"
                        type="email"
                        placeholder="Email"
                        name="email"
                        size="lg"
                      />
                    </div>
                    <div class="mb-3">
                      <argon-input
                        id="password"
                        type="password"
                        placeholder="Password"
                        name="password"
                        size="lg"
                      />
                    </div>
                    <argon-switch id="rememberMe" name="remember-me"
                      >Recuerdame</argon-switch
                    >

                    <div class="text-center">
                      <argon-button
                        class="mt-4"
                        fullWidth
                        size="lg"
                        style="background-color: rgb(0, 87, 163)"
                        >Iniciar Sesión</argon-button
                      >
                    </div>
                  </form>
                </div>
                <div class="px-1 pt-0 text-center card-footer px-lg-2">
                  <p class="mx-auto mb-4 text-sm">
                    No tienes una cuenta?
                    <a
                      href="Signup"
                      class="font-weight-bold"
                      style="color: rgb(88, 176, 49);"
                      >Registrate</a
                    >
                  </p>
                </div>
              </div>
            </div>
            <div
              class="top-0 my-auto text-center col-6 d-lg-flex d-none h-100 pe-0 position-absolute end-0 justify-content-center flex-column"
            >
              <div
                class="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden"
                style="
                  background-image: url(&quot;https://drive.google.com/file/d/1X_fKLds2YsyayE7cEKQNCtWChiXNOUOc/view?usp=sharing&quot;);
                  background-size: cover;

                "
              >
                <span class="mask  opacity-6"><img src="/gradient login_op5.png"/></span>
                <img
                src="/JEAN_PIAGET.png" 
                alt="logo jean piaget"
                class="img-fluid position-absolute start-0 top-0 w-100 h-100 p-5" 
                style="object-fit:contain; filter:drop-shadow(0 0 10px rgba(0,0,0,.5))" 
              />
                <h4
                  class="mt-5 fs-1 text-white font-weight-bolder position-relative"
                  style="text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.5);"
                >
                  JEAN PIAGET
                </h4>
                <p class="text-white position-relative"  style="text-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);">
                  CENTRO DE CAPACITACIÓN,
                  INVESTIGACIÓN Y PROMOCIÓN
                  CULTURAL
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
