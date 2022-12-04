import React from "react";
import { Typography, Grid} from "@material-ui/core";
import "./userPhotos.css";
//import { Link } from "react-router-dom";
import axios from "axios";
import PhotoComm from "./PhotoComm";
//import fetchModel from "../../lib/fetchModelData";

/**
 * Define UserPhotos, a React componment of CS142 project #5
 */

class UserPhotos extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      renderTrigger: false,
      photos: undefined,
      //comment: "",
    };
  }
  componentDidMount() {
    let userId = this.props.match.params.userId;
    console.log(userId);
    //check this
    this.user = undefined;
    this.refresh = this.refresh.bind(this);
    this.refresh();
    /*
    let toFetch = axios.get(
      `http://localhost:3000/photosOfUser/${userId}`
    );
    toFetch.then((response) => {
      this.setState({ photos: response.data });
    },
    (reject) => {console.log(reject);});
    */
    axios.get(`/user/${userId}`).then(
      (response) => {
        this.user = response.data;
        //response.data.first_name + " "+ response.data.last_name
        this.props.changeView(
          "Photos of " + this.user.first_name + " " + this.user.last_name
        );
      },
      (reject) => {
        console.log(reject);
      }
    );
  }

  refresh() {
    let toFetch = axios.get(`/photosOfUser/${this.props.match.params.userId}`);
    toFetch.then(
      (response) => {
        console.log(response.data);
        this.setState({ photos: response.data });
      },
      (reject) => {
        console.log(reject);
      }
    );
  }

  renderTrigger = ()=>{
    this.setState({renderTrigger: !this.state.renderTrigger});
    console.log("CHECK ANY STRING");
   }
  /*
  handleComm(indx) {
    let lst = [];
    let comments = this.state.photos[indx].comments;
    if (undefined !== comments) {
      //let lst = [];
      for (let i = 0; i < comments.length; i++) {
        lst[i] = (
          <Card key={comments[i]._id}>
            <CardContent>
              <ListItem>
                <ListItemText primary={comments[i].date_time} />
              </ListItem>
              <ListItem
                button
                component={Link}
                to={`/users/${comments[i].user._id}`}
              >
                <ListItemText
                  secondary={
                    comments[i].user.first_name +
                    " " +
                    comments[i].user.last_name
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText secondary={comments[i].comment} />
              </ListItem>
            </CardContent>
          </Card>
        );
      }
      //return lst;
    }
    return lst;
  }

arr.sort(function(a, b){
  // ASC  -> a.length - b.length
  // DESC -> b.length - a.length
  return b.length - a.length;
});

          {this.state.photos ? (
          this.state.photos
          .sort(
            (photo1, photo2) => photo2.liked_by.length - photo1.liked_by.length
          )
          .map((photo) => 
                photo.permitted_users.indexOf(this.props.curr_user_id) > -1 && 
          (
            
*/

  render() {
    if(this.state.renderTrigger){
    }
    console.log("render in userPhotos is rendering");
    return this.user ? (
      <div>
        <Typography variant="h3">
          Photos of {this.user.first_name} {this.user.last_name}&apos;
        </Typography>
        <br />
        <br />
        <Grid
          container
          direction="column"
          padding={8}
          justify="space-between"
          alignItems="center"
        >
          {this.state.photos ? (
            this.state.photos
              .sort(
                (photo1, photo2) => photo2.liked_by.length - photo1.liked_by.length
              )
              .map((photo) => (
                <Grid item xs key={photo._id} style={{ width: "60%" }}>
                  {console.log("check this" + photo._id)}
                  <PhotoComm
                    style={{}}
                    creator={this.user}
                    refresh={this.refresh}
                    liked={photo.liked_by.indexOf(this.props.curr_user_id) > -1}
                    photo={photo}
                    renderTrigger={this.renderTrigger}
                  />
                  <br />
                </Grid>
              ))
          ) : (
            <div />
          )}
        </Grid>
      </div>
    ) : (
      <div />
    );
  }
}

export default UserPhotos;
