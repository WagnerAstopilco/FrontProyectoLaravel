<template>
    <div class="category-container">
        <div class="category-card">
            <h2>Módulos</h2>            
            <div>
                {{modules}}
            </div>

        </div>
    </div>
</template>

<script>
import ModuleService from '@/services/ModulesService.js'
export default {
    data() {
        return {
            modules:[]
        };          
    },
    mounted() {
        this.getModules();
    },
    methods: {
        async getModules(){
            const response=await ModuleService.getModules();
            this.modules=response.data.data;
        }
    }
};
</script>

<style>

</style>