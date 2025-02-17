<script setup>
import { reactive,computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";


import SidenavItem from "./SidenavItem.vue";
// import SidenavCard from "./SidenavCard.vue";

const store = useStore();
const isRTL = computed(() => store.state.isRTL);
const state = reactive({
  dropdownOpen: false
});

const getRoute = () => {
  const route = useRoute();
  const routeArr = route.path.split("/");
  return routeArr[1];
};
</script>
<template>
  <div
    class="collapse navbar-collapse w-auto h-auto h-100"
    id="sidenav-collapse-main"
  >
    <ul class="navbar-nav">
      <li class="nav-item">
        <sidenav-item
          to="/dashboard-default"
          :class="getRoute() === 'dashboard-default' ? 'active' : ''"
          :navText="isRTL ? 'لوحة القيادة' : 'Dashboard'"
        >
          <template v-slot:icon>
            <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item dropdown" @mouseenter="state.dropdownOpen = true" @mouseleave="state.dropdownOpen = false">
        <a class="nav-link d-flex align-items-center" href="#" @click.prevent="state.dropdownOpen = !state.dropdownOpen">
          <i class="ni ni-calendar-grid-58 text-warning text-sm opacity-10 me-2"></i>
          <span>{{ isRTL ? 'الجداول' : 'Administrar Cursos' }}</span>
          <i class="ms-auto" :class="state.dropdownOpen ? 'ni ni-bold-down' : 'ni ni-bold-right'"></i>
        </a>
        <ul v-if="state.dropdownOpen" class="dropdown-menu show" style="display: block; position: relative;">
          <li>
            <sidenav-item to="/AdminCursos/Categorias" :class="getRoute() === 'Categorias' ? 'active' : ''" :navText="isRTL ? 'الجدول الأساسي' : 'Categorías'" />
          </li>
          <li>
            <sidenav-item to="/AdminCursos/Cursos" :class="getRoute() === 'Cursos' ? 'active' : ''" :navText="isRTL ? 'الجدول المتقدم' : 'Cursos'" />
          </li>
          <li>
            <sidenav-item to="/AdminCursos/Materiales" :class="getRoute() === 'Materiales' ? 'active' : ''" :navText="isRTL ? 'الجدول المتقدم' : 'Materiales'" />
          </li>
          <li>
            <sidenav-item to="/AdminCursos/Modulos" :class="getRoute() === 'Modulos' ? 'active' : ''" :navText="isRTL ? 'الجدول المتقدم' : 'Modulos'" />
          </li>
          <li>
            <sidenav-item to="/AdminCursos/Capacitadores" :class="getRoute() === 'Capacitadores' ? 'active' : ''" :navText="isRTL ? 'الجدول المتقدم' : 'Capacitadores'" />
          </li>
        </ul>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/billing"
          :class="getRoute() === 'billing' ? 'active' : ''"
          :navText="isRTL ? 'الفواتیر' : 'Alumnos'"
        >
          <template v-slot:icon>
            <i class="ni ni-app text-success text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/virtual-reality"
          :class="getRoute() === 'virtual-reality' ? 'active' : ''"
          :navText="isRTL ? 'الواقع الافتراضي' : 'Matrículas'"
        >
          <template v-slot:icon>
            <i class="ni ni-app text-info text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/rtl-page"
          :class="getRoute() === 'rtl-page' ? 'active' : ''"
          navText="Certificados"
        >
          <template v-slot:icon>
            <i class="ni ni-world-2 text-danger text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/virtual-reality"
          :class="getRoute() === 'virtual-reality' ? 'active' : ''"
          :navText="isRTL ? 'الواقع الافتراضي' : 'Pagos'"
        >
          <template v-slot:icon>
            <i class="ni ni-credit-card text-info text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      
      <li class="nav-item">
        <sidenav-item
          to="/virtual-reality"
          :class="getRoute() === 'virtual-reality' ? 'active' : ''"
          :navText="isRTL ? 'الواقع الافتراضي' : 'Usuarios'"
        >
          <template v-slot:icon>
            <i class="ni ni- text-info text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      
    </ul>
  </div>

</template>
