import apiClient from '@/axios';
export default {
    getCourseMaterials(){
        return apiClient.get('/courseMaterials');
    },
    getCourseMaterialDetails(id){
        return apiClient.get(`/courseMaterials/${id}`);
    },
    postCourseMaterial(newCourseMaterial){
        return apiClient.post('/courseMaterials', newCourseMaterial);
    },
    patchCourseMaterial(id, courseMaterial) {
        return apiClient.patch(`/courseMaterials/${id}`, courseMaterial);
    },
    deleteCourseMaterial(id){
        return apiClient.delete(`/courseMaterials/${id}`);
    },
    deleteCourseToMaterial(materialId,courseId){
        return apiClient.delete(`/courseMaterials/${materialId}/${courseId}`);
    }
}