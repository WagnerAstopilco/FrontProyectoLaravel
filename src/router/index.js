import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Tables from "../views/Tables.vue";
import Billing from "../views/Billing.vue";
import VirtualReality from "../views/VirtualReality.vue";
import RTL from "../views/Rtl.vue";
import Profile from "../views/Profile.vue";
import Signup from "../views/Signup.vue";
import Signin from "../views/Signin.vue";
import Materiales from "../views/aministrador/adminCursos/materiales/Materiales.vue";
import Modulos from "../views/aministrador/adminCursos/Modulos.vue";
import Capacitadores from "../views/aministrador/adminCursos/Capacitadores.vue";
import Categorias from "../views/aministrador/adminCursos/categorias/Categorias.vue"
import CategoriaDetalle from "../views/aministrador/adminCursos/categorias/CategoriaDetalle.vue";
import CategoriaNueva from "../views/aministrador/adminCursos/categorias/CategoriaNueva.vue";
import Cursos from "../views/aministrador/adminCursos/cursos/Cursos.vue"
import CursoDetalle from "../views/aministrador/adminCursos/cursos/CursoDetalle.vue";
import CursoNuevo from "../views/aministrador/adminCursos/cursos/CursoNuevo.vue";
import MaterialDetalle from "../views/aministrador/adminCursos/materiales/MaterialDetalle.vue";
import MaterialNuevo from "../views/aministrador/adminCursos/materiales/MaterialNuevo.vue";
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
  {
    path:'/admincursos/categorias/nueva',
    name:'NuevaCategoria',
    component: CategoriaNueva,
  },
  //routes cursos
  {
    path:"/admincursos/cursos",
    name: "Cursos",
    component: Cursos,
  },
  {
    path: '/admincursos/cursos/:idcurso?/ver',
    name: 'CursoDetalleVer',
    component: CursoDetalle,
  },
  {
    path:'/admincursos/cursos/:idcurso?/Editar',
    name:'CursoDetalleEditar',
    component: CursoDetalle,
  },
  {
    path: '/admincursos/NuevoCurso',
    name: 'CursoNuevo',
    component: CursoNuevo,
  },
  //routes materials
  {
    path:"/admincursos/Materiales",
    name:"Materiales",
    component: Materiales,
  },
  {
    path: '/admincursos/materiales/:idmaterial?/ver',
    name: 'MaterialDetalleVer',
    component: MaterialDetalle, 
    props: true
  },
  {
    path:'/admincursos/materiales/:idmaterial?/Editar',
    name:'MaterialDetalleEditar',
    component: MaterialDetalle,
    props:true
  },
  {
    path: '/admincursos/NuevoMaterial',
    name: 'MaterialNuevo',
    component: MaterialNuevo,
  },
  //routes moudules
  {
    path:"/admincursos/Modulos",
    name:"Modulos",
    component: Modulos,
  },
  {
    path: '/admincursos/DetalleModulo/:id',
    name: 'ModuloDetalle',
    component: ModuloDetalle, 
    props: true
  },
  {
    path: '/admincursos/NuevoModulo',
    name: 'ModuloNuevo',
    component: ModuloNuevo,
  },
  {
    path:'/admincursos/EditarModulo/:id',
    name:'EditarModulo',
    component: ModuloEditar,
    props:true
  },
  //routes capacitadores
  {
    path:"/admincursos/Capacitadores",
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
