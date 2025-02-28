import apiClient from '@/axios';
export default{
    getTrainers(){
        return apiClient.get('/trainers');
    },
    getTrainerDetails(id){
        return apiClient.get(`/category/${id}`);
    },
    postTrainer(newTrainer){
        return apiClient.post('/category', newTrainer);
    },
    patchTrainer(id,Trainer){
        return apiClient.patch(`/category/${id}`,Trainer);
    },
    deleteTrainer(id){
        return apiClient.delete(`/category/${id}`);
    }
}