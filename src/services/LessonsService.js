import apiClient from '@/axios';
export default {
    getLessons(){
        return apiClient.get('/lessons');
    },
    getLessonDetails(id){
        return apiClient.get(`/lessons/${id}`);
    },
    postLesson(newLesson){
        return apiClient.post('/lessons', newLesson);
    },
    patchLesson(id,Lesson){
        return apiClient.patch(`/lessons/${id}`,Lesson);
    },
    deleteLesson(id){
        return apiClient.delete(`/lessons/${id}`);
    },
}