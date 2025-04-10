import apiClient from '@/axios';
export default {
    getLessonUser(){
        return apiClient.get('/lessonUsers');
    },
    getLessonUserDetails(id){
        return apiClient.get(`/lessonUsers/${id}`);
    },
    postLessonUser(newLessonUser){
        return apiClient.post('/lessonUsers', newLessonUser);
    },
    patchLessonUser(id,lessonUser){
        return apiClient.patch(`/lessonUsers/${id}`,lessonUser);
    },
    deleteLessonUser(id){
        return apiClient.delete(`/lessonUsers/${id}`);
    },
}