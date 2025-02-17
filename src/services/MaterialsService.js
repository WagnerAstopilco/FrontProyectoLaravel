import apiClient from '@/axios';
export default {
    getMaterials(){
        return apiClient.get('/materials');
    }
}