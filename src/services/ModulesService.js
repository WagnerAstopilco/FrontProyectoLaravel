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
    // postCoursesToModule(moduleId,coursesIds){
    //     return  apiClient.post(`/modules/${moduleId}/courses/`,coursesIds);
    // },
    deleteCourseToModule(moduleId,courseId){
        return  apiClient.delete(`/modules/${moduleId}/${courseId}/`);
    },
    postLessonToModule(moduleId,lessonId){
        return  apiClient.post(`/modules/${moduleId}/${lessonId}/`);
    },
    deleteLessonToModule(moduleId,lessonId){
        return  apiClient.delete(`/modules/${moduleId}/${lessonId}/`);
    }
}