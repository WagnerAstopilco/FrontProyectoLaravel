import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
// import Tables from "../views/Tables.vue";
// import Billing from "../views/Billing.vue";
// import VirtualReality from "../views/VirtualReality.vue";
// import RTL from "../views/Rtl.vue";
import Profile from "../views/Profile.vue";
import Signup from "../views/Signup.vue";
import Signin from "../views/Signin.vue";
import Categorias from "../views/administrador/adminCursos/categorias/Categorias.vue"
import CategoriaNueva from "../views/administrador/adminCursos/categorias/CategoriaNueva.vue";
import CategoriaDetalle from "../views/administrador/adminCursos/categorias/CategoriaDetalle.vue";
import Cursos from "../views/administrador/adminCursos/cursos/Cursos.vue"
import CursoNuevo from "../views/administrador/adminCursos/cursos/CursoNuevo.vue";
import CursoDetalle from "../views/administrador/adminCursos/cursos/CursoDetalle.vue";
import Materiales from "../views/administrador/adminCursos/materiales/Materiales.vue";
import MaterialNuevo from "../views/administrador/adminCursos/materiales/MaterialNuevo.vue";
import MaterialDetalle from "../views/administrador/adminCursos/materiales/MaterialDetalle.vue";
import Modulos from "../views/administrador/adminCursos/modulos/Modulos.vue";
import ModuloNuevo from "../views/administrador/adminCursos/modulos/ModuloNuevo.vue";
import ModuloDetalle from "../views/administrador/adminCursos/modulos/ModuloDetalle.vue";
import Capacitadores from "../views/administrador/adminCursos/capacitadores/Capacitadores.vue";
import CapacitadorNuevo from "../views/administrador/adminCursos/capacitadores/CapacitadorNuevo.vue";
import CapacitadorDetalle from "../views/administrador/adminCursos/capacitadores/CapacitadorDetalle.vue";
import Alumnos from "../views/administrador/alumnos/Alumnos.vue";
import AlumnoNuevo from "../views/administrador/alumnos/AlumnoNuevo.vue";
import AlumnoDetalles from "../views/administrador/alumnos/AlumnoDetalles.vue";
import Certificados from "../views/administrador/certificados/Certificados.vue";
import CertificadoNuevo from "../views/administrador/certificados/CertificadoNuevo.vue";
import CertificadoDetalles from "../views/administrador/certificados/CertificadoDetalles.vue";
import Matriculas from "../views/administrador/matriculas/Matriculas.vue";
import MatriculaNueva from "../views/administrador/matriculas/MatriculaNueva.vue";
import MatriculaDetalles from "../views/administrador/matriculas/MatriculaDetalles.vue";
import Administradores from "../views/administrador/administradores/Administradores.vue";
import AdministradorNuevo from "../views/administrador/administradores/AdministradorNuevo.vue";
import AdministradorDetalles from "../views/administrador/administradores/AdministradorDetalles.vue";
import Pagos from "../views/administrador/Pagos/Pagos.vue";
import PagoNuevo from "../views/administrador/Pagos/PagoNuevo.vue";
import PagoDetalles from "../views/administrador/Pagos/PagoDetalles.vue";

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
  // {
  //   path: "/tables",
  //   name: "Tables",
  //   component: Tables,
  // },
  // {
  //   path: "/billing",
  //   name: "Billing",
  //   component: Billing,
  // },
  // {
  //   path: "/virtual-reality",
  //   name: "Virtual Reality",
  //   component: VirtualReality,
  // },
  // {
  //   path: "/rtl-page",
  //   name: "RTL",
  //   component: RTL,
  // },
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
    path:'/admincursos/cursos/:idcurso?/editar',
    name:'CursoDetalleEditar',
    component: CursoDetalle,
  },
  {
    path: '/admincursos/cursos/nuevo',
    name: 'CursoNuevo',
    component: CursoNuevo,
  },
  //routes materials
  {
    path:"/admincursos/materiales",
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
    path:'/admincursos/materiales/:idmaterial?/editar',
    name:'MaterialDetalleEditar',
    component: MaterialDetalle,
    props:true
  },
  {
    path: '/admincursos/materailes/nuevo',
    name: 'MaterialNuevo',
    component: MaterialNuevo,
  },
  //routes moudules
  {
    path:"/admincursos/modulos",
    name:"Modulos",
    component: Modulos,
  },
  {
    path: '/admincursos/modulos/:idmodulo?/ver',
    name: 'ModuloDetalleVer',
    component: ModuloDetalle,
  },
  {
    path: '/admincursos/modulos/nuevo',
    name: 'ModuloNuevo',
    component: ModuloNuevo,
  },
  {
    path:'/admincursos/modulos/:idmodulo?/editar',
    name:'ModuloDetalleEditar',
    component: ModuloDetalle,
  },
  //routes capacitadores
  {
    path:"/admincursos/capacitadores",
    name:"Capacitadores",
    component: Capacitadores,
  },
  {
    path:"/admincursos/capacitadores/:idcapacitador?/ver",
    name:'CapacitadorDetallesVer',
    component:CapacitadorDetalle,
  },
  {
    path:"/admincursos/capacitadores/:idcapacitador?/editar",
    name:'CapacitadorDetallesEditar',
    component:CapacitadorDetalle,
  },
  {
    path:"/admincursos/capacitadores/nuevo",
    name:'CapacitadorNuevo',
    component:CapacitadorNuevo,
  },
  //routes alumnos
  {
    path:'/alumnos',
    name:'Alumnos',
    component:Alumnos,
  },
  {
    path:'/alumnos/nuevo',
    name:'AlumnoNuevo',
    component: AlumnoNuevo,
  },
  {
    path:'/alumnos/:idalumno?/ver',
    name: 'AlumnoDetallesVer',
    component:AlumnoDetalles,
  },
  {
    path:'/alumnos/:idalumno?/editar',
    name: 'AlumnoDetallesEditar',
    component:AlumnoDetalles,
  },
  //routes certificados
  {
    path:'/certificados',
    name:'Certificados',
    component:Certificados,
  },
  {
    path:'/certificados/nuevo',
    name:'CertificadoNuevo',
    component: CertificadoNuevo,
  },
  {
    path:'/certificados/:idcertificado?/ver',
    name: 'CertificadoDetallesVer',
    component:CertificadoDetalles,
  },
  {
    path:'/certificados/:idcertificado?/editar',
    name: 'CertificadoDetallesEditar',
    component:CertificadoDetalles,
  },
  //routes matriculas
  {
    path:'/matriculas',
    name:'Matriculas',
    component:Matriculas,
  },
  {
    path:'/matriculas/nueva',
    name:'MatriculaNueva',
    component: MatriculaNueva,
  },
  {
    path:'/matriculas/:idmatricula?/ver',
    name: 'MatriculaDetallesVer',
    component:MatriculaDetalles,
  },
  {
    path:'/matriculas/:idmatricula?/editar',
    name: 'MatriculaDetallesEditar',
    component:MatriculaDetalles,
  },
  //routes administradores
  {
    path:'/administradores',
    name:'Administradores',
    component:Administradores,
  },
  {
    path:'/administradores/nuevo',
    name:'AdministradorNuevo',
    component: AdministradorNuevo,
  },
  {
    path:'/administradores/:idadministrador?/ver',
    name: 'AdministradorDetallesVer',
    component:AdministradorDetalles,
  },
  {
    path:'/administradores/:idadministrador?/editar',
    name: 'AdministradorDetallesEditar',
    component:AdministradorDetalles,
  },
  //routes administradores
  {
    path:'/pagos',
    name:'Pagos',
    component:Pagos,
  },
  {
    path:'/pagos/nuevo',
    name:'PagoNuevo',
    component: PagoNuevo,
  },
  {
    path:'/pagos/:idpago?/ver',
    name: 'PagoDetallesVer',
    component:PagoDetalles,
  },
  {
    path:'/pagos/:idpago?/editar',
    name: 'PagoDetallesEditar',
    component:PagoDetalles,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

export default router;
