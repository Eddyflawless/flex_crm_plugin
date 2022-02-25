import React, {Component} from 'react';
import { connect } from "react-redux";
import Card from '../../card';
import store from '../../../store/store';
import NoData from '../../crm/views/no-data';

const mapStateToProps = (state)  => {
    return {
        call_logs: state.call_logs
    }
}

class CallLog extends Component {

    constructor(props) {

        super(props);
        this.pluckValue = this.pluckValue.bind(this);
    }

    state = {
        call_logs : []
    };

    storeChanged() {
        this.setState({ call_logs: this.props.call_logs });
    }

    handleFilterCallback = (query) =>{
        // this.setState({data: childData})
        console.log(query);
        console.log("filter callback called in parent");
    }

    pluckValue(val){
        return (val)? val : "n/a"
    }

    componentDidMount() {
        this.setState({call_logs: this.props.call_logs});
        this.storeChanged = this.storeChanged.bind(this);
        store.subscribe(this.storeChanged)
    }

    render() { 

        return ( 
            <React.Fragment>

                    { this.state.call_logs.length > 0 && (
                        <Card>


                                <>
                                    <div className="table-wrap">
                                        <div className="table-responsive">
                                            <table class="table mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Id</th>
                                                        <th>Ticket</th>
                                                        <th>Audio</th>
                                                        <th>Branch</th>
                                                        <th>Department</th>
                                                        <th>Phone</th>
                                                        <th>City</th>
                                                        <th>Country</th>
                                                        <th>State</th>
                                                        <th>Zip</th>
                                                        <th>Direction</th>
                                                        <th>Agent</th>
                                                        <th>Date</th>

                                                    </tr>
                                                </thead>
                                                <tbody>

                                                

                                                    {
                                                        this.state.call_logs.map((log,index) => (

                                                            <tr key={ index }>
                                                                <th scope="row">{ log.id}</th>
                                                                <td>
                                                                    <a href="javascript:void(1)">{ pluckValue(log.ticket_id)}</a>
                                                                </td>
                                                                <td>
                                                                    <audio>
                                                                        <source src={null} type="audio/mp3"></source>
                                                                    </audio>
                                                                </td>
                                                                <td>{ this.pluckValue(log.branch_name) } </td>
                                                                <td>{ this.pluckValue(log.department_name) } </td>
                                                                <td>{ this.pluckValue(log.caller_no) } </td>
                                                                <td>{ this.pluckValue(log.caller_phone) } </td>
                                                                <td>{ this.pluckValue(log.city) }  </td>
                                                                <td>{ this.pluckValue(log.country) } </td>
                                                                <td>{ this.pluckValue(log.state) }  </td>
                                                                <td>{ this.pluckValue(log.zip) }  </td>
                                                                <td>{ this.pluckValue(log.type) } </td>
                                                                <td>{ this.pluckValue(log.agent_id) } </td>
                                                                
                                                            </tr>
                                                        ))
                                                    }
                                
                                                
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                </>
                                    
                        </Card>
                    )}
        
                { this.state.call_logs.length == 0 && (

                    <NoData img_url="https://i.ibb.co/S7m4Y1q/attachment.png" 
                    title="No call logs on this contact" 
                    subtitle=""/>

                )}

            </React.Fragment>
         );
    }
}
 
export default connect(mapStateToProps)(CallLog);