import React, {Component} from 'react';
import { connect } from "react-redux";
import NoData from '../../crm/views/no-data';
import Card from '../../card';
import store from '../../../store/store';

const mapStateToProps = (state)  => {
    return {
        campaigns: state.campaigns
    }
}

class CampaignList extends Component {

    state = {
        campaigns : [],
        contact_id: null,
    };


    pluckValue(val){
        return (val)? val : "n/a"
    }

    constructor(props) {
        super(props);
        this.pluckValue = this.pluckValue.bind(this);

    }

    storeChanged() {
        this.setState({ campaigns: this.props.campaigns });
    }

    componentDidMount() {
        this.setState({campaigns: this.props.campaigns});
        this.setState( { contact_id: this.props.contact});
        this.storeChanged = this.storeChanged.bind(this);
        store.subscribe(this.storeChanged);
    }

    render() { 

        return ( 
            <React.Fragment>

                { this.state.campaigns.length > 0 && (

                    <>

                        <Card>

                            <div className="table-wrap">
                                <div className="table-responsive">
                                    <table className="table mb-0" id="example">
                                        <thead>
                                            <tr>
                                                <th>Id</th>
                                                <th>Subject</th>
                                                <th>Message</th>
                                                <th>Email</th>
                                                <th>Sms</th>
                                                <th>Call</th>
                                                <th>Department</th>
                                                <th>Branch</th>
                                                <th>Owner</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                        

                                            {
                                                this.state.campaigns.map((campaign,index) => (

                                                    <tr key={ index }>
                                                        <th scope="row">{ this.pluckValue(campaign.id) }</th>
                                                        <td>{ this.pluckValue(campaign.subject) }</td>
                                                        <td>{ this.pluckValue(campaign.message) }</td>
                                                        <td>{ this.pluckValue(campaign.email) }</td>
                                                        <td>{ this.pluckValue(campaign.sms) }</td>
                                                        <td>{ this.pluckValue(campaign.call)  } </td>
                                                        <td>{ this.pluckValue(campaign.department)  }</td>
                                                        <td>{ this.pluckValue(campaign.branch) } </td>
                                                        <td>{ this.pluckValue(campaign.agent_id)  } </td>
                                                        <td>{ this.pluckValue(campaign.created_at)  }</td>
                                                        
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


                
                { this.state.campaigns.length == 0 && (

                    <NoData img_url="https://i.ibb.co/S7m4Y1q/attachment.png" 
                    title="No campaigns on this contact" 
                    subtitle=""/>

                )}
        
            </React.Fragment>
         );
    }
}
 
export default connect(mapStateToProps)(CampaignList);