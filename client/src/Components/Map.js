/*global kakao*/
import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import Filter from './Filter';
import Result from './Result';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import './Map.css';

const getSuggestionValue = (suggestion) => suggestion.place_name;
const renderSuggestion = (suggestion) => (<div> {suggestion.place_name}</div>)

export default class Map extends Component {

    constructor(props) {
        super(props);
        this.state = {value: '',
                      suggestions: [],
                      filters: [],
                      kmap: null ,
                      places: null,
                      markers: [],
                      searchResults: [],
                      open: false,
                      radioValue:-1,
                      setRadioValue: -1};

        this.onChange = this.onChange.bind(this);
        this.searchCategoryCallback = this.searchCategoryCallback.bind(this);
        this.callback = this.callback.bind(this);
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
        this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
        this.onChangeFilter = this.onChangeFilter.bind(this);
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

        this.state.kmap.setCenter(new kakao.maps.LatLng(y,x));
        this.state.kmap.setLevel(3, {animate: true});
        this.state.kmap.setDraggable(false);

        this.setState({currentLoc:suggestion});
 
    }

    searchCategoryCallback(result, status, pagination) {
        this.clearMarkers();

        if (status === kakao.maps.services.Status.OK) {

            this.setState({searchResults : result});

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
  
    render() {
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
            <Container style ={{ 'margin-top' : '60px'}} >
            <Row>
                <Col>
                <Autosuggest
                        suggestions={suggestions.slice(0,3)}
                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                        onSuggestionSelected={this.onSuggestionSelected}
                        getSuggestionValue={getSuggestionValue}
                        renderSuggestion={renderSuggestion}
                        inputProps={inputProps}

                />
                </Col>
            </Row>

            <Row style ={{'margin-top': '55px'}}>
            <Col>
                <ButtonGroup toggle>
                {this.state.filters.map(function(d, idx){                  
                    const height = 100 / this.state.filters.length + "%";
                        return (
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
                       )
                    }, this)}
                </ButtonGroup> 
            </Col>
            </Row>
            <Row>
                <Col>
                <div id="Mymap" className ="mapContainer"> </div>
                </Col>

            </Row>
                    
            <Row>
                <Col>
                <div className ={resultclass}>
                    <Result searchResults = {this.state.searchResults} map = {this.state.kmap}/>
                </div>
                </Col>
            </Row>


            </Container>
        )
    }
}
