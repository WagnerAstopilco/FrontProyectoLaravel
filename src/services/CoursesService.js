import apiClient from '@/axios';
export default {
    getCourses(){
        return apiClient.get('/courses');
    }
}