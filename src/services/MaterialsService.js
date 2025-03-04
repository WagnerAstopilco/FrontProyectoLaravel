import apiClient from '@/axios';
export default {
    getMaterials(){
        return apiClient.get('/materials');
    },
    getMaterialDetails(id){
        return apiClient.get(`/materials/${id}`);
    },
    postMaterial(newMaterial){
        return apiClient.post('/materials', newMaterial);
    },
    patchMaterial(id,Material){
        return apiClient.patch(`/materials/${id}`,Material);
    },
    deleteMaterial(id){
        return apiClient.delete(`/materials/${id}`);
    },
    postCourseToMaterial(materialId,courseId){
        return  apiClient.post(`/materials/${materialId}/${courseId}/`);
    },
    deleteCourseToMaterial(materialId,courseId){
        return  apiClient.delete(`/materials/${materialId}/${courseId}/`);
    }
}