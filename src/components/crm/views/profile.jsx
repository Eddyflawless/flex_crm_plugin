import React, {Component} from 'react';

import Card from '../../card';

import { connect } from "react-redux";

import ContactApi from "../../../api/contact";

import store from '../../../store/store';

import Notifier from '../../../lib/Notifier';

import ErrorHandler from '../../../lib/Errorhandler';

import { addContact } from '../../../store/actions';

const mapStateToProps = (state)  => {
    return {
        contact: state.contact,
        task_attributes: state.task_attributes
    }
}

class Profile extends Component {

    state = { 
        contact: {
            first_name: "",
            last_name: "",
            dob: null,
            source: null,
            city: null,
            zip: null,
            address: null,
            email: null,
            phone: null,
            source: null,
            twitter: null,
            facebook: null,
            newsletter_subscribe: true,
        },
        task_attributes: {},
        from_valid: false,
        form_errors:{ },
        isSubmiting: false,
        ready: true
     }


     constructor(props) {
        super(props);
        this.attachTaskAttributes = this.attachTaskAttributes.bind(this);

    } 

    storeChanged() {
        this.setState({ contact: this.props.contact, task_attributes: this.props.task_attributes});
    }

    handleChange = (event) => { 
        event.preventDefault();

        var { name, value } = event.target;
        
        var contact = this.state.contact;

        switch(name){
            case 'first_name':

                if (/[^a-zA-Z\s]+/g.test(value)) value = value.replace(/[^a-zA-Z\s]+/, '')
                value = value.trim();
                break;
            case 'last_name':
                if (/[^a-zA-Z\s]+/g.test(value)) value = value.replace(/[^a-zA-Z\s]+/, '')
                value = value.trim();
                break;
            case 'phone_number':
                if (/\D/g.test(value)) value = value.replace(/\D/g, '')
                ///^(233)([0-9]{9})$/
                if(value.length > 12) {
                    value = value.trim().slice(0,12);
                    // Notifier.reportInfo("Phone number cannot be more than 12 digits")
                }
                break; 
            case 'email':
                value = value.trim();
                break

        }

        contact[`${name}`] = value;

        this.setState({contact});

    }

    handleChangeOld = (event) => { 
        event.preventDefault();

        const { name, value } = event.target;
        
        var contact = this.state.contact;

        switch(name){
            case 'first_name':

                if (/[^a-zA-Z\s]+/g.test(event.target.value)) event.target.value = event.target.value.replace(/[^a-zA-Z\s]+/, '')
                event.target.value = value.trim();
                break;
            case 'last_name':
                if (/[^a-zA-Z\s]+/g.test(event.target.value)) event.target.value = event.target.value.replace(/[^a-zA-Z\s]+/, '')
                event.target.value = value.trim();
                break;
            case 'phone_number':
                if (/\D/g.test(event.target.value)) event.target.value = event.target.value.replace(/\D/g, '')
                ///^(233)([0-9]{9})$/
                if(value.length > 12) {
                    event.target.value = value.trim().slice(0,12);
                    alert("Phone number cannot be more than 12 digits")
                }
                break; 
            case 'email':
                event.target.value = value.trim();
                break

        }

        contact[`${name}`] = event.target.value;

        this.setState({contact});

    }

    attachTaskAttributes = (form_data) => {

        var attributes = this.state.task_attributes;

        form_data['meta'] = attributes;

        form_data['country'] = attributes['caller_country'];

        form_data['state'] = attributes['caller_state'];

        form_data['city'] = attributes['caller_city'];

        form_data['zip'] = attributes['caller_zip'];

        if(attributes['caller']) form_data['phone'] = attributes['caller'];

        if(attributes['name']) form_data['phone'] = attributes['name'];

        return form_data;
    } 


    submitContact = async (e) => {

        e.preventDefault();

        var response_message = (this.state.contact['contact_id']) ? "Contact updated" : "Contact added successfully";

        this.setState({ isSubmiting: true});
        
        Notifier.showLoader();

        try {
            
            var form_data = this.state.contact;
    
            var method = (this.state.contact['contact_id'])? "updateContact" : "createContact"; 

            form_data = this.attachTaskAttributes(form_data);
    
            var response = await ContactApi[method](form_data);

            if(response.data) {
                store.dispatch(addContact(response.data.contact));
                window.alert(response_message);
                this.setState( { })

            }
    
        } catch (error) {

            ErrorHandler(error);
            Notifier.reportFailure("An error occured. Try again later!");        
            
        }finally{
            this.setState({ isSubmiting: false})
            Notifier.hideLoader();
        }
    
    }

