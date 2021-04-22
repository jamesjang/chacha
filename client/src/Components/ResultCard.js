import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
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
            <div className="image">
            <Button onClick ={handleOpen} >
                <img src={this.state.imgUrl}/>
                <h2><span>{this.state.shopData == null ?'placeHolderText' :this.state.shopData.shop_name} </span></h2>
            </Button>
                </div>
            </div>
        )
    }
}
