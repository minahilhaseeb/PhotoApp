import React from "react";
import {
  Typography,
  Grid,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
} from "@material-ui/core";
import { Send, ThumbUp, ThumbUpOutlined } from "@material-ui/icons";
import { MentionsInput, Mention } from "react-mentions";
import { Link } from "react-router-dom";
import axios from "axios";
import mentionStyle from "./mentionStyle";

const mentionRegex = /@\[(\S+ \S+)( )*\]\(\S+\)/g;

class PhotoComm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: undefined,
      users: undefined,
      mentionsToAdd: [],
      liked: props.liked,
      stateLiked: props.photo.liked_by.length,
      disableButton: false, 
    };
    axios
      .get(`/user/mentionOptions`)
      .then((response) => {
        console.log("RESPONSE.DATA IN PHOTOCOMM " + JSON.stringify(response.data));
        this.setState({ users: response.data });
      })
      .catch((err) => {
        console.log(err.response);
      });
  }


  handleAddComment = (event, photo_id) => {
    console.log("handleAddComment " + this.props.photo.id);
    event.preventDefault();
    axios
      .post(`/commentsOfPhoto/${photo_id}`, {
        comment: this.state.comment,
        mentionsToAdd: this.state.mentionsToAdd,
      })
      .then(() => {
        this.setState({ comment: "", mentionsToAdd: [] });
        this.props.refresh();
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  handleInputChange = (event) => {
    //this.setState({ comment: event.target.value });
    let disableButton=false
    let AllIDs = this.state.users.map((user)=>{
      console.log("every user: " + JSON.stringify(user));
      return user.display.replace(/ /g, "");
    })
    let splitSentence = event.target.value.split(" ");
    console.log("splitSentence: " + splitSentence);
    splitSentence.forEach((word)=>{
      console.log("every user in split: " + JSON.stringify(word));
      if(word[0] === "@" && word.length>1){
        let  mentionWord = word.substring(1)
        let indexExists= AllIDs.indexOf(mentionWord)
        if(indexExists === -1){
        disableButton=true
        }
      }
    })
    console.log("disableButton: " + disableButton);
    console.log("event.target.value: " + event.target.value);
    this.setState({comment : event.target.value, disableButton: disableButton});

  };

  handleLikeOrUnlike = () => {
    console.log("this.state.liked: " + this.state.liked);
    console.log("photo id in handlelike without json: " + this.props.photo._id);
    axios
      .post(`/likeOrUnlike/${this.props.photo._id}`, { like: this.state.liked })
      .then((res) => {
        let change_state = res.data["liked_by"].length;
        console.log("change_state: " + change_state);
        //this.setState({statusLiked:change_state});
        console.log("BLOODY HEY");
        this.setState({ stateLiked: change_state }, () => {
          this.props.renderTrigger();
        });
      })
      .catch((err) => console.log(err.response));
  };

  render() {
    console.log("this.state in render" + JSON.stringify(this.state));
    return (
      <Card className="card">
        <CardHeader title={`${this.props.photo.date_time}`} />
        <CardMedia
          component="img"
          width="300"
          image={`/images/${this.props.photo.file_name}`}
          title={this.props.creator.first_name}
        />
        <CardActions>
          <IconButton
            aria-label="like"
            onClick={this.handleLikeOrUnlike.bind(this, this.props.photo._id)}
          >
            {this.state.liked ? (
              <ThumbUp color="primary" />
            ) : (
              <ThumbUpOutlined />
            )}
          </IconButton>
          <Typography variant="h4" color="primary">
            {" "}
            {this.state.stateLiked}
          </Typography>
        </CardActions>
        <CardContent className="photo-card-content">
          {this.props.photo.comments ? (
            <div className="photo-card-comment-section">
              {this.props.photo.comments.map((comment) => {
                return (
                  <Grid
                    container
                    justifyContent="space-between"
                    padding={5}
                    key={comment._id}
                  >
                    <Grid item xs={3}>
                      <Link to={`/users/${comment.user._id}`}>
                        {`${comment.user.first_name} ${comment.user.last_name}`}
                      </Link>
                    </Grid>
                    <Grid item xs={9} className="photo-card-display-comment">
                      <Typography varaint="body1">
                        {comment.comment.replace(mentionRegex, (match, p1) => {
                          return `@${p1}`;
                        })}
                      </Typography>
                      <Typography color="secondary">
                        {comment.date_time.toString()}
                      </Typography>
                    </Grid>
                  </Grid>
                );
              })}

              <form
                className="Add Comment"
                onSubmit={(event) =>this.handleAddComment(event, this.props.photo._id)}
              >
                <label className="comment-input">
                  <MentionsInput
                    value={this.state.comment}
                    onChange={this.handleInputChange}
                    allowSuggestionsAboveCursor
                    style={mentionStyle}
                    singleLine
                    className="mention-input-comment"
                  >
                    <Mention
                      trigger="@"
                      data={[]}
                      displayTransform={(id, display) => `@${display}`}
                      onAdd={(id) => {
                        let mentions = this.state.mentionsToAdd;
                        mentions.push(id);
                        this.setState({ mentionsToAdd: mentions });
                      }}
                    />
                  </MentionsInput>
                </label>

                <IconButton disabled = {this.state.disableButton} color="primary" type="submit">
                  <Send />
                </IconButton>
              </form>
            </div>
          ) : null}
        </CardContent>
      </Card>
    );
  }
}

export default PhotoComm;
