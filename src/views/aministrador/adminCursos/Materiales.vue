<template>
    <div class="category-container">
        <div class="category-card">
            <h2>Materiales</h2>            
            <div>
                {{materials}}
            </div>

        </div>
    </div>
</template>

<script>
import MaterialService from '@/services/MaterialsService.js'
export default {
    data() {
        return {
            materials:[]
        };          
    },
    mounted() {
        this.getMaterials();
    },
    methods: {
        async getMaterials(){
            const response=await MaterialService.getMaterials();
            this.materials=response.data.data;
        }
    }
};
</script>

<style>

</style>