    componentDidMount() {

        this.setState({contact: this.props.contact, task_attributes: this.props.task_attributes});

        this.storeChanged = this.storeChanged.bind(this);

        store.subscribe(this.storeChanged)
    }

    render() { 

        return ( 
            <React.Fragment>

                    <div className="row">

                        <div className="col-md-7 mb-20">
                            <Card>

                                {/* <div class="alert alert-info alert-dismissible fade show" role="alert">
                                    <h4 class="alert-heading mb-5">Hi!</h4>Some of the fields will be autofillef for you.
                                </div> */}

                                <form onSubmit={this.submitContact}>

                                <div className="row">
                                    <div className="col-md-6 form-group">
                                        <label>First name (required)</label>
                                        <input className="form-control" name="first_name" onChange={this.handleChange} value={this.state.contact.first_name} placeholder="eg. John" type="text" required/>

                                        { this.state.form_errors['first_name'] && (
                                            <div className="invalid-feedback">{ this.state.form_errors['first_name'][0]}</div>
                                        )}
                                        
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <label>Last name(s) (required)</label>
                                        <input className="form-control" name="last_name" onChange={this.handleChange} placeholder="eg. Lawson Andrews" value={this.state.contact.last_name}  type="text" required/>
                                        { this.state.form_errors['last_name'] && (
                                            <div className="invalid-feedback">{ this.state.form_errors['last_name'][0]}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="row">

                                    <div className="col-md-6 form-group">
                                        <label>Email </label>
                                        <input className="form-control" name="email" onChange={this.handleChange} value={this.state.contact.email} placeholder="eg. laws140.gtrs@gmail.com" type="email"/>

                                        { this.state.form_errors['email'] && (
                                            <div className="invalid-feedback">{ this.state.form_errors['email'][0]}</div>
                                        )}

                                    </div>

                                    <div className="col-md-6 form-group">
                                        <label>Date of Birth</label>
                                        <input className="form-control" name="dob" onChange={this.handleChange} value={this.state.contact.dob} type="date"/>
                                        { this.state.form_errors['dob'] && (
                                            <div className="invalid-feedback">{ this.state.form_errors['dob'][0]}</div>
                                        )}

                                    </div>
                                </div>

                                <hr></hr>


                                <div className="form-group">
                                    <label>Address</label>
                                    <textarea className="form-control" name="address" onChange={this.handleChange} value={this.state.contact.address} placeholder="1234 Main St" rows="3"></textarea>
                                    { this.state.form_errors['address'] && (
                                            <div className="invalid-feedback">{ this.state.form_errors['address'][0]}</div>
                                    )}
                                </div>

                                <div className="row">

                                    <div className="col-md-6 form-group">
                                        <label>Twitter</label>
                                        <input className="form-control" name="twitter" value={ this.state.contact.twitter} onChange={this.handleChange}  placeholder="eg.@desm0nd_l0rd" type="text"/>

                                        { this.state.form_errors['twitter'] && (
                                            <div className="invalid-feedback">{ this.state.form_errors['twitter'][0]}</div>
                                        )}

                                    </div>

                                    <div className="col-md-6 form-group">
                                        <label>Facebook</label>
                                        <input className="form-control" name="facebook" placeholder="eg.@desm0nd_l0rd" onChange={this.handleChange} value={ this.state.contact.facebook}  type="text"/>

                                        { this.state.form_errors['facebook'] && (
                                            <div className="invalid-feedback">{ this.state.form_errors['facebook'][0]}</div>
                                        )}

                                    </div>
                                </div>

                                <div className="row mt-30">
                                    <div className="col-md-12">
                                        <button type="submit"  className="btn btn-success btn-sm btn-block float float-r" disabled={this.state.isSubmiting }> {this.state.isSubmiting? "Submiting...." : "Save Contact"}</button>
                                    </div>
                                </div>


                            </form>

                        
                            </Card>

                        </div>

                        <div className="col-md-5  mb-20">
                            {/* <p class="mb-10">Donec at sapien aliquet nulla vulputate posuere. Ut sagittis nisl non tristique consectetur. Nullam et est orci.</p>
                            <p><a href="#">Ubique veritus mediocrem</a> Aliquam luctus viverra enim, ut dapibus nunc condimentum tempor.</p> */}

                        </div>


                    </div>
        



        
            </React.Fragment>
         );
    }
}
 
export default connect(mapStateToProps)(Profile);