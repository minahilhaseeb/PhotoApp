import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Grid,
  Button,
  Dialog,
  FormLabel,
  FormControlLabel,
  Checkbox,
  FormGroup,
} from "@material-ui/core";
import "./TopBar.css";
//import fetchModel from "../../lib/fetchModelData";
import axios from "axios";

/**
 * Define TopBar, a React componment of CS142 project #5
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: this.props.text,
      dialogBox: false,
      specifyPermissions: false,
      otherUsers: [],
      usersChecked: {},
    };
    axios
      .get("/otherUsers/list")
      .then((response) => {
        this.setState({ otherUsers: response.data });
      })
      .catch((err) => console.log(err.response));
  }

  componentDidUpdate(prevProps) {
    if (prevProps.text !== this.props.text) {
      this.setState({ text: this.props.text });
    }
    if (prevProps.current_user !== this.props.current_user) {
      axios
        .get("/otherUsers/list")
        .then((response) => {
          this.setState({
            otherUsers: response.data,
            specifyPermissions: false,
            usersChecked: {},
          });
        })
        .catch((err) => console.log(err.response));
    }
  }

  handleLogout = () => {
    axios
      .post("/admin/logout", {})
      .then(() => {
        this.props.changeLoggedIn(undefined);
      })
      .catch((err) => console.log(err));
  };

  handleUploadButtonClicked = (e) => {
    let self = this;
    e.preventDefault();

    if (!this.state.specifyPermissions) {
      this.setState({
        usersChecked: this.state.otherUsers.map(({ _id }) => {
          return { [_id]: true };
        }),
      });
    }

    if (this.uploadInput.files.length > 0) {
      const domForm = new FormData();
      domForm.append("uploadedphoto", this.uploadInput.files[0]);
      domForm.append("usersPermitted", JSON.stringify(this.state.usersChecked));
      axios
        .post("/photos/new", domForm)
        .then(() => {
          //console.log(res);
          self.setState({
            dialogBox: false,
            specifyPermissions: false,
            usersChecked: {},
          });
          window.location.href = `#/photos/${this.props.current_user._id}`;
        })
        .catch((err) => console.log(`POST ERR: ${err}`));
    }
  };

  /*
  componentDidMount(){
      //this.setState({text: this.props.text});
      
      let toFetch = axios.get("http://localhost:3000/test/info");
      toFetch.then(response => {
        this.setState({ version: response.data.__v});
        
      },
      (reject) => {console.log(reject); });         
  }
  */

  /*
  componentWillUnmount(){
    let toFetch = axios.get("http://localhost:3000/photo-share.html#/users/");
    toFetch.then(response => {
      this.setState({text: "User List"});
      
    },
    (reject) => {console.log(reject); });         
}
*/
  // this.setState({text: "User List"});
  //}

  handleCloseDialog = () => {
    this.setState({ dialogBox: false });
  };

  uploadButton = () => {
    this.setState({ dialogBox: true });
  };

  changeSpecifyPermits = () => {
    this.setState({ specifyPermissions: !this.state.specifyPermissions });
  };

  changeFriendPermit = (id) => () => {
    let { usersChecked } = this.state;
    usersChecked[id] = !usersChecked[id];
    this.setState({ usersChecked });
  };

  render() {
    return (
      <AppBar className="cs142-topbar-appBar" position="absolute">
        <Toolbar>
          {this.props.current_user ? (
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid item>
                <Typography variant="h6">{this.state.text}</Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6">
                  Hey {this.props.current_user.first_name}!
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={this.uploadButton}
                >
                  Add Photo
                </Button>
                <Dialog
                  open={this.state.dialogBox}
                  onClose={this.handleCloseDialog}
                >
                  <form
                    className="photo-upload"
                    onSubmit={this.handleUploadButtonClicked}
                  >
                    <FormLabel>
                      <input
                        type="file"
                        accept="image/*"
                        ref={(domFileRef) => {
                          this.uploadInput = domFileRef;
                        }}
                      />
                    </FormLabel>
                    <FormGroup>
                      <FormControlLabel>
                        control=
                        {
                          <Checkbox
                            checked={this.state.specifyPermissions}
                            onChange={this.changeSpecifyPermits}
                          />
                        }
                        label=&quot;Specify Permissions?&quot;
                      </FormControlLabel>
                    </FormGroup>
                    {this.state.specifyPermissions && (
                      <div>
                        <FormLabel>
                          Choose Friends for viewing persmissions
                        </FormLabel>
                        <FormGroup>
                          {this.state.otherUsers &&
                            this.state.otherUsers.map((userLoop) => {
                              return (
                                <FormControlLabel
                                  key={userLoop._id}
                                  control={
                                    <Checkbox
                                      checked={
                                        this.state.usersChecked[userLoop._id]
                                      }
                                      onChange={this.changeFriendPermit(
                                        userLoop._id
                                      )}
                                      value={userLoop._id}
                                    />
                                  }
                                  label={`${userLoop.first_name} ${userLoop.last_name}`}
                                />
                              );
                            })}
                        </FormGroup>
                      </div>
                    )}
                    <Button variant="contained" color="secondary" type="submit">
                      Post it away!
                    </Button>
                  </form>
                </Dialog>
              </Grid>

              <Grid item>
                <Button
                  varaint="contained"
                  color="secondary"
                  onClick={this.handleLogout}
                >
                  Log Out!
                </Button>
              </Grid>
            </Grid>
          ) : (
            <Typography varaint="h2"> Please login!</Typography>
          )}
        </Toolbar>
      </AppBar>
    );
  }
}

export default TopBar;
