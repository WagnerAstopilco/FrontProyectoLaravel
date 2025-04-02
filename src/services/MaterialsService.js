import apiClient from '@/axios';
export default {
    getMaterials(){
        return apiClient.get('/materials');
    },
    getMaterialDetails(id){
        return apiClient.get(`/materials/${id}`);
    },
    postMaterial(newMaterial){
        return apiClient.post('/materials', newMaterial,{
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
    },
    patchMaterial(id,Material){
        return apiClient.post(`/materials/${id}`, Material, {
                    headers: { 
                        "Content-Type": "multipart/form-data",
                        "X-HTTP-Method-Override": "PATCH",
                    }
                });
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