import React, { Component } from 'react';
import Navbar from 'react-bootstrap/NavBar';
import './Topbar.css';

export default class Topbar extends Component {
    render() {
        return (
            <div>
                <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="#home">I think I can make a better platform than mango plate - james jang</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                    Signed in as: <a href="#login">James Jang</a>
                    </Navbar.Text>
                </Navbar.Collapse>
                </Navbar>
            </div>
        )
    }
}
