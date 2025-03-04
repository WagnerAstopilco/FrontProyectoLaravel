import apiClient from '@/axios';
export default{
    getEnrollments(){
        return apiClient.get('/enrollments');
    },
    getEnrollmentDetails(id){
        return apiClient.get(`/enrollments/${id}`);
    },
    postEnrollment(newEnrollment){
        return apiClient.post('/enrollments', newEnrollment);
    },
    // patchEnrollment(id,Enrollment){
    //     return apiClient.patch(`/enrollments/${id}`,Enrollment);
    // },
    // deleteEnrollment(id){
    //     return apiClient.delete(`/enrollments/${id}`);
    // }
}