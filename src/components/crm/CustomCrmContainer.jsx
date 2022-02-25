import React, {Component} from 'react';

// import Card from '../card';
import TicketList from './views/ticket-list';
import Profile from '../crm/views/profile';
import NoteList from './views/note-list';
import CallLog from '../crm/views/call-log';

import { Provider } from 'react-redux';

import Card from '../card';


import { connect } from "react-redux";
import store from '../../store/store';

import './style.css';

const mapStateToProps = (state)  => {
    return {
        contact: state.contact
    }
}


class CustomCrmContainer extends Component {

    state = { 
        contact: {},
        showProfile: false,
        isLoaded: false,
        tab_id: ""
     }

     constructor(props) {
        super(props);
        // this.setState({contact: store.getState().contact })   
     }

     storeChanged() { 
        this.setState({ contact: this.props.contact });
    }

    componentDidMount() {
        this.activeTabStyles = this.activeTabStyles.bind(this);
        this.setState({contact: this.props.contact})
        this.storeChanged = this.storeChanged.bind(this);
        store.subscribe(this.storeChanged);

    }

    getInitials() {

        var name = (store.getState().contact['full_name'])? store.getState().contact['full_name']: "John Doe";
        var initials = name.split(" ")[0].charAt(0) + name.split(" ")[1].charAt(0);

        return initials;
    }


    tabs = [
        { name: "Tickets", id: "tickets" },
        // { name: "Calls", id: "call-logs"},
        { name: "Notes", id: "notes"},
    ] 

    setTab(id){
        this.setState({ tab_id: id});
    }

    activeTabStyles(){
        return  "nav-link " + (this.state.tab_id == tab.id)? "active" : ""  ;
    }

    renderUsers(){

        // if(this.state.users.length === 0 && this.state.isLoaded === true) return <p>There are no users!</p>

        // if(this.state.users.length === 0 && this.state.isLoaded === false) return <p>Loading!</p>

        return (


            <section className="mt">

                <div className="tabs">
                    <ul className="nav nav-light bg-light pa-10 nav-tabs" style={{ backgroundColor0: "rgb(237, 237, 237)" }} role="tablist">
                        { this.tabs.map(tab => (
                            <li className="nav-item" key={tab.id}>
                                <a href="javascript:void(0)" onClick={() => this.setTab(tab.id)} data-href="tab.href" data-tab="active_requests" className={ `d-flex h-60p align-items-center nav-link ${ (tab.id == this.state.tab_id )? 'active' : ''}` }  style={{ fontSize: "14px" }}>{ tab.name}</a>
                            </li>

                        ))}
                    </ul>
                </div>

                <div className="tab-details mt-10">

                    { this.state.tab_id == 'tickets' && (

                        <TicketList />
                    )}


                    {/* { this.state.tab_id == 'call-logs' && (

                        <CallLog />
                    )} */}


                    { this.state.tab_id == 'notes' && (

                        <NoteList />
                    )}
                    
                
                </div>

            </section>


        )


     }

    componentDidMount() {



    }

    render() { 


        return ( 

            <Provider store={store}>

                <React.Fragment>

                    <div className="container crm-container">

                        <div className="hk-pg-header align-items-top mb-20">
                            <div>
                                <h4 className="hk-pg-title font-weight-600 mb-5">V0rtex CRM</h4>
                                <p>Questions about onboarding lead data? <a href="#">Learn more.</a></p>
                            </div>
                            <div className="d-flex w-500p"></div>
                        </div>


                        {/* <div class="card no-shadow mt-30">
                            <div class="card-body bg-light">
                                <div class="row">
                                    <div class="col-md-4">
                                        <h4 class="card-title">Madalyn Shane</h4>
                                        <p class="card-text">1234 Main St xyz, Sacremento, 12 Riverside Drive Redding, Union Street, CA-961001, US</p>
                                        <button type="button" class="btn btn-sm btn-dark mt-3">Collect Feedback</button>

                                    </div>

                                    <div class="col-md-8">
                                        <img src="https://i.ibb.co/1KDKdnP/success-banner-sm.png" className="img img-responsive float float-r" alt="success-banner-sm" border="0"/>
                                    </div>

                                </div>
                            </div>
                        </div> */}


                        <Card>

                            <div className="row">

                                <div className="col-md-12">
                                    <div className="media align-items-center">
                                        <div className="media-img-wrap  d-flex">
                                            <div className="avatar">
                                                <span className="avatar-text  avatar-text-inv-info rounded-circle"><span className="initial-wrap"><span>{ this.getInitials() }</span></span>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="media-body ml-15">
                                            <div>
                                                <h6 className="text-capitalize mb-5 font-weight-400">{ (store.getState().contact['full_name'])? store.getState().contact['full_name'] : "John Doe" }</h6>
                                                <div className="font-14">
                                                    <span className="mr-5">
                                                        <span className="font-weight-500 pr-5">{ store.getState().contact.phone}</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="block ">
                                                <button className="btn btn-xs mt-10 btn-info" onClick={() => this.setState({ showProfile: true})} type="button"> { store.getState().contact['contact_id'] ? "Edit Contact" : "Add Contact" }</button>
                                               { this.state.showProfile && (
                                                   <button className="btn btn-xs mt-10 btn-light ml-10" onClick={() => this.setState({ showProfile: false})} type="button"> Cancel </button>

                                               ) }

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> 

                        </Card>


                        { this.state.showProfile && (
                            <Profile />
                        )}

                        <hr></hr>

                        <>
                            { this.renderUsers()}
                        </>


                    </div>    


                </React.Fragment>

            </Provider>

         );
    }
}
 
export default connect(mapStateToProps)(CustomCrmContainer);