import apiClient from '@/axios'
export default{
    getCertificates(){
        return apiClient.get('/certificates');
    },
    getCertificateDetails(id){
        return apiClient.get(`/certificates/${id}`);
    },
    postCertificate(newCertificate){
        return apiClient.post('/certificates', newCertificate);
    },
    patchCertificate(id,Certificate){
        return apiClient.patch(`/certificates/${id}`,Certificate);
    },
    deleteCertificate(id){
        return apiClient.delete(`/certificates/${id}`);
    }
}