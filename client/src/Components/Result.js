import React, { Component } from 'react';
import ResultCard from './ResultCard';
import Slider from "react-slick";
import Card from 'react-bootstrap/Card';
import './Result.css';
/*global kakao*/

export default class Result extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedFooter: 0
        }

        this.OnMoveCenter = this.OnMoveCenter.bind(this);

    }



    OnMoveCenter(x, y) {
        this.props.map.setCenter(new kakao.maps.LatLng(y,x));
        this.props.map.setLevel(3, {animate: true, duration: 3});
        this.props.map.setDraggable(false);
    }

    render() {

        const settings = {
            centerMode: false,
            infinite: true,
            centerPadding: "60px",
            slidesToShow: 2,
            speed: 500,
            rows: 2,
            slidesPerRow: 1,
            dots: true,
            beforeChange: (prevIndex, nextIndex) => {

            if (this.props.searchResults.length > 0)  {
            let data = this.props.searchResults[nextIndex];

            let x = parseFloat(data.x).toFixed(6);
            let y = parseFloat(data.y).toFixed(6);

            this.OnMoveCenter(x,y);
                this.setState({
                  selectedFooter: nextIndex
                });
            }
            }
          };        

        return (
  
            <Slider {...settings}>
            {this.props.searchResults.map(function(d, idx){                   
                    return ( 
                        <div className ="cardspace">
                        <ResultCard idx ={idx} result={d} sendClick = {this.OnMoveCenter}/>
                        </div>);
                }, this)}
            </Slider>
   
        )
    }
}

/*
                {this.props.searchResults.map(function(d, idx){                   
                    return ( 
                        <ResultCard idx ={idx} result={d} sendClick = {this.OnMoveCenter}/>);
                }, this)}
*/