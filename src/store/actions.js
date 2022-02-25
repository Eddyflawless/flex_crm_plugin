
import * as actions from './actionTypes';

export const addTicket = ticket => ({

    type: actions.ADD_TICKET,
    payload: {
        ticket
    }
})

export const updateTicket = ticket => ({

    type: actions.UPDATE_TICKET,
    payload: {
        ticket
    }
})

export const addContact = contact => ({

    type: actions.ADD_CONTACT,
    payload: {
        contact
    }
})

export const updateContact = contact => ({

    type: actions.UPDATE_CONTACT,
    payload: {
        contact
    }
})

export const addNote = note => ({

    type: actions.ADD_NOTE,
    payload: {
        note
    }
})

export const populate = data => ({

    type: actions.INITIAL_POPULATE,
    payload: data
    
})

export const updateTicketList = data => ({

    type: actions.UPDATE_TICKET_LIST,
    payload: {
        tickets: data
    }
    
})

export const addTaskAttributes  = data => ({

    type: actions.ADD_TASK_ATTRIBUTES,
    payload: {
        task_attributes: data
    }

})

export const addSurvey = survey => ({

    type: actions.UPDATE_CONTACT,
    payload: {
        survey
    }
})




