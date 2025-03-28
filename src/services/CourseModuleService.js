import apiClient from '@/axios';
export default {
    getCourseModules(){
        return apiClient.get('/courseModules');
    },
    getCourseModuleDetails(id){
        return apiClient.get(`/courseModules/${id}`);
    },
    postCourseModule(newCourseModule){
        return apiClient.post('/courseModules', newCourseModule);
    },
    patchCourseModule(id, coursemodule) {
        return apiClient.post(`/courseModules/${id}`, coursemodule);
    },
    deleteCourseModule(id){
        return apiClient.delete(`/courseModules/${id}`);
    },
    deleteCourseToModule(moduleId,courseId){
        return apiClient.delete(`/courseModules/${moduleId}/${courseId}`);
    }
}