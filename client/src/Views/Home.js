import React, { Component } from 'react';
import Map from '../Components/Map';
import Topbar from '../Components/Topbar';
import Footer from '../Components/Footer';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Home.css';

export default class Home extends Component {

    constructor(props){
        super(props);
        this.state = {results: [] };

        this.onGetResults = this.onGetResults.bind(this);
    }

    onGetResults(data) {
        this.setState({results: data});
    }
    render() {
        return (
            <div className ="Containersb">
            <Topbar />
            <div>
            <Container>
            <Row>
                <Col> olka</Col>

                <Col></Col>
            </Row>
            </Container>
            </div>
            <Footer />
            </div>

        )
    }
}
