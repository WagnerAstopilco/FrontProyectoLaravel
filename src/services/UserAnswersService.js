import apiClient from '@/axios'
export default{
    getUserAnswers(){
        return apiClient.get('/userAnswers');
    },
    getUserAnswerDetails(id){
        return apiClient.get(`/userAnswers/${id}`);
    },
    postUserAnswer(newUserAnswer){
        return apiClient.post('/userAnswers', newUserAnswer);
    },
    patchUserAnswer(id,UserAnswer){
        return apiClient.patch(`/userAnswers/${id}`,UserAnswer);
    },
    deleteUserAnswer(id){
        return apiClient.delete(`/userAnswers/${id}`);
    }
}