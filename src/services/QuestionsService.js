import apiClient from '@/axios'
export default{
    getQuestions(){
        return apiClient.get('/questions');
    },
    getQuestionDetails(id){
        return apiClient.get(`/questions/${id}`);
    },
    postQuestion(newQuestion){
        return apiClient.post('/questions', newQuestion);
    },
    patchQuestion(id,Question){
        return apiClient.patch(`/questions/${id}`,Question);
    },
    deleteQuestion(id){
        return apiClient.delete(`/questions/${id}`);
    }
}