import apiClient from '@/axios';
export default {
    getUsers(){
        return apiClient.get('/users');
    },
    getUserDetails(id){
        return apiClient.get(`/users/${id}`);
    },
    postUser(newUser){
        return apiClient.post('/users', newUser);
    },
    patchUser(id,User){
        return apiClient.patch(`/users/${id}`,User);
    },
    deleteUser(id){
        return apiClient.delete(`/users/${id}`);
    }
}