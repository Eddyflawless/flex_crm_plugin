import React, {Component} from 'react';

import Notifier from '../../../lib/Notifier';

import ErrorHandler from '../../../lib/Errorhandler';

import { connect } from "react-redux";

import store from '../../../store/store';

import { addTicket} from '../../../store/actions';

import TicketApi from './../../../api/ticket';

const mapStateToProps = (state)  => {
    return {
        contact: state.contact,
        task_attributes: state.task_attributes
    }
}

class Survey extends Component {

    state = { 
        ticket: {
            ticket_type: "query",
            priority: "low",
            description: "",
            feedback: "",
            note: "",
            status: "pending",
            re_assigned_to: null
        },
        contact: {},
        task_attributes: {},
        from_valid: false,
        form_errors:{ },
        form_submited: false,
        isSubmiting: false,
        is_sent: false,
        ready: true
     }

     constructor(props) {
        super(props);
        this.attachTaskAttributes = this.attachTaskAttributes.bind(this);
        this.createNewTicket = this.createNewTicket.bind(this);

    }  

    attachTaskAttributes = (form_data) => {

        var attributes = this.state.task_attributes;

        form_data['task_attributes'] = attributes;

        form_data['country'] = attributes['caller_country'];

        form_data['state'] = attributes['caller_state'];

        form_data['city'] = attributes['caller_city'];

        form_data['zip'] = attributes['caller_zip'];

        if(attributes['caller']) form_data['phone'] = attributes['caller'];

        if(attributes['name']) form_data['phone'] = attributes['name'];


        return form_data;
    } 

    submitTicket = async (e) => {

        e.preventDefault();

        this.setState({ isSubmiting: true });

        Notifier.showLoader();

        try{

            var form_data = this.state.ticket;

            form_data = this.attachTaskAttributes(form_data) 
  
            var response = await TicketApi.createTicket(form_data)
            .then(data => data.data);

            if(response) {
                // Notifier.reportSuccess(`${response.msg}`);

                var new_ticket = response.data;

                if(new_ticket) store.dispatch(addTicket(new_ticket))
                //close ticket view
                //show submission status
                this.setState({ form_submited: true });
                this.resetTicketState();
            }
      
            console.log(response);

        }catch(error){
            Notifier.reportFailure("An error occured. Try again later!");        
            //send to sentry
            ErrorHandler(error);

        }finally{
            this.setState({ isSubmiting: false });
            Notifier.hideLoader();

        }

    }

    storeChanged() {
        this.setState({contact: store.getState().contact, task_attributes: store.getState().task_attributes});
    }

    resetTicketState() {
        Object.keys(this.state.ticket).
        forEach( field => this.state.ticket[field] = null);
    }

    createNewTicket = () => {
        this.setState({ form_submited: false})
        //reset ticket_form
        this.setState({
            ticket: {
                ticket_type: "query",
                priority: "low",
                description: '',
                feedback: '',
                note: '',
                status: "pending",
                re_assigned_to: null
                
            }
        })

    }


    handleChange = (event) => { 

        event.preventDefault();

        var  { name, value } = event.target;

        var ticket= this.state.ticket;

        ticket.contact_id = this.state.contact.contact_id;

        ticket[`${name}`] = value;

        this.setState({ticket});

    }

    componentDidMount() {

        this.setState({contact: store.getState().contact, task_attributes: store.getState().task_attributes});

        this.storeChanged = this.storeChanged.bind(this);
        
        store.subscribe(this.storeChanged)
    }

