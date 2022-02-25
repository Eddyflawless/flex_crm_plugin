const  Api  = require('./http');

export default {

    findContact(phone) {
        return Api.getApi(`contacts/${phone}`);
    },

    createContact(data){
        return Api.postApi(`contacts`,data);
    },

    updateContact(data){
        return Api.postApi(`contacts/update`,data);
    },

    getCalls(contact_id,query=''){
        return Api.getApi(`contacts/${contact_id}/calls${query}`);
    },

    getNotes(customer_id,query=''){
        return Api.getApi(`contacts/${customer_id}/notes${query}`);
    },

    createNote(data){
        return Api.postApi(`contacts/notes`,data);
    },

    getTickets(customer_id,query=''){
        return Api.getApi(`contacts/${customer_id}/tickets${query}`);
    },

    getCampaigns(customer_id,query=''){
        return Api.getApi(`contacts/${customer_id}/campaigns${query}`);
    },

}
  
