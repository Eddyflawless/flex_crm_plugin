import React, {Component} from 'react';
// import { bindActionCreators} from 'redux';

// function matchDispatchToProps(dispatch) {

//     return bindActionCreators(dispatch)
// }

class AdvanceFilter extends Component {

    state = {

        showSources: true,
        showStatus: true,
        showChannel: false,
        showPriority: false,
        showStartDate: true,
        showEndDate: true,
        filter: {
            source: null,
            status: null,
            channel: null,
            priority: null,
            start_date: null,
            end_date: null,
        }
    }

    constructor(props) {
        super(props);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.buildQuery = this.buildQuery.bind(this);
        this.emitFilterQuery = this.emitFilterQuery.bind(this);
    }



    handleOnChange(event){
        
        event.preventDefault();

        const { name, value } = event.target;

        var filter = this.state.filter;

        filter[`${name}`] = value;

        this.setState({filter });

    }

    emitFilterQuery() {

        const query = this.buildQuery();

        this.props.filterCallback(query)

    }

    buildQuery(){

        var query_params = {};
        Object.keys(this.state.filter).forEach(field => {

            if(this.state.filter[field]) query_params[field] = this.state.filter[field]
        })

        return query_params;
    }

    // buildQuery(){

    //     var query = "?";

    //     const { source, status, channel, priority, start_date, end_date } = this.state.filter;

    //     if(source) query += `source=${source}&`;

    //     if(status) query += `status=${status}&`;
        
    //     if(channel) query += `channel=${channel}&`;

    //     if(priority) query += `priority=${priority}&`;

    //     if(start_date) query += `start_date=${start_date}&`;

    //     if(end_date) query += `end_date=${end_date}`;

    //     return query;
    // }

    componentDidMount() {
        
        if(this.props.showSources) this.setState({ showSources: this.props.showSources});

        if(this.props.showStatus) this.setState({ showStatus: this.props.showStatus });

        if(this.props.showChannel) this.setState({ showChannel: this.props.showChannel });

        if(this.props.showPriority) this.setState({ showPriority: this.props.showPriority });

        if(this.props.showStartDate) this.setState({ showStartDate: this.props.showStartDate});

        if(this.props.showEndDate) this.setState({ showEndDate: this.props.showEndDate });

    }

    render() { 

        return ( 
            <React.Fragment>
                <div className="hk-pg-header align-items-top mb-30">
                    <div>
                        <h4 className="hk-pg-title font-weight-600 mb-5">Filters</h4>
                        <p></p>
                    </div>
                    <div className="row">

                        { this.state.showSources && (

                            <div className="col-2">

                                <div className="form-group">
                                    <label>Sources</label>
                                    <select name="source" onChange={this.handleOnChange} value={this.state.filter.source} class="form-control custom-select custom-select-sm">
                                        <option value="media">Media</option>
                                        <option value="media2">Media2</option>
                    
                                    </select>
                                </div>
                            </div>
                        )}

                         { this.state.showStatus && (
                            
                            <div className="col-2">
                                <div className="form-group">
                                    <label>Status</label>
                                    <select name="status" onChange={this.handleOnChange} class="form-control custom-select custom-select-sm">
                                        <option value="pending">Pending</option>
                                        <option value="opened">Open</option>
                                        <option value="closed">Closed</option>
                                        <option value="canceled">Canceled</option>
                                    </select>
                                </div>
                            </div>
                        )}


                         { this.state.showChannel && (
                            
                            <div className="col-2">
                                <div className="form-group">
                                    <label>Channel</label>
                                    <select name="channel" onChange={this.handleOnChange}  class="form-control custom-select custom-select-sm">
                                        <option selected value="call">Call</option>
                                        <option value="sms">Sms</option>
                                        <option value="web">Web</option>
                                        <option value="social-media">Social Media</option>
                                    </select>
                                </div>
                            </div>
                        )}



                         { this.state.showPriority && (
                            
                            <div className="col-2">
                                <div className="form-group">
                                    <label>Priority</label>
                                    <select name="priority" onChange={this.handleOnChange}  class="form-control custom-select custom-select-sm">
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>
                        )}



                         { this.state.showStartDate && (
                            
                            <div className="col-2">
                                <div className="form-group">
                                    <label>Start Date</label>
                                    <input name="start_date" type="date"  onChange={this.handleOnChange} className="form-control" />
                                </div>
                            </div>
                        )}


                         { this.state.showEndDate && (
                            
                            <div className="col-2">
                                <div className="form-group">
                                    <label>End Date</label>
                                    <input name="end_date" type="date"  onChange={this.handleOnChange} className="form-control" />
                                </div>
                            </div>
                        )}

                            <div className="col-2">
                                <div className="form-group">
                                    <label>&nbsp</label>
                                    <button className="btn btn-primary" onClick={this.emitFilterQuery}>Filter</button>
                                </div>
                            </div>



                    </div>
                </div>
        
            </React.Fragment>
         );
    }
}
 
export default AdvanceFilter;