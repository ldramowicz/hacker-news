import React from "react";
import Comments from './components/Comments';
import './App.css';

const numOfTopStoriesToFetch = 10;

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

        let tempStories = [];

        // fetch + API call
        fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
            .then(results => results.json())
            .then(data => {
                this.setState({topStoriesIDs: data.slice(0,numOfTopStoriesToFetch)})
                //console.log("data = " + data.slice(0,numOfTopStoriesToFetch))
            })
            .then(() => {
                let items = this.state.topStoriesIDs;
                items.map(story => fetch('https://hacker-news.firebaseio.com/v0/item/' + story + '.json?print=pretty')
                    .then(results => results.json())
                    .then((data) => {
                        tempStories.push(data);
                        //console.log("story = " + JSON.stringify(tempStories));
                    })
                    .then(() => this.setState({stories: tempStories, areStoriesLoading: false}))
                )
            })
            .catch(error => this.setState({error, areStoriesLoading: false}));
    }

    render() {
        const {areStoriesLoading, error, stories} = this.state;

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
            <div className="header">
                <h1>Top 10 Hacker News Stories</h1>
            </div>
            <div>
                {stories.map(story =>
                    <div className="card" key={story.id}>
                        <div className="card-body">
                            <h4 className="card-title"><a href={story.url} className="card-link text-dark" target="_new">{story.title}</a></h4>
                            <h6 className="card-subtitle mb-2 text-muted">{story.score} {story.score === 1 ? "point" : "points"} by {story.by}</h6>

                            <a className={"card-link" + (story.kids ? "" : " disabled")} data-toggle="collapse" href={"#comments_"+story.id} aria-expanded="false" aria-controls={"#comments_"+story.id}>Comments</a>
                        </div>
                        <div className="collapse" id={"comments_"+story.id}>
                            <div className="card card-body">
                                <Comments storyKids={story.kids} key={story.id} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>)
    }
}

export default App;