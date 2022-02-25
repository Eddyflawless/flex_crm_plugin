

import Notiflix from 'notiflix';

export const confirm = ticket => ({

    type: actions.ADD_TICKET,
    payload: {
        ticket
    }
})

const reportFailure = (message="Something isnot right.") => {
    Notiflix.Notify.failure(message);
  }

const reportInfo = (message="Got a second?") => {
    Notiflix.Notify.info(message);
  }
const reportSuccess = (message="Yah!..That went well") => {
    Notiflix.Notify.success(message);
  }

const showLoader = (message="Preparing your dataset") => {
    Notiflix.Loading.hourglass(message);
  }

const hideLoader = () => {
    setTimeout(() => {
      Notiflix.Loading.remove();
    },1*700)
  
}


export default {
    confirm,
    reportFailure,
    reportInfo,
    reportSuccess,
    showLoader,
    hideLoader
}
