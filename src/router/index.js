import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Tables from "../views/Tables.vue";
import Billing from "../views/Billing.vue";
import VirtualReality from "../views/VirtualReality.vue";
import RTL from "../views/Rtl.vue";
import Profile from "../views/Profile.vue";
import Signup from "../views/Signup.vue";
import Signin from "../views/Signin.vue";
import Cursos from "../views/aministrador/adminCursos/Cursos.vue"
import Categorias from "../views/aministrador/adminCursos/Categorias.vue"
import Materiales from "../views/aministrador/adminCursos/Materiales.vue";
import Modulos from "../views/aministrador/adminCursos/Modulos.vue";
import Capacitadores from "../views/aministrador/adminCursos/Capacitadores.vue";
import CategoriaDetalle from "../views/aministrador/adminCursos/CategoriaDetalle.vue";
import CategoriaNueva from "../views/aministrador/adminCursos/CategoriaNueva.vue";

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/dashboard-default",
  },
  {
    path: "/dashboard-default",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/tables",
    name: "Tables",
    component: Tables,
  },
  {
    path: "/billing",
    name: "Billing",
    component: Billing,
  },
  {
    path: "/virtual-reality",
    name: "Virtual Reality",
    component: VirtualReality,
  },
  {
    path: "/rtl-page",
    name: "RTL",
    component: RTL,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/signin",
    name: "Signin",
    component: Signin,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
  //  
  {
    path:"/AdminCursos/Categorias",
    name:"Categorias",
    component: Categorias,
  },
  {
    path: '/AdminCursos/CategoriaDetalle/:id',
    name: 'CategoriaDetalle',
    component: CategoriaDetalle, 
    props: true
  },
  {
    path:'/AdminCursos/CategoriaNueva',
    name:'NuevaCategoria',
    component: CategoriaNueva,
  },
  {
    path:"/AdminCursos/Cursos",
    name: "Cursos",
    component: Cursos,
  },
  {
    path:"/AdminCursos/Materiales",
    name:"Materiales",
    component: Materiales,
  },
  {
    path:"/AdminCursos/Modulos",
    name:"Modulos",
    component: Modulos,
  },
  {
    path:"/AdminCursos/Capacitadores",
    name:"Capacitadores",
    component: Capacitadores,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

export default router;
