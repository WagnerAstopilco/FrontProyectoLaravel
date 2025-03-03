import apiClient from '@/axios'
export default{
    getUserEvaluations(){
        return apiClient.getUserEvaluations('/userEvaluations');
    },
    getUserEvaluationDetails(id){
        return apiClient.get(`/userEvaluations/${id}`);
    },
    postUserEvaluation(newUserEvaluation){
        return apiClient.post('/userEvaluations', newUserEvaluation);
    },
    patchUserEvaluation(id,UserEvaluation){
        return apiClient.patch(`/userEvaluations/${id}`,UserEvaluation);
    },
    deleteUserEvaluation(id){
        return apiClient.delete(`/userEvaluations/${id}`);
    }
}