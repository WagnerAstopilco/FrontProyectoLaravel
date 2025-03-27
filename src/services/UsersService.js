import apiClient from '@/axios';
export default {
    getUsers(){
        return apiClient.get('/users');
    },
    getUserDetails(id){
        return apiClient.get(`/users/${id}`);
    },
    postUser(formDataAdmin){
        return apiClient.post('/users', formDataAdmin,{
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
    patchUser(id,formDataAdmin){
        return apiClient.post(`/users/${id}`,formDataAdmin,{
            headers: { 
                "Content-Type": "multipart/form-data",
                "X-HTTP-Method-Override": "PATCH",
            }
        });
    },
    deleteUser(id){
        return apiClient.delete(`/users/${id}`);
    }
}