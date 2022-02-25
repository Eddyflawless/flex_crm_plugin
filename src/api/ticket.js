const  Api  = require('./http');

export default {

    createTicket(data){
        return Api.postApi(`tickets`,data);
    },  
    mergeTickets(selected_tickets){
        return Api.postApi(`tickets/merge`, selected_tickets);
    }

}
