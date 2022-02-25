
    import Notifier from '../lib/Notifier';

    function defaultErrorHandler(err){
        var error_data = err.data;
        if(error_data.error){
            var error = error_data.error;
            Notifier.reportInfo(error);
        }
    }

    function unauthorizedErrorHandler(){
        Notifier.reportFailure("Session terminated");
    
    }

    function unprocessableEntityErrorHandler(err){

      var error_data = err.data;

      var errors = error_data.errors;

      if(errors){
        var error = errors[0];
        Notifier.reportInfo(`${error['param']} has ${error['msg']}`);
  
      }

    }
    
    function serverSideErrorHandler(err) {
      var error_data =  err.data ;
      var error = error_data.error;
      Notifier.reportFailure(error);
    }


export default function (err){

    var error = err.response;
    console.log("error-log",{err});
    //end error to sentry

    if(error){

      switch((error.status)? error.status: 500){
        case 400:
          defaultErrorHandler(error);
          break;
        case 401:
          unauthorizedErrorHandler();  
          break;
        case 422:
          unprocessableEntityErrorHandler(error);
          break;
        case 500:
          serverSideErrorHandler(error);
          break; 
      }
    }

}