import apiClient from '@/axios';
export default {
    getCourses(){
        return apiClient.get('/courses');
    },
    getCourseDetails(id){
            return apiClient.get(`/courses/${id}`);
        }
}