import React, {Component} from 'react';
import NoData from '../../crm/views/no-data';
import Card from '../../card';

import store from '../../../store/store';

import { updateTicketList } from '../../../store/actions';

import { connect } from "react-redux";

import TicketApi from './../../../api/ticket';

const mapStateToProps = (state)  => {
    return {
        tickets: state.tickets,
        task_attributes: state.task_attributes
    }
}


class TicketList extends Component {

    constructor(props) {
        super(props);
        this.removeMergedTickets = this.removeMergedTickets.bind(this);
        this.toggleMergeTickets = this.toggleMergeTickets.bind(this);
        this.attachTaskAttributes = this.attachTaskAttributes.bind(this);
        //this.handleChange = this.handleChange.bind(this);
    }

    state = {
        tickets: [],
        task_attributes: {}
    };

    storeChanged() {
        this.setState({ tickets: store.getState().tickets, task_attributes: this.props.task_attributes });
    }
    
    pluckValue(val){
        return (val)? val : " "
    }

    toggleMergeTickets(){

        var checked_rows = this.state.tickets.filter(ticket =>  ticket.is_checked == true );

        if(checked_rows.length < 2) {
          window.alert("Select at least two or more tickets to merge")
          return;
        }
 
       var to_merge_ticket = checked_rows[0];
 
       if(!window.confirm(`Merge every other selection with ${to_merge_ticket.ticket_id}`)) {
         return;
       }

       this.mergeTickets(checked_rows);

    }

    async mergeTickets(tickets){

        try{
  
            var form_data = { tickets }

            form_data = this.attachTaskAttributes(form_data);
  
            var response = await TicketApi.mergeTickets(form_data)
            .then(data => data.data);
  
            if(response){
                window.alert(response.msg);
                //remove [merged] tickets from view
                this.removeMergedTickets(tickets)
            }
  
        }catch(err){

            window.alert("Something went wrong");
            console.log(err);
  
        }
  
    }

    removeMergedTickets(tickets) {

        var ticket_master = tickets[0];

        var new_ticket_list_ids  = [];

        tickets.forEach(ticket => {

            if(ticket.ticket_id != ticket_master.ticket_id) new_ticket_list_ids.push(ticket.ticket_id);
            
        })

        var new_ticket_list = this.state.tickets.filter( ticket => new_ticket_list_ids.includes(ticket.ticket_id) == false);

        this.setState({ tickets: new_ticket_list });

        store.dispatch(updateTicketList(new_ticket_list));

    }

    attachTaskAttributes = (form_data) => {

        var attributes = this.state.task_attributes;

        form_data['task_attributes'] = attributes;

        return form_data;
    } 

    handleChange(item){

        if(item) item.is_checked = !item.is_checked;

    }

    addTicket(){} 

    editTicket(id){}

    componentDidMount() {
        this.addTicket = this.addTicket.bind(this);
        this.storeChanged = this.storeChanged.bind(this);
        store.subscribe(() => this.storeChanged);
        this.setState({ tickets: store.getState().tickets, task_attributes: this.props.task_attributes });

    }

    render() { 

        return ( 
            <React.Fragment>

                { this.state.tickets.length > 0 && (

                    <>
                    
                        <Card>

                            <div className="row mb-20">

                                <div className="col-md-12">
                                    <button className="btn btn-sm btn-dark" onClick={ this.toggleMergeTickets}>Merge tickets</button>
                                </div>
                            </div>

                            <div className="table-wrap">
                                <div className="table-responsive">
                                    <table className="table mb-0">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th></th>
                                                <th>T-iD</th>
                                                <th>Type</th>
                                                <th>Channel</th>
                                                <th>Description</th>
                                                <th>Priority</th>
                                                <th>Status</th>
                                                {/* <th>Assignee</th> */}
                                                <th>Agent</th>
                                                <th>Merged</th>
                                                {/* <th>Closed by</th> */}
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.tickets.map((t,index) => (

                                                    <tr key={ index + 1 }>
                                                        <th scope="row">{ index + 1}</th>
                                                        <th>
                                                            <input type="checkbox"  onChange={ ()  => this.handleChange(t) }/>
                                                        </th>
                                                        <td>
                                                            <a href="javascript:void(1)">{t.ticket_id}</a>
                                                        </td>
                                                        <td>{ this.pluckValue(t.ticket_type) }</td>
                                                        <td>{ this.pluckValue(t.channel) }</td>
                                                        <td>{ this.pluckValue(t.description) }</td>
                                                        <td>{ this.pluckValue(t.priority) }</td>
                                                        <td>
                                                            <span className="badge badge-light">{ this.pluckValue(t.status) }</span> 
                                                        </td>
                                                        {/* <td>{ this.pluckValue(t.re_assigned_to) }</td> */}
                                                        <th>{ this.pluckValue(t.agent_id) }</th>
                                                        <td>
                                                            {
                                                               ( t.is_merged == 1 ) && (

                                                                   <span className="badge badge-light">Merged</span>

                                                               )
                                                            }
                                                        </td>
                                                        {/* <td>{ this.pluckValue(t.closed_by) }</td> */}
                                                        <td>{ this.pluckValue(t.created_at) }</td>
                                                        
                                                    </tr>
                                                ))
                                            }

                                        
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            
                        </Card>
                    </>
                )}

                { this.state.tickets.length == 0 && (

                    <NoData img_url="https://i.ibb.co/S7m4Y1q/attachment.png" 
                    title="No Tickets Available" 
                    subtitle=""/>

                )}

        
            </React.Fragment>
         );
    }
}
 
export default connect(mapStateToProps)(TicketList);