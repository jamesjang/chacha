import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Footer.css';

export default class Footer extends Component {
    render() {
        return (
            <div className ="footer">

            <p> Copyright &copy; {new Date().getFullYear()} James Jang. All Rights Reserved </p>
            </div>

        )
    }
}

/*
            <Container style ={{marginTop: "20px"}}>
            <Row>
                <Col>
                Im hiring better devs than zigbang
                </Col>
                <Col>
                Contact me somehow
                </Col>
            </Row>
            </Container>
*/