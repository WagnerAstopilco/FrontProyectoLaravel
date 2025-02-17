import apiClient from '@/axios';
export default{
    getTrainers(){
        return apiClient.get('/trainers');
    }
}