import React, { Component } from 'react';
import './Filter.css';

export default class Filter extends Component {

    sendIndex(index) {
        console.log(index);
        this.props.onChangeFilter(this.props.filterIndex);
    }
    
    render() {
        return (
            <div className ="containezr">            
            <button className="img-fluid" onClick={this.sendIndex.bind(this)} >
            <img className="img-fluid" 
            src={this.props.imgSrc} 
            alt="logo"/>
            </button>

            </div>
        )
    }
}
