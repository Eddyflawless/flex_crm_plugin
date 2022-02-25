import React, {Component} from 'react';

import Card from "../../card";

class NoData extends Component {


    constructor(props) {
        super(props);
        this.figureStyles = this.figureStyles.bind(this);
    }
    figureStyles = () => {

        var css = "mt-20";
        var additional_css =  (this.props.size)? `${this.props.size}` : "thumbnail-2";

        var p =  css + " " + additional_css;
        console.log("figure styles", p);
        return p;
    }

    render() { 

        return ( 
            <React.Fragment>
                <div className="container d-flex " style={{ flexDirection: 'column' }}>

                    <Card>

                        <div className="text-center">

                
                            <figure className={  this.figureStyles() } >
                                <img  src={ this.props.img_url} data-src="https://i.ibb.co/Mcd3VVD/getting-started-project-board.png" alt="image-placeholder" border="0"/>
                            </figure>

                            <div className="text-center">
                                <h4 className="mt-30">{ (this.props.title )? this.props.title: "No data available" }</h4>
                                <p className="mt-20">{ (this.props.subtitle)? this.props.subtitle: "" }</p>

                            </div>

                        </div>


                    </Card>


                </div>
        
            </React.Fragment>
         );
    }
}
 
export default NoData;