import apiClient from '@/axios';
export default {
    getLessons(){
        return apiClient.get('/lessons');
    },
}