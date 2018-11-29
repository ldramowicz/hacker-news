import React from "react";
import $ from "jquery";
import './App.css';

const numOfTopStoriesToFetch = 10;

// tmpSearchObj stores user's preferences before Filter button is clicked
let stories2 = [];


class App extends React.Component {

    constructor() {
        super();

        this.state = {
            topStoriesIDs: [],
            stories: [],
            areStoriesLoading: false,
            error: false,
        };
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
                    <div className="card" key={story.id}>
                        <div className="card-body">
                            <h4 className="card-title"><a href={story.url} className="card-link text-dark" target="_new">{story.title}</a></h4>
                            <h6 className="card-subtitle mb-2 text-muted">{story.score} points by {story.by}</h6>
                            <a className="card-link" data-toggle="collapse" href={"#comments_"+story.id} aria-expanded="false" aria-controls={"#comments_"+story.id}>Comments</a>
                        </div>
                        <div className="collapse" id={"comments_"+story.id}>
                            <div className="card card-body">
                                Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>)
    }
}

export default App;