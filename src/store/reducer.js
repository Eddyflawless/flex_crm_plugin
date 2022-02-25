
import * as actions from './actionTypes';

const initial_state = {
    contact: {},
    tickets: [],
    task_attributes: {},
    notes: [],
    campaigns: [],
    call_logs: []
}


export default function reducer(state = initial_state, action){

    if(action.type == actions.INITIAL_POPULATE){

        const { tickets, contact, notes, campaigns, deals, call_logs} = action.payload;

        return {
            ...state,
            contact,
            tickets,
            notes,
            campaigns,
            call_logs,
            deals
        }
    }

    if(action.type === actions.ADD_CONTACT){
        return {
            ...state,
            contact: action.payload.contact
        }
    }

    if(action.type === actions.ADD_TICKET){

        const { ticket } = action.payload;

        return {
            ...state,
            tickets: [ ticket, ...state.tickets ]
        }
          
    }
    
    if (action.type === actions.UPDATE_TICKET){

        const {ticket} = action.payload;

        return state.tickets.map(t => {
            if(t.ticket_id = ticket.ticket_id){
                t = ticket;
            }

            return t;
        })
    }
    
    if (action.type === actions.ADD_NOTE){

        const { note } = action.payload;

        return {
            ...state,
            notes: [  note, ...state.notes]
        }
    }

    if (action.type === actions.UPDATE_TICKET_LIST){

        const {tickets} = action.payload;

        return {
            ...state,
            tickets
        }
    }

    if (action.type === actions.ADD_TASK_ATTRIBUTES){


        // return Object.assign({}, state, {
        //     task_attributes : state.task_attributes.concat(task_attributes)
        // } );

        return {
            ...state,
            task_attributes: action.payload.task_attributes
        }
    }

    return state;

}