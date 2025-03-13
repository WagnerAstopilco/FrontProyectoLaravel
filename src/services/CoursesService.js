import apiClient from '@/axios';
export default {
    getCourses(){
        return apiClient.get('/courses');
    },
    getCourseDetails(id){
        return apiClient.get(`/courses/${id}`);
    },
    postCourse(newCourse){
        return apiClient.post('/courses', newCourse,{
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
    patchCourse(id, formData) {
        return apiClient.post(`/courses/${id}`, formData, {
            headers: { 
                "Content-Type": "multipart/form-data",
                "X-HTTP-Method-Override": "PATCH",
            }
        });
    },
    deleteCourse(id){
        return apiClient.delete(`/courses/${id}`);
    }
}