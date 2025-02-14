import apiClient from '@/axios';
export default {
    getCursos(){
        return apiClient.get('/courses');
    }
}