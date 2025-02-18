import apiClient from '@/axios';
export default {
    getCourses(){
        return apiClient.get('/courses');
    },
    getCourseDetails(id){
        return apiClient.get(`/courses/${id}`);
    },
    postCourse(newCourse){
        return apiClient.post('/courses', newCourse);
    },
    patchCourse(id,Course){
        return apiClient.patch(`/courses/${id}`,Course);
    },
    deleteCourse(id){
        return apiClient.delete(`/courses/${id}`);
    }
}