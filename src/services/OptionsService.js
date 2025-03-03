import apiClient from '@/axios'
export default{
    getOptions(){
        return apiClient.getOptions('/options');
    },
    getOptionDetails(id){
        return apiClient.get(`/options/${id}`);
    },
    postOption(newOption){
        return apiClient.post('/options', newOption);
    },
    patchOption(id,Option){
        return apiClient.patch(`/options/${id}`,Option);
    },
    deleteOption(id){
        return apiClient.delete(`/options/${id}`);
    }
}