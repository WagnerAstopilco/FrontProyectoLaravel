import apiClient from '@/axios';
export default {
    getCategories(){
        return apiClient.get('/category');
    },
    getCategoryDetails(id){
        return apiClient.get(`/category/${id}`);
    }
}