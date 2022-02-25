import React, {Component} from 'react';

import NoData from '../../crm/views/no-data';

import { connect } from "react-redux";

import ContactApi from "../../../api/contact";

import Notifier from '../../../lib/Notifier';

import ErrorHandler from '../../../lib/Errorhandler';

import store from '../../../store/store';

import { addNote } from '../../../store/actions';

const mapStateToProps = (state)  => {
    return {
        notes: state.notes,
        contact: state.contact,
        task_attributes: state.task_attributes
    }
}

class NoteList extends Component {

    ready = false;

    state = {
        note: "",
        contact: {},
        is_submiting: false,
        task_attributes: {},
        notes: []
    }; 
    
    
    constructor(props) {
        super(props);
        this.pluckValue = this.pluckValue.bind(this);

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

    handleChange =(event) =>{
        event.preventDefault();

        const {  value } = event.target;

        this.setState({ note: value })
    }
    
    pluckValue(val){
        return (val)? val : "n/a"
    }

    storeChanged() {
    
        this.setState({ notes: this.props.notes, contact: this.props.contact, task_attributes: this.props.task_attributes });

    }

    async createNote(e) {

        try {
            
            Notifier.showLoader();

            e.preventDefault();
    
            if(!window.confirm("Continue with operation")) return;
            
            var form_data = {
                note: this.state.note,
                contact_id: this.state.contact['contact_id']
            };

            form_data = this.attachTaskAttributes(form_data);

            var response = await ContactApi.createNote(form_data);

            if(response.data) {
                //
                window.alert("Note added to contact");
                this.setState({ note: null });
                store.dispatch(addNote(
                    { id: 'v2001', note: this.state.note }
                ));

            }
    

        } catch (error) {

            ErrorHandler(error)
            
        }finally {
            Notifier.hideLoader();
        }

    }

    componentDidMount() { 

        this.setState({notes: this.props.notes, contact: this.props.contact, task_attributes: this.props.task_attributes });
        this.createNote = this.createNote.bind(this);
        this.storeChanged = this.storeChanged.bind(this);
        store.subscribe(this.storeChanged)

    }

    render() { 

        return ( 
            <React.Fragment>

                <form>
                    <input className="form-control" rows="4"  onChange={this.handleChange} placeholder="quick note" required/>

                    <div className="row mt-10">
                        <div className="col-md-12">
                            <button type="button" onClick={ this.createNote }  className="btn btn-dark btn-sm float float-r">Add Note</button>
                        </div>
                    </div>
                </form> 

                <div className="row mt-20">
                    <div className="col-md-12">

                        { this.state.notes.length > 0 && (

                            <>
                            
                                {
                                    this.state.notes.map( note => (

                                    <div className="list-group" key={ note.id}>
                                        <a href="#" className="list-group-item list-group-item-action flex-column align-items-start mb-10">


                                            <div className="media align-items-center">
                                                <div className="media-img-wrap  d-flex">
                                                    <div className="avatar avatar-sm">
                                                        <span className="avatar-text  avatar-text-inv-info rounded-circle">
                                                            <span className="initial-wrap">
                                                                <span>N</span>
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="media-body ml-15">
                                                    <div className="w-100 justify-content-between mb-10">
                                                        <span className="mb-1 cute-header">Note #{note.id}</span>
                                                        <small className="ml-20">{ note.created_at}</small>
                                                    </div>

                                                    <p className="mb-1">{ note.note}</p>
                                                </div>
                                            </div>

                                        </a>
                                    
                                    </div>

                                    ))
                                }

                            </>

                        )}


                        { this.state.notes.length == 0 && (

                            <NoData img_url="https://i.ibb.co/S7m4Y1q/attachment.png" 
                            title="No Notes on this contact" 
                            subtitle=""/>

                        )}
                    </div>
                </div>
        
            </React.Fragment>
         );
    }
}
 
export default connect(mapStateToProps)(NoteList);