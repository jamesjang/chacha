/*global kakao*/
import React, { Component } from 'react';
import Navbar from 'react-bootstrap/NavBar';
import Nav from 'react-bootstrap/Nav';
import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';
import Fade from 'react-bootstrap/Fade';
import Result from './Result';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Autosuggest from 'react-autosuggest';
import Button from 'react-bootstrap/Button';
import './Topbar.css';

const getSuggestionValue = (suggestion) => suggestion.place_name;
const renderSuggestion = (suggestion) => (<div> {suggestion.place_name}</div>)

export default class Topbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openCard: true,
            value: '',
            suggestions: [],
            filters: [],
            kmap: null ,
            places: null,
            markers: [],
            searchResults: [],
            open: false,
            radioValue:-1,
            setRadioValue: -1,
            suggestedX: 0,
            suggestedY: 0,
            cardLoaded: true,
            loadResults: false
        };

        this.onOpen = this.onOpen.bind(this);
        this.onChange = this.onChange.bind(this);
        this.searchCategoryCallback = this.searchCategoryCallback.bind(this);
        this.callback = this.callback.bind(this);
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
        this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
        this.onChangeFilter = this.onChangeFilter.bind(this);
        this.loadCards = this.loadCards.bind(this);
        this.hideCard = this.hideCard.bind(this);
    }

    
    componentDidMount() {
        const script = document.createElement("script");

        script.src =  "https://dapi.kakao.com/v2/maps/sdk.js?appkey=83912847a89a1673ee56d9382d986f3f&autoload=false&libraries=services";
        script.async = true;

        document.body.appendChild(script);

        script.onload = () => {
            kakao.maps.load(() => {
              let container = document.getElementById("Mymap");
              let options = {
                center: new kakao.maps.LatLng(37.506502, 127.053617),
                level: 5
              };

                this.setState({kmap : new window.kakao.maps.Map(container, options)});

                //added
                this.setState({places: new kakao.maps.services.Places()});
            });
        };

        this.loadFilterData();
    }

    loadFilterData() {
        fetch('http://localhost:9000/api/' + "filter/all")
        .then(response => response.json())
        .then(data =>
          this.setState({filters : data})
          
        );
        
    }

    onOpen() { 
        this.setState({openCard : !this.state.openCard});

    }


    callback(result, status) {
        if (status === kakao.maps.services.Status.OK) {
            let a = result;
            this.setState({suggestions : a}); 
        }
    }

    onSuggestionsFetchRequested = ({ value }) => {
        this.state.places.keywordSearch(value, this.callback);

    }

    onSuggestionsClearRequested() {
        this.setState({suggestions: []});    
    }

    onChange = (event, { newValue, method }) => {     
        this.setState({ value: newValue });
    }

    onSuggestionSelected(event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) {

        let x = parseFloat(suggestion.x).toFixed(6);
        let y = parseFloat(suggestion.y).toFixed(6);
    
        if (!this.state.openCard) {
            this.setState({openCard: true});
    
        this.setState({suggestedX: x});
        this.setState({suggestedY: y});
       
        } else {
            this.state.kmap.setCenter(new kakao.maps.LatLng(y,x));
            this.state.kmap.setLevel(3, {animate: true});
            this.state.kmap.setDraggable(false);
        }

    }

    searchCategoryCallback(result, status, pagination) {
        this.clearMarkers();

        if (status === kakao.maps.services.Status.OK) {

            this.setState({searchResults : result});
            this.setState({loadResults: true});
            result.map((item, index) => {

                console.log(item);
                let x = parseFloat(item.x).toFixed(6);
                let y = parseFloat(item.y).toFixed(6);

                var marker = new kakao.maps.Marker({
                    position: new kakao.maps.LatLng(y, x)
                });

                marker.setMap(this.state.kmap);

                this.state.markers.push(marker);

                this.state.kmap.setDraggable(true);
                
            });

        }
    }

    onChangeFilter(index) {
        let x = parseFloat(this.state.kmap.getCenter().La).toFixed(6);
        let y = parseFloat(this.state.kmap.getCenter().Ma).toFixed(6);

        let keyword = '';
        this.setState({searchResults : []});
        switch(index) {
            case '0':
            keyword = '중식';
            break;
            case '1':
            keyword = '양식';
            break;
            case '2':
            keyword = '일식';
            break;
            case '3':
            keyword = ' 고기';
            break;
            case '4':
            keyword = '탕';
            break;
        }
        console.log(keyword);
        this.state.places.keywordSearch(keyword.toString() , this.searchCategoryCallback, {
            location: new kakao.maps.LatLng(y, x)
        });

        this.state.kmap.setLevel(5, { animate :true });
    }

    clearMarkers() {
        this.state.markers.map((item, index) => {
            item.setMap(null);
        })
    }

    loadCards() {
        this.setState({cardLoaded: true});

        this.state.kmap.relayout();
        this.state.kmap.setCenter(new kakao.maps.LatLng(this.state.suggestedY,this.state.suggestedX));
        this.state.kmap.setLevel(3, {animate: true});
        this.state.kmap.setDraggable(false);
        this.state.kmap.relayout();
    }

    hideCard() {
        this.setState({openCard: false});
        this.setState({suggestions: []});
        this.setState({searchResults : []});
        this.onSuggestionsClearRequested();
    }

    render() {
        const { openCard, cardLoaded, loadResults } = this.state;

        const { value, suggestions } = this.state;
        
        // Autosuggest will pass through all these props to the input.
        const inputProps = {
            placeholder: '지역을 선택 해주세요',
            value,
            onChange: this.onChange
        };

        const resultclass = this.state.searchResults.length > 0 ? 'sas' : 'sas hide';

        const setRadioValue = (idx) => {
            this.setState({setRadioValue : idx}) ;
            this.onChangeFilter(idx);
        } 


        return (
            <div>
          
            <Container fluid style ={{padding: '0'}}>
            
            <Navbar bg="dark" variant="dark">
        
                <Col >
                <Navbar.Brand href="#home">Chomi</Navbar.Brand>
                </Col>

                <Col xs={6}>
                <Nav className="justify-content-center">
                    <Autosuggest
                            suggestions={suggestions.slice(0,3)}
                            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                            onSuggestionSelected={this.onSuggestionSelected}
                            getSuggestionValue={getSuggestionValue}
                            renderSuggestion={renderSuggestion}
                            inputProps={inputProps}
                    
                    />
                </Nav>
                </Col>
                <Col >
                <Nav className="justify-content-end">
                <Navbar.Text >
                Signed in as: <a href="#login">JamesJang</a>
                </Navbar.Text>
                </Nav>
                </Col>
   
            </Navbar>

            </Container>

 

            <Collapse in={openCard} 
                onEntered = {this.loadCards}>
                
            <Card  className="cardsz"
                bg="dark" variant="dark">

                <Card.Body>
                <Container style ={{ 'margin-top' : '60px'}} >
            
                <Row style ={{'margin-top': '55px'}}>
                <Col md ={4}>
                    <ButtonGroup toggle>
                    {this.state.filters.map(function(d, idx){                  
                        const height = 100 / this.state.filters.length + "%";
                            return (
                                <Fade in={this.state.cardLoaded}>
                                <ToggleButton
                                key={idx}
                                type="radio"
                                variant="secondary"
                                name="radio"
                                value={idx}
                                checked={this.state.setRadioValue === idx}
                                onChange={(e) => setRadioValue(e.currentTarget.value)}
                                
                            >
                                {d.category}
                            </ToggleButton>
                            </Fade>
                        )
                        }, this)}
                    </ButtonGroup> 

                </Col>
                <Col  md={{ span: 1, offset: 7 }} 
                    onClick={this.hideCard} >
                    <Button variant="outline-light" className="exitbtn">Close</Button>
                </Col>
                </Row>
                <Row>
                <Fade in={this.state.cardLoaded}>
                    <Col fluid>
                    <div id="Mymap" className ="mapContainer"> </div>
                    </Col>
                </Fade>
                <Collapse in={loadResults}>
                <Col xs={4} >
         
                        <Card className ="resultContainerz" bg={"dark"}>
                 
                        <Result searchResults = {this.state.searchResults} map = {this.state.kmap}/>
                        
                     
                        </Card>
     
                </Col>
                </Collapse>
                </Row>
                         
                </Container>
                </Card.Body>
                </Card>
            </Collapse>

            </div>
        )
    }
}
