<template>
    <h1>Detalles de lección</h1>
    {{ idmodulo }}
    {{ idleccion }}

    <button @click="goBack()">Volver</button>
</template>
<script>
export default {
    data() {
        return {
            idmodulo: this.$route.params.idmodulo,
            idleccion: this.$route.params.idleccion,
        }
    },
    
    methods: {
        goBack(){
            this.$router.push({ name: 'ModuloDetalleVer', params: { idmodulo: this.idmodulo } });
        }
    },
};
</script>