<template>
    <h1>Detalles Evaluación</h1>
    <button @click="goBack()">Volver</button>
</template>
<script>
export default{
    data(){
        return{
            idevaluacion: this.$route.params.idevaluacion,
            idcurso: this.$route.params.idcurso,
        }
    },
    methods: {
        goBack(){
            this.$router.push({ name: 'CursoDetalleVer', params: { idcurso: this.idcurso } });
        }
    },

}
</script>