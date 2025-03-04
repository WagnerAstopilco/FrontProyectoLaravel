import apiClient from '@/axios'
export default{
    getEvaluations(){
        return apiClient.get('/evaluations');
    },
    getEvaluationDetails(id){
        return apiClient.get(`/evaluations/${id}`);
    },
    postEvaluation(newEvaluation){
        return apiClient.post('/evaluations', newEvaluation);
    },
    patchEvaluation(id,Evaluation){
        return apiClient.patch(`/evaluations/${id}`,Evaluation);
    },
    deleteEvaluation(id){
        return apiClient.delete(`/evaluations/${id}`);
    }
}