    render() { 

        return ( 
            <React.Fragment>
                
                <div className="container">

                    <div className="row full-width m-0">

                        <div className="col-md-12 mb-20">

                            {
                               this.state.form_submited && (

                                    <div className="d-flex" style={ { flexDirection: "column" } }>

                                        <div className="alert alert-success text-center">
                                            <h4>Ticket has been submitted </h4>
                                        
                                        </div>

                                        <figure className="d-flex" style={ { height: "400px", width: "100%"  }}>

                                            <img src="https://i.ibb.co/1KDKdnP/success-banner-sm.png"  style={{ width: "100%", objectFit: "contain" }} className="img img-responsive" alt="success-banner-sm" border="0"/>

                                        </figure>



                                        <button className="btn btn-dark btn-sm mt-10" style={ {margin: "auto" }} onClick={this.createNewTicket}>Add New Ticket</button>

                                    </div>

                                )
                            }
                                {  this.state.contact['contact_id'] == null &&  (

                                    <div className="alert alert-success text-center mt-20">
                                        <h5>You must add contact first before creating ticket</h5>
                                    </div>
                                )}

                                {
                                    (!this.state.form_submited && this.state.contact['contact_id'] ) && (

                                        <form onSubmit={this.submitTicket} className="mt-20">

                                            <div className="form-group">
                                                <label>Ticket Type</label>
                                                <select name="ticket_type" value={this.state.ticket.ticket_type} onChange={this.handleChange} className="form-control custom-select d-block w-100" required>
                                                    <option disabled>Select a type</option>
                                                    <option value="query">Query</option>
                                                    <option value="issue">Issue</option>
                                                </select>
                                            </div>

                                            <div className="row">

                                                <div className="col-md-6 form-group">
                                                    <label>Priority</label>
                                                    <select name="priority" value={this.state.ticket.priority} onChange={this.handleChange} className="form-control custom-select d-block w-100"  required>
                                                        <option value="low">Low</option>
                                                        <option value="medium">Medium</option>
                                                        <option value="high">High</option>
                                                    </select>
                                                </div>

                                                <div className="col-md-6 form-group">
                                                    <label>Status</label>
                                                    <select name="status" value={this.state.ticket.status} onChange={this.handleChange} className="form-control custom-select d-block w-100"  required>
                                                        <option value="pending">Pending</option>
                                                        <option value="opened">Opened</option>
                                                        <option value="closed">Closed</option>
                                                        <option value="canceled">Canceled</option>
                                                    </select>
                                                </div>

                                            </div>

                                            <div className="form-group">
                                                <label>Description</label>
                                                <textarea className="form-control" value={this.state.ticket.description} onChange={this.handleChange}  name="description"  placeholder="Brief description of problem" rows="5" required></textarea>
                                                { this.state.form_errors['description'] && (
                                                        <div className="invalid-feedback">{ this.state.form_errors['description'][0]}</div>
                                                )}
                                            </div>

                                            {
                                                this.state.ticket.status != 'pending' && (
                                                    <div className="form-group">
                                                        <label>Note</label>
                                                        <textarea className="form-control" value={this.state.ticket.note} onChange={this.handleChange}  name="note"  placeholder="" rows="5" required></textarea>
                                                        { this.state.form_errors['note'] && (
                                                            <div className="invalid-feedback">{ this.state.form_errors['note'][0]}</div>
                                                        )}
                                                    </div>

                                                )
                                            }


                                            {
                                                this.state.ticket.status == 'closed' && (
                                                    <div className="form-group">
                                                        <label>Feedback</label>
                                                        <textarea className="form-control" value={this.state.ticket.feedback} onChange={this.handleChange}  name="feedback"  placeholder="" rows="5" required></textarea>
                                                        { this.state.form_errors['feedback'] && (
                                                                <div className="invalid-feedback">{ this.state.form_errors['feedback'][0]}</div>
                                                        )}
                                                    </div>

                                                )
                                            }


                                            <hr></hr> 

                                            <div className="row">
                                                <div className="col-md-12">
                                                    <button type="submit" className="btn btn-success btn-sm float float-r" disabled={this.state.isSubmiting}> {this.state.isSubmiting? "Submiting...." : "Create Ticket"}</button>
                                                </div>
                                            </div>


                                        </form>

                                        
                                    )
                                }
                     
                            

                            
                        </div>

                    </div>
                
                </div>
        
            </React.Fragment>
         );
    }
}
 
export default connect(mapStateToProps)(Survey);