import React from "react";
//import $ from "jquery";
import './App.css';

const numOfTopStoriesToFetch = 10;
const numOfTopCommentsToFetch = 20;
const defaultAgeMin = 18;
const defaultAgeMax = 90;
const defaultGender = "any";

// tmpSearchObj stores user's preferences before Filter button is clicked
let stories2 = [];
let warning = '';


class App extends React.Component {
    constructor() {
        super();

        this.state = {
            topStoriesIDs: [],
            stories: [],
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
    }
    componentDidMount() {
        this.setState({areStoriesLoading: true});
        // fetch + API call
        fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
            .then(results => results.json())
            .then(data => {
                this.setState({topStoriesIDs: data.slice(0,numOfTopStoriesToFetch)})
                //console.log("data = " + data.slice(0,numOfTopStoriesToFetch))
            })
            .then(nextData => {
                let items = this.state.topStoriesIDs;
                items.map(story => fetch('https://hacker-news.firebaseio.com/v0/item/' + story + '.json?print=pretty')
                    .then(results => results.json())
                    .then((data) => {
                        //console.log("item = " + data.title);
                        stories2.push(data);
                        console.log("story = " + stories2);
                    })
                    .then(() => this.setState({stories: stories2, areStoriesLoading: false}))
                )
            })

            .catch(error => this.setState({error, areStoriesLoading: false}));
    }

    render() {
        const {areStoriesLoading, error, topStoriesIDs, stories} = this.state;
        console.log("topStoriesIDs = " + topStoriesIDs);
        console.log("stories = " + stories);

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
            <div id="appTitle">
                {stories.map(story =>
                <div key={story.id}>
                    {story.title}
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

}
export default App;