import React from "react";
//import $ from "jquery";
import './App.css';

const numOfCandidatesToFetch = 10;
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
            candidates: [],
            isLoading: false,
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
        this.setState({isLoading: true});
        // set tmpSearchObj to default values
        tmpSearchObj = Object.assign({}, this.state.defaultSearchObj);
        // fetch + API call
        fetch()
            .then('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty')
            .then(results => results.json())
            .then(data => this.setState({candidates: data.results, isLoading: false}))
            .catch(error => this.setState({error, isLoading: false}));
    }
        /*fetch('https://randomuser.me/api/?results='+numOfCandidatesToFetch)
            .then(results => results.json())
            .then(data => this.setState({ candidates: data.results, isLoading: false }))
            .catch(error => this.setState({ error, isLoading: false }));
    }*/
    render() {
        const {isLoading, error} = this.state;
        // check for fetch errors and display them here
        if (error) {
            return <div className="error alert alert-danger makeVisible">
                <span className="feedbackText">ERROR: {error.message}</span>
            </div>
        }
        // show "Loading" text if loading data not finished
        if (isLoading) {
            return <div className="error alert alert-warning makeVisible">
                <span className="feedbackText">Loading...</span>
            </div>
        }
        // filter candidates by min and max age set in this.state.searchObj
        let filteredCandidates = this.state.candidates.filter(candidate => (candidate.dob.age >= this.state.searchObj.ageMin
            && candidate.dob.age <= this.state.searchObj.ageMax));
        // filter by gender if set in this.state.searchObj
        if (this.state.searchObj.gender !== 'any') {
            filteredCandidates = filteredCandidates.filter(candidate => (candidate.gender === this.state.searchObj.gender));
        }
        return (<div id="App" className="App">
            <div id="appTitle"><h2 className="text-center">Search Criteria</h2></div>
            <div className="text-center formElements">
                <label className="control-label labelText">Age</label>
                <input id="ageMin" data-id="ageMin" ref="ageMin" type="text" placeholder={defaultAgeMin}
                       onChange={ (e)=>{this.onInputChange(e)} } /> <span className="labelText">to</span> <input id="ageMax" data-id="ageMax" ref="ageMax" type="text"  placeholder={defaultAgeMax}
                                                                                                                 onChange={ (e)=>{this.onInputChange(e)} } />
            </div>
            <div className="form-group text-center formElements">
                <label className="control-label labelText">Gender</label>
                <label className="radio-inline"><input className="formElements" type="radio" name="gender" data-id="genderAny" value="any" onChange={ (e)=>{this.onRadioBtnChange(e)} } checked={tmpSearchObj.gender === 'any'}/>Any</label>
                <label className="radio-inline"><input className="formElements" type="radio" name="gender" data-id="genderMale" value="male" onChange={ (e)=>{this.onRadioBtnChange(e)} } />Male</label>
                <label className="radio-inline"><input className="formElements" type="radio" name="gender" data-id="genderFemale" value="female" onChange={ (e)=>{this.onRadioBtnChange(e)} } />Female</label>
            </div>
            <div className="text-center formElements">
                <button type="button" className="btn btn-default formElements" data-id="buttonReset" onClick={this.onResetBtnClick}>Reset</button>
                <button type="submit" className="btn btn-outline-info formElements" data-id="buttonFilter" onClick={this.onFilterBtnClick}>Filter</button>
            </div>
            {/*Display user entry warnings or search feedback here*/}
            {this.state.showWarning ?
                <div className={"feedbackStrip alert alert-danger " + (this.state.showWarning ? " makeVisible" : "")}>
                    <span className="feedbackText">{warning}</span>
                </div> :
                <div className={"feedbackStrip alert alert-success " + (!this.state.showWarning ? " makeVisible" : "")}>
                    <span data-id="resultTitle" className="feedbackText">{filteredCandidates.length} {filteredCandidates.length === 1 ? "Candidate" : "Candidates"} Found</span>
                </div>}
            {/*Map and display candidates via Bootstrap 'media'*/}
            <div>
                {filteredCandidates.map(candidate =>
                    <div data-id="resultItem" className="media" key={candidate.login.uuid}>
                        {/*User photo*/}
                        <img data-id="userPhoto" className="d-flex mr-3" src={candidate.picture.large} alt={this.capitalizeFirstLetter(candidate.name.first) + " " + this.capitalizeFirstLetter(candidate.name.last)} />
                        <div className="media-body">
                            {/*User info popup*/}
                            <div id={"userDialog"+candidate.login.uuid} style={{display: 'none'}} data-id="userDialog" className="alert userDialog">
                                <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={ ()=>this.onToggleContactClick(candidate.login.uuid) }>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <div data-id="userPhone">Phone: {candidate.phone}</div>
                                <div data-id="userCell">Cell: {candidate.cell}</div>
                                <div data-id="userEmail">Email: <a href={"mailto:" + candidate.email}>{candidate.email}</a></div>
                            </div>
                            {/*User name and age display*/}
                            <h5 data-id="userName" className="mt-0">{this.capitalizeFirstLetter(candidate.name.first)} {this.capitalizeFirstLetter(candidate.name.last)}</h5>
                            <div data-id="userAge">Age: {candidate.dob.age}</div>
                            {/*User contact button*/}
                            <div className="userInfoBtnContainer">
                                <button data-id="userInfo" type="button" className="btn btn-outline-info" onClick={ ()=>this.onToggleContactClick(candidate.login.uuid) }>
                                    Contact
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
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