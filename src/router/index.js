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
import Categorias from "../views/aministrador/adminCursos/categorias/Categorias.vue"
import Materiales from "../views/aministrador/adminCursos/Materiales.vue";
import Modulos from "../views/aministrador/adminCursos/Modulos.vue";
import Capacitadores from "../views/aministrador/adminCursos/Capacitadores.vue";
import CategoriaDetalle from "../views/aministrador/adminCursos/categorias/CategoriaDetalle.vue";
import CategoriaNueva from "../views/aministrador/adminCursos/categorias/CategoriaNueva.vue";
import CursoDetalle from "../views/aministrador/adminCursos/CursoDetalle.vue";
import CategoriaEditar from "../views/aministrador/adminCursos/CategoriaEditar.vue";
import CursoNuevo from "../views/aministrador/adminCursos/CursoNuevo.vue";
import CursoEditar from "../views/aministrador/adminCursos/CursoEditar.vue";
import MaterialDetalle from "../views/aministrador/adminCursos/MaterialDetalle.vue";
import MaterialEditar from "../views/aministrador/adminCursos/MaterialEditar.vue";
import MaterialNuevo from "../views/aministrador/adminCursos/MaterialNuevo.vue";
import ModuloDetalle from "../views/aministrador/adminCursos/ModuloDetalle.vue";
import ModuloNuevo from "../views/aministrador/adminCursos/ModuloNuevo.vue";
import ModuloEditar from "../views/aministrador/adminCursos/ModuloEditar.vue";

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
  //routes categorias
  {
    path:"/admincursos/categorias",
    name:"Categorias",
    component: Categorias,
  },
  {
    path:"/admincursos/categorias/:idcategoria?/ver",
    name:"CategoriaDetalleVer",
    component: CategoriaDetalle,
  },
  {
    path:"/admincursos/categorias/:idcategoria?/editar",
    name:"CategoriaDetalleEditar",
    component: CategoriaDetalle,
  },
 /* {
    path: '/AdminCursos/DetalleCategoria/:id',
    name: 'CategoriaDetalle',
    component: CategoriaDetalle, 
    props: true
  },*/
  {
    path:'/AdminCursos/categorias/nueva',
    name:'NuevaCategoria',
    component: CategoriaNueva,
  },
  {
    path:'/AdminCursos/EditarCategoria/:id',
    name:'EditarCategoria',
    component: CategoriaEditar,
    props:true
  },
  //routes cursos
  {
    path:"/AdminCursos/Cursos",
    name: "Cursos",
    component: Cursos,
  },
  {
    path: '/AdminCursos/DetalleCurso/:id',
    name: 'CursoDetalle',
    component: CursoDetalle, 
    props: true
  },
  {
    path:'/AdminCursos/EditarCurso/:id',
    name:'EditarCurso',
    component: CursoEditar,
    props:true
  },
  {
    path: '/AdminCursos/NuevoCurso',
    name: 'CursoNuevo',
    component: CursoNuevo,
  },
  //routes materials
  {
    path:"/AdminCursos/Materiales",
    name:"Materiales",
    component: Materiales,
  },
  {
    path: '/AdminCursos/DetalleMaterial/:id',
    name: 'MaterialDetalle',
    component: MaterialDetalle, 
    props: true
  },
  {
    path:'/AdminCursos/EditarMaterial/:id',
    name:'EditarMaterial',
    component: MaterialEditar,
    props:true
  },
  {
    path: '/AdminCursos/NuevoMaterial',
    name: 'MaterialNuevo',
    component: MaterialNuevo,
  },
  //routes moudules
  {
    path:"/AdminCursos/Modulos",
    name:"Modulos",
    component: Modulos,
  },
  {
    path: '/AdminCursos/DetalleModulo/:id',
    name: 'ModuloDetalle',
    component: ModuloDetalle, 
    props: true
  },
  {
    path: '/AdminCursos/NuevoModulo',
    name: 'ModuloNuevo',
    component: ModuloNuevo,
  },
  {
    path:'/AdminCursos/EditarModulo/:id',
    name:'EditarModulo',
    component: ModuloEditar,
    props:true
  },
  //routes capacitadores
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
