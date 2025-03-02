import apiClient from '@/axios'
export default{
    getEnrollments(){
        return apiClient.getEnrollments('/enrollments');
    }
}