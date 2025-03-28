import apiClient from '@/axios';
export default {
    getModules(){
        return apiClient.get('/modules');
    },
    getModuleDetails(id){
        return apiClient.get(`/modules/${id}`);
    },
    postModule(newModule){
        return apiClient.post('/modules', newModule);
    },
    patchModule(id,Module){
        return apiClient.patch(`/modules/${id}`,Module);
    },
    deleteModule(id){
        return apiClient.delete(`/modules/${id}`);
    },
    postLessonToModule(moduleId,lessonId){
        return  apiClient.post(`/modules/${moduleId}/${lessonId}/`);
    },
    deleteLessonToModule(moduleId,lessonId){
        return  apiClient.delete(`/modules/${moduleId}/${lessonId}/`);
    }
}