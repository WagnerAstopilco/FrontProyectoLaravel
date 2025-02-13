import apiClient from '@/axios';
export default {
    getCategorias(){
        return apiClient.get('/category');
    }
}