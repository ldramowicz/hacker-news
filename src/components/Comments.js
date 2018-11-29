import React from "react";
import PropTypes from 'prop-types';
import './Comments.css';

const numOfTopCommentsToFetch = 20;


class Comments extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            propsReceived: [],
            comments: [],
            areCommentsLoading: false,
            error: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        //console.log("next props = " + nextProps.storyKids);
        //console.log("this props = " + this.props.storyKids);
        if (this.props.storyKids !== nextProps.storyKids) {
            console.log("New props!");
            this.setState({propsReceived: nextProps.storyKids});
        }
    }

    componentDidMount() {
        if (!this.props.storyKids)
            return null;
        this.setState({areCommentsLoading: true});
        //console.log("props = "  + this.props.storyKids);

        let tempComments = [];
        let comments = this.props.storyKids;

        comments.map(comment => fetch('https://hacker-news.firebaseio.com/v0/item/' + comment + '.json?print=pretty')
            .then(results => results.json())
            .then((data) => {
                //console.log("comment id = " + comment);
                //console.log("data = " + data);
                tempComments.push(data);
                //console.log("comment = " + JSON.stringify(tempComments));
            })
            .then(() => this.setState({comments: tempComments.slice(0,numOfTopCommentsToFetch), areCommentsLoading: false}))
            .catch(error => this.setState({error, areCommentsLoading: false}))
        );
    }

    render() {
        const {areCommentsLoading, error, comments} = this.state;

        console.log("comments = " + JSON.stringify(this.state.comments));

        // check for fetch errors and display them here
        if (error) {
            return <div className="error alert alert-danger makeVisible">
                <span className="feedbackText">ERROR: {error.message}</span>
            </div>
        }
        // show "Loading" text if loading data not finished
        if (areCommentsLoading) {
            return <div className="error alert alert-warning makeVisible">
                <span className="feedbackText">Loading...</span>
            </div>
        }

        return (<div id="Comments">
            <ul className="list-group list-group-flush">
                {comments.map(comment =>
                    <li className="list-group-item" key={comment.id}>
                        <div className="font-italic font-weight-bold">{comment.by}</div>
                        <div dangerouslySetInnerHTML={this.createMarkup(comment.text)} />
                    </li>)}
            </ul>
        </div>);
    }

    createMarkup(textToConvert) {
        return {__html: textToConvert}
    }
}

Comments.propTypes = {
    storyKids: PropTypes.array,
};

export default Comments;