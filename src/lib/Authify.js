

const Api = require('../api/http');

const Config = require('../config');

var local_storage = Api.getLocalStore();

var Notifier = require('../lib/Notifier').default;

var ErrorHandler = require('../lib/Errorhandler').default;

var token = Api.getToken();

export default async (agent_id ) =>  {

    try{

        var { client_id, client_secret } = Config.default;

        var data = {agent_id, client_id, client_secret} ;
        //verify token
        if(token) { }
    
        var response = await authenticateUser(data);
    
        var { data } = response;
    
        if(!data) return false;
    
        local_storage.setItem('_token',data['token'] );
    
        return true;

    }catch(err){

        window.alert("Couldnot authenticate you at this time");
  
        ErrorHandler(err);

        return false;

    }


}

function authenticateUser(data) {

    return Api.postApi(`1/login`,data);
}