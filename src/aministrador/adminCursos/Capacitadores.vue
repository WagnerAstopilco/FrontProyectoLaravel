<template>
    <div class="category-container">
        <div class="category-card">
            <h2>Capacitadores</h2>            
            <div>
                {{trainers}}
            </div>

        </div>
    </div>
</template>

<script>
import TrainerService from '@/services/TrainersService.js'
export default {
    data() {
        return {
            trainers:[]
        };          
    },
    mounted() {
        this.getTrainers();
    },
    methods: {
        async getTrainers(){
            const response=await TrainerService.getTrainers();
            this.trainers=response.data.data;
        }
    }
};
</script>

<style>

</style>