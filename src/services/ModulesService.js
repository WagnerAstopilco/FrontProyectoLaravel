import apiClient from '@/axios';
export default {
    getModules(){
        return apiClient.get('/modules');
    }
}