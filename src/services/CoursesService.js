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
    patchCourse(id,Course){
        return apiClient.patch(`/courses/${id}`,Course,{
            headers: {
                "Content-Type": "multipart/form-data",
              },
        });
    },
    deleteCourse(id){
        return apiClient.delete(`/courses/${id}`);
    }
}