import React from "react";
//import $ from "jquery";
import './App.css';

const numOfTopStoriesToFetch = 10;
const numOfTopCommentsToFetch = 20;
const defaultAgeMin = 18;
const defaultAgeMax = 90;
const defaultGender = "any";

// tmpSearchObj stores user's preferences before Filter button is clicked
let tmpSearchObj = [];
let warning = '';


class App extends React.Component {
    constructor() {
        super();

        this.state = {
            topStoriesIDs: [],
            areStoriesLoading: false,
            error: false,
            searchObj: {
                ageMin: defaultAgeMin,
                ageMax: defaultAgeMax,
                gender: defaultGender,
            },
            defaultSearchObj: {
                ageMin: defaultAgeMin,
                ageMax: defaultAgeMax,
                gender: defaultGender,
            },
            gender: defaultGender,
            showWarning: false,
        };
        // Handler bindings
        this.onInputChange = this.onInputChange.bind(this);
        this.onRadioBtnChange = this.onRadioBtnChange.bind(this);
        this.onResetBtnClick = this.onResetBtnClick.bind(this);
        this.onFilterBtnClick = this.onFilterBtnClick.bind(this);
        this.onToggleContactClick = this.onToggleContactClick.bind(this);
    }
    componentDidMount() {
        this.setState({areStoriesLoading: true});
        // fetch + API call
        fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
            .then(results => results.json())
            .then(data => this.setState({topStoriesIDs: data.slice(0,numOfTopStoriesToFetch), areStoriesLoading: false}))
            .catch(error => this.setState({error, areStoriesLoading: false}));
    }

    render() {
        console.log("topStoriesIDs = " + this.state.topStoriesIDs);
        const {areStoriesLoading, error} = this.state;
        // check for fetch errors and display them here
        if (error) {
            return <div className="error alert alert-danger makeVisible">
                <span className="feedbackText">ERROR: {error.message}</span>
            </div>
        }
        // show "Loading" text if loading data not finished
        if (areStoriesLoading) {
            return <div className="error alert alert-warning makeVisible">
                <span className="feedbackText">Loading...</span>
            </div>
        }

        return (<div id="App" className="App">
            <div id="appTitle"><h2 className="text-center">{this.state.topStoriesIDs}</h2></div>
        </div>)
    }


    capitalizeFirstLetter(text1){
        text1 = text1.toLowerCase()
            .split(' ')
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');
        return text1;
    }
    //Event Listeners
    onInputChange(el){
        let inputName = el.target.id;
        let inputValue = el.target.value;
        let searchObjCopy = Object.assign({}, tmpSearchObj);
        searchObjCopy[inputName] = Number(inputValue);
        tmpSearchObj = Object.assign({}, searchObjCopy);
    }
    onRadioBtnChange(el){
        let inputName = el.target.name;
        let inputValue = el.target.value;
        let searchObjCopy = Object.assign({}, tmpSearchObj);
        searchObjCopy[inputName] = inputValue;
        tmpSearchObj = Object.assign({}, searchObjCopy);
        this.setState({gender: inputValue});
    }
    onResetBtnClick(){
        // clear warnings
        warning = "";
        this.setState({showWarning: false});
        // reset searchObj to default values
        this.setState({searchObj: this.state.defaultSearchObj});
        // reset tmpSearchObj to default values
        tmpSearchObj = Object.assign({}, this.state.defaultSearchObj);
        // remove values from ageMin and ageMax fields
        //$('[data-id="ageMin"]').val('');
        //$('[data-id="ageMax"]').val('');
    }
    onFilterBtnClick() {
        // clear warnings
        warning = "";
        this.setState({showWarning: false});
        // check if user age entry fits within age parameters, show error if needed
        if (tmpSearchObj.ageMin < defaultAgeMin || tmpSearchObj.ageMax > defaultAgeMax) {
            warning = "ERROR: Age out of " + defaultAgeMin + " - " + defaultAgeMax + " range.";
            this.setState({showWarning: true});
            return;
        }
        // check if minAge > maxAge, show error if needed
        if (tmpSearchObj.ageMin > tmpSearchObj.ageMax) {
            warning = "ERROR: Minimum age exceeds maximum age.";
            this.setState({showWarning: true});
            return;
        }
        // user choices are valid, pass them to state
        this.setState({searchObj: tmpSearchObj});
    }
    onToggleContactClick(uid) {
        // toggle show/hide user contact info
        let contact = document.getElementById("userDialog"+uid);
        contact.style.display = ((contact.style.display==='none') ? 'block' : 'none');
    }
}
export default App;