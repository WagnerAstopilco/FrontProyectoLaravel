import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
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
import Pagos from "../views/administrador/pagos/Pagos.vue";
import PagoNuevo from "../views/administrador/pagos/PagoNuevo.vue";
import PagoDetalles from "../views/administrador/pagos/PagoDetalles.vue";
import Usuarios from "../views/administrador/usuarios/Usuarios.vue";
import UsuarioNuevo from "../views/administrador/usuarios/UsuarioNuevo.vue";
import UsuarioDetalles from "../views/administrador/usuarios/UsuarioDetalles.vue"
import LeccionDetalles from "../views/administrador/lecciones/LeccionDetalles.vue";
import EvaluacionDetalles from "../views/administrador/evaluaciones/EvaluacionDetalles.vue";
import GoogleCallback from "../views/GoogleCallback.vue";

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/signin",
  },
  {
    path: "/dashboard-default",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true, allowedRoles: ['admin', 'capacitador'] },
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: { requiresAuth: true, allowedRoles: ['admin','supervisor','comercial', 'capacitador', 'alumno'] },
  },
  {
    path: "/signin",
    name: "Signin",
    component: Signin,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signin,
  },
  {
    path: "/forgotPass",
    name: "ForgotPass",
    component: Signup,
  },

  //routes categorias
  {
    path:"/admincursos/categorias",
    name:"Categorias",
    component: Categorias,
    meta: { requiresAuth: true, allowedRoles: ['admin','supervisor'] },
  },
  {
    path:"/admincursos/categorias/:idcategoria?/ver",
    name:"CategoriaDetalleVer",
    component: CategoriaDetalle,
    meta: { requiresAuth: true, allowedRoles: ['admin','supervisor'] },
  },
  {
    path:"/admincursos/categorias/:idcategoria?/editar",
    name:"CategoriaDetalleEditar",
    component: CategoriaDetalle,
    meta: { requiresAuth: true, allowedRoles: ['admin','supervisor'] },
  },
  {
    path:'/admincursos/categorias/nueva',
    name:'NuevaCategoria',
    component: CategoriaNueva,
    meta: { requiresAuth: true, allowedRoles: ['admin','supervisor'] },
  },
  //routes cursos
  {
    path:"/admincursos/cursos",
    name: "Cursos",
    component: Cursos,
    meta: { requiresAuth: true, allowedRoles: ['admin','capacitador'] },
  },
  {
    path: '/admincursos/cursos/:idcurso?/ver',
    name: 'CursoDetalleVer',
    component: CursoDetalle,
    meta: { requiresAuth: true, allowedRoles: ['admin','capacitador'] },
  },
  {
    path:'/admincursos/cursos/:idcurso?/editar',
    name:'CursoDetalleEditar',
    component: CursoDetalle,
    meta: { requiresAuth: true, allowedRoles: ['admin','capacitador'] },
  },
  {
    path: '/admincursos/cursos/nuevo',
    name: 'CursoNuevo',
    component: CursoNuevo,
    meta: { requiresAuth: true, allowedRoles: ['admin','capacitador'] },
  },
  //routes materials
  {
    path:"/admincursos/materiales",
    name:"Materiales",
    component: Materiales,
    meta: { requiresAuth: true, allowedRoles: ['admin','capacitador'] },
  },
  {
    path: '/admincursos/materiales/:idmaterial?/ver',
    name: 'MaterialDetalleVer',
    component: MaterialDetalle, 
    meta: { requiresAuth: true, allowedRoles: ['admin','capacitador'] },
    props: true
  },
  {
    path:'/admincursos/materiales/:idmaterial?/editar',
    name:'MaterialDetalleEditar',
    component: MaterialDetalle,
    meta: { requiresAuth: true, allowedRoles: ['admin','capacitador'] },
    props:true
  },
  {
    path: '/admincursos/materiales/nuevo',
    name: 'MaterialNuevo',
    component: MaterialNuevo,
    meta: { requiresAuth: true, allowedRoles: ['admin','capacitador'] },
  },
  //routes moudules
  {
    path:"/admincursos/modulos",
    name:"Modulos",
    component: Modulos,
    meta: { requiresAuth: true, allowedRoles: ['admin','capacitador'] },
  },
  {
    path: '/admincursos/modulos/:idmodulo?/ver',
    name: 'ModuloDetalleVer',
    component: ModuloDetalle,
    meta: { requiresAuth: true, allowedRoles: ['admin','capacitador'] },
  },
  {
    path: '/admincursos/modulos/nuevo',
    name: 'ModuloNuevo',
    component: ModuloNuevo,
    meta: { requiresAuth: true, allowedRoles: ['admin','capacitador'] },
  },
  {
    path:'/admincursos/modulos/:idmodulo?/editar',
    name:'ModuloDetalleEditar',
    component: ModuloDetalle,
    meta: { requiresAuth: true, allowedRoles: ['admin','capacitador'] },
  },
  //routes capacitadores
  {
    path:"/admincursos/capacitadores",
    name:"Capacitadores",
    component: Capacitadores,
    meta: { requiresAuth: true, allowedRoles: ['admin','supervisor'] },
  },
  {
    path:"/admincursos/capacitadores/:idcapacitador?/ver",
    name:'CapacitadorDetallesVer',
    component:CapacitadorDetalle,
    meta: { requiresAuth: true, allowedRoles: ['admin','supervisor'] },
  },
  {
    path:"/admincursos/capacitadores/:idcapacitador?/editar",
    name:'CapacitadorDetallesEditar',
    component:CapacitadorDetalle,
    meta: { requiresAuth: true, allowedRoles: ['admin','supervisor'] },
  },
  {
    path:"/admincursos/capacitadores/nuevo",
    name:'CapacitadorNuevo',
    component:CapacitadorNuevo,
    meta: { requiresAuth: true, allowedRoles: ['admin','supervisor'] },
  },
  //routes alumnos
  {
    path:'/alumnos',
    name:'Alumnos',
    component:Alumnos,
    meta: { requiresAuth: true, allowedRoles: ['admin'] },
  },
  {
    path:'/alumnos/nuevo',
    name:'AlumnoNuevo',
    component: AlumnoNuevo,
    meta: { requiresAuth: true, allowedRoles: ['admin'] },
  },
  {
    path:'/alumnos/:idalumno?/ver',
    name: 'AlumnoDetallesVer',
    component:AlumnoDetalles,
    meta: { requiresAuth: true, allowedRoles: ['admin'] },
  },
  {
    path:'/alumnos/:idalumno?/editar',
    name: 'AlumnoDetallesEditar',
    component:AlumnoDetalles,
    meta: { requiresAuth: true, allowedRoles: ['admin'] },
  },
  //routes certificados
  {
    path:'/certificados',
    name:'Certificados',
    component:Certificados,
    meta: { requiresAuth: true, allowedRoles: ['admin','comercial'] },
  },
  {
    path:'/certificados/nuevo',
    name:'CertificadoNuevo',
    component: CertificadoNuevo,
    meta: { requiresAuth: true, allowedRoles: ['admin','comercial'] },
  },
  {
    path:'/certificados/:idcertificado?/ver',
    name: 'CertificadoDetallesVer',
    component:CertificadoDetalles,
    meta: { requiresAuth: true, allowedRoles: ['admin','comercial'] },
  },
  {
    path:'/certificados/:idcertificado?/editar',
    name: 'CertificadoDetallesEditar',
    component:CertificadoDetalles,
    meta: { requiresAuth: true, allowedRoles: ['admin','comercial'] },
  },
  //routes matriculas
  {
    path:'/matriculas',
    name:'Matriculas',
    component:Matriculas,
    meta: { requiresAuth: true, allowedRoles: ['admin','comercial'] },
  },
  {
    path:'/matriculas/nueva',
    name:'MatriculaNueva',
    component: MatriculaNueva,
    meta: { requiresAuth: true, allowedRoles: ['admin','comercial'] },
  },
  {
    path:'/matriculas/:idmatricula?/ver',
    name: 'MatriculaDetallesVer',
    component:MatriculaDetalles,    
    meta: { requiresAuth: true, allowedRoles: ['admin','comercial'] },
  },
  {
    path:'/matriculas/:idmatricula?/editar',
    name: 'MatriculaDetallesEditar',
    component:MatriculaDetalles,
    meta: { requiresAuth: true, allowedRoles: ['admin','comercial'] },
  },
  //routes administradores
  {
    path:'/administradores',
    name:'Administradores',
    component:Administradores,
    meta: { requiresAuth: true, allowedRoles: ['admin'] },
  },
  {
    path:'/administradores/nuevo',
    name:'AdministradorNuevo',
    component: AdministradorNuevo,
    meta: { requiresAuth: true, allowedRoles: ['admin'] },
  },
  {
    path:'/administradores/:idadministrador?/ver',
    name: 'AdministradorDetallesVer',
    component:AdministradorDetalles,
    meta: { requiresAuth: true, allowedRoles: ['admin'] },
  },
  {
    path:'/administradores/:idadministrador?/editar',
    name: 'AdministradorDetallesEditar',
    component:AdministradorDetalles,
    meta: { requiresAuth: true, allowedRoles: ['admin'] },
  },
  //routes pagos
  {
    path:'/pagos',
    name:'Pagos',
    component:Pagos,
    meta: { requiresAuth: true, allowedRoles: ['admin','comercial'] },
  },
  {
    path:'/pagos/nuevo',
    name:'PagoNuevo',
    component: PagoNuevo,
    meta: { requiresAuth: true, allowedRoles: ['admin','comercial'] },
  },
  {
    path:'/pagos/:idpago?/ver',
    name: 'PagoDetallesVer',
    component:PagoDetalles,
    meta: { requiresAuth: true, allowedRoles: ['admin','comercial'] },
  },
  {
    path:'/pagos/:idpago?/editar',
    name: 'PagoDetallesEditar',
    component:PagoDetalles,
    meta: { requiresAuth: true, allowedRoles: ['admin','comercial'] },
  },
  //routes usuarios
  {
    path:'/usuarios',
    name:'Usuarios',
    component:Usuarios,
    meta: { requiresAuth: true, allowedRoles: ['admin'] },
  },
  {
    path:'/usuarios/nuevo',
    name:'UsuarioNuevo',
    component: UsuarioNuevo,
    meta: { requiresAuth: true, allowedRoles: ['admin'] },
  },
  {
    path:'/usuarios/:idusuario?/ver',
    name: 'UsuarioDetallesVer',
    component:UsuarioDetalles,
    meta: { requiresAuth: true, allowedRoles: ['admin'] },
  },
  {
    path:'/usuarios/:idusuario?/editar',
    name: 'UsuarioDetallesEditar',
    component:UsuarioDetalles,
    meta: { requiresAuth: true, allowedRoles: ['admin'] },
  },
  //routes lecciones
  {
    path:'/lecciones/:idleccion?/ver/:idmodulo?',
    name: 'LeccionDetallesVer',
    component:LeccionDetalles,
    meta: { requiresAuth: true, allowedRoles: ['admin','capacitador'] },
  },
  {
    path:'/lecciones/:idleccion?/editar/:idmodulo?',
    name: 'LeccionDetallesEditar',
    component:LeccionDetalles,
    meta: { requiresAuth: true, allowedRoles: ['admin','capacitador'] },
  },
  //routes evaluaciones
  {
    path:'/evaluaciones/:idevaluacion?/ver/:idcurso?',
    name: 'EvaluacionDetallesVer',
    component:EvaluacionDetalles,
    meta: { requiresAuth: true, allowedRoles: ['admin','capacitador'] },
  },
  {
    path:'/evaluaciones/:idevaluacion?/editar/:idcurso?',
    name: 'EvaluacionDetallesEditar',
    component:EvaluacionDetalles,
    meta: { requiresAuth: true, allowedRoles: ['admin','capacitador'] },
  },
  {
    path: '/google/callback',
    name: 'GoogleCallback',
    component: GoogleCallback,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("access_token");
  const user = JSON.parse(localStorage.getItem('user'));
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!token) {
      next({ name: "Signin" });
    } else {
      const allowedRoles = to.meta.allowedRoles;
      if (user) {
        const userRole = user.role;
        if (allowedRoles && !allowedRoles.includes(userRole)) {
          next({ name: "Cursos" });
        } else {
          next();
        }
      } else {
        console.log("El usuario no está definido.");
        next({ name: "Signin" });  
      }      
    }
  } else {
    next();
  }
});

export default router;
