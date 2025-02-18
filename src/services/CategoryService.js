import apiClient from '@/axios';
export default {
    getCategories(){
        return apiClient.get('/category');
    },
    getCategoryDetails(id){
        return apiClient.get(`/category/${id}`);
    },
    postCategory(newCategory){
        return apiClient.post('/category', newCategory);
    },
    patchCategory(id,Category){
        return apiClient.patch(`/category/${id}`,Category);
    },
    deleteCategory(id){
        return apiClient.delete(`/category/${id}`);
    }
}