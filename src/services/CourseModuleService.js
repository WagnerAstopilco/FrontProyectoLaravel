import apiClient from '@/axios';
export default {
    getCourseModules(){
        return apiClient.get('/curriculums');
    },
    getCourseModuleDetails(id){
        return apiClient.get(`/curriculums/${id}`);
    },
    postCourseModule(newCourseModule){
        return apiClient.post('/curriculums', newCourseModule);
    },
    patchCourseModule(id, coursemodule) {
        return apiClient.post(`/curriculums/${id}`, coursemodule);
    },
    deleteCourseModule(id){
        return apiClient.delete(`/curriculums/${id}`);
    },
    
}