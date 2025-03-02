import apiClient from '@/axios';
export default{
    getTrainers(){
        return apiClient.get('/trainers');
    },
    getTrainerDetails(id){
        return apiClient.get(`/trainers/${id}`);
    },
    postTrainer(newTrainer){
        return apiClient.post('/trainers', newTrainer);
    },
    patchTrainer(id,Trainer){
        return apiClient.patch(`/trainers/${id}`,Trainer);
    },
    deleteTrainer(id){
        return apiClient.delete(`/trainers/${id}`);
    },
    postCourseToTrainer(trainerId,courseId){
        return  apiClient.post(`/trainers/${trainerId}/${courseId}/`);
    },
    deleteCourseToTrainer(trainerId,courseId){
        return  apiClient.delete(`/trainers/${trainerId}/${courseId}/`);
    }
}