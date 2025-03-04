import apiClient from '@/axios'
export default{
    getPayments(){
        return apiClient.get('/payments');
    },
    getPaymentDetails(id){
        return apiClient.get(`/payments/${id}`);
    },
    postPayment(newPayment){
        return apiClient.post('/payments', newPayment);
    },
    patchPayment(id,Payment){
        return apiClient.patch(`/payments/${id}`,Payment);
    },
    deletePayment(id){
        return apiClient.delete(`/payments/${id}`);
    }
}