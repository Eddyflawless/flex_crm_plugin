import React from 'react';

const Card =  (props)  => {
    var {title, subtitle} = props;

    return (

        <div className="card bg-gray-2008 bg-light bd-0 no-shadow">
            <div className="card-body">
                <h5 className="card-title tx-dark tx-medium mg-b-10">{title}</h5>
                <p className="card-subtitle mg-b-15">{subtitle && ''}</p>
                <div className="card-content">
                    {props.children}
                </div>

        
            </div>
        </div>
           
    )
}

export default Card;