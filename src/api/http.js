import Axios from 'axios';
// import toastr from 'toastr';
// import 'toastr/build/toastr.css'

export const baseUrl  = "http://localhost:3001/api";


export const getLocalStore = () => localStorage;
    
export const getToken = () => getLocalStore().getItem("_token");


Axios.defaults.baseURL = baseUrl;

Axios.defaults.timeout = 5000;
// Axios.defaults.withCredentials = true;

Axios.interceptors.request.use(function(config){

    alert("test");

    // config.headers['Authorization'] = `Bearer ${getToken()}`;

    config.headers['Authorization2'] = `Bearer xxx`;

    return config;

}, function(error){

    return Promise.reject(error);
});

Axios.interceptors.response.use(function(response){

    return response.data;

}, function(error){
    //do something
    //alert user
    return Promise.reject(error);
});

const composeHeaders = (headers) =>  { 

    headers['Authorization'] = `Bearer ${getToken()}` ;

    return headers;
    
}

var instance = Axios.create();

export const getApi = async (endpoint,params, headers={}) => {

    headers = composeHeaders(headers);
    return instance.get(endpoint, params, { headers });
} 

export const postApi = (endpoint,data, headers={}) => { 
   
    headers = composeHeaders(headers);
    return instance.post(endpoint,data, { headers } ) };






