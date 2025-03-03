import apiClient from '@/axios'
export default{
    getLessonSessions(){
        return apiClient.getLessonSessions('/lessonSessions');
    },
    getLessonSessionDetails(id){
        return apiClient.get(`/lessonSessions/${id}`);
    },
    postLessonSession(newLessonSession){
        return apiClient.post('/lessonSessions', newLessonSession);
    },
    patchLessonSession(id,LessonSession){
        return apiClient.patch(`/lessonSessions/${id}`,LessonSession);
    },
    deleteLessonSession(id){
        return apiClient.delete(`/lessonSessions/${id}`);
    }
}