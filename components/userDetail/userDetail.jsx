import React from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core";
import "./userDetail.css";
import { Link } from "react-router-dom";
//import fetchModel from "../../lib/fetchModelData";
import axios from "axios";
import Mentions from "./Mentions";
/**
 * Define UserDetail, a React componment of CS142 project #5
 */
class UserDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: undefined,
    };
  }

  componentDidMount() {
    let toFetch = axios.get(
      "http://localhost:3000/user/" + this.props.match.params.userId
    );

    toFetch.then(
      (response) => {
        this.setState({ user: response.data });
        this.props.changeView(
          response.data.first_name + " " + response.data.last_name
        );
      },
      (reject) => {
        console.log(reject);
      }
    );
  }

  componentDidUpdate() {
    if (this.state.user._id !== this.props.match.params.userId) {
      let self = this;
      axios
        .get("http://localhost:3000/user/" + self.props.match.params.userId)
        .then(
          (response) => {
            self.setState({ user: response.data });
            self.props.changeView(
              response.data.first_name + " " + response.data.last_name
            );
          },
          (reject) => {
            console.log(reject);
          }
        );
    }
  }

  render() {
    let id = this.props.match.params.userId;
    console.log(id);
    return (
      <div>
        {undefined !== this.state.user ? (
          <Card>
            <CardContent>
              <Typography variant="body1">
                {`${this.state.user.first_name} ${this.state.user.last_name}`}
              </Typography>
              <List component="nav">
                <ListItem>
                  <ListItemText>
                    Location: {this.state.user.location}
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText>
                    Desciption: {this.state.user.description}
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText>
                    Occupation: {this.state.user.occupation}
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText>
                    Mentioned in: {this.state.user.mentioned.length > 0 ? 
                     (this.state.user.mentioned.map((photo_id, indx) => {
                       return <Mentions key={photo_id + indx} photo_id={photo_id} />;
                     })
                     ): (
                       <ListItemText>
                       Nowhere
                       </ListItemText>
                     )}
                  </ListItemText>
                </ListItem>
              </List>
            </CardContent>
            <CardActions>
              <Button className="button">
                <Link to={`/photos/${id}`}>Photos</Link>
              </Button>
            </CardActions>
          </Card>
        ) : (
          <Card></Card>
        )}
      </div>
    );
  }
}

export default UserDetail;
