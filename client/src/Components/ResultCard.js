import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import Card from 'react-bootstrap/Card';
import './ResultCard.css';

export default class ResultCard extends Component {

    constructor(props) {
        super(props);

        this.state = { shopData : null,
                        showModal: false,
                        loaded: false,
                        imgUrl : process.env.PUBLIC_URL + '/choco.jpg'};

    }
    componentDidMount() {

        fetch('http://localhost:9000/api/shop/data/' + this.props.result.id)
        .then((response) => {
            return response.json();
        }).then((parsedData) =>{
            this.setState({shopData: parsedData});

            if (this.state.shopData != null) {
            if (this.state.shopData.main_img != "")
                this.setState({imgUrl : this.state.shopData.main_img});
            }
        });

    }
    sendSelection() {
        let x = parseFloat(this.props.result.x).toFixed(6);
        let y = parseFloat(this.props.result.y).toFixed(6);

        this.props.sendClick(x, y);
    }


    render() {
        const handleOpen = () => this.setState({showModal : true});
        const handleClose = () => this.setState({showModal : false});

        return (
            <div>
                <Modal show={this.state.showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>{this.state.shopData == null ?'placeHolderText' :this.state.shopData.shop_name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>                
                <h1>{this.state.shopData == null ?'placeHolderText' :this.state.shopData.shop_name}</h1> <br/>
                <h5>Rating: {this.state.shopData == null ?'placeHolderText' : this.state.shopData.kakao_rating == "" ? 0 : this.state.shopData.kakao_rating}</h5> 
                <h5>Food: {this.state.shopData == null ?'placeHolderText' :this.state.shopData.shop_category}</h5> <br />


                </Modal.Body>

                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleClose}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>

            <a style={{ cursor: 'pointer' }} onClick={handleOpen}>
            <Card>

            <Card.Img variant="top" src={this.state.imgUrl} />
            <Card.Header> 
            {this.state.shopData == null ?'placeHolderText' : this.state.shopData.kakao_rating == "" ? "Not Yet Rated" : this.state.shopData.kakao_rating }
            </Card.Header>
            <div className="titleContainer">
            <h5> {this.state.shopData == null ?'placeHolderText' :this.state.shopData.shop_name} </h5>
            </div>
 

       
            </Card>
            </a>
            </div>
        )
    }
}

/*

            <Card.Header> 
            {this.state.shopData == null ?'placeHolderText' :this.state.shopData.shop_name}
            </Card.Header>

            <Button onClick ={handleOpen} >
                <h2><span>{this.state.shopData == null ?'placeHolderText' :this.state.shopData.shop_name} </span></h2>
            </Button>

                            <Modal show={this.state.showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>{this.state.shopData == null ?'placeHolderText' :this.state.shopData.shop_name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>                
                <h1>{this.state.shopData == null ?'placeHolderText' :this.state.shopData.shop_name}</h1> <br/>
                <h5>Rating: {this.state.shopData == null ?'placeHolderText' : this.state.shopData.kakao_rating == "" ? 0 : this.state.shopData.kakao_rating}</h5> 
                <h5>Food: {this.state.shopData == null ?'placeHolderText' :this.state.shopData.shop_category}</h5> <br />


                </Modal.Body>

                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleClose}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>
*/