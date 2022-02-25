import Api  from './http';
export default {

    profile() {
        return Api.get(`a_user/profile`);
    },

    activity() {
        return Api.get(`a_user/activity`);
    },

    tasks(query='') {
        return Api.get(`a_user/tasks?${query}`);
    },

    stats(query='') {
        return Api.get(`a_user/status?${query}`);
    },


}
