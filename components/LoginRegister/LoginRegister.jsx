import React from "react";
import { Typography, Grid } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import "./LoginRegister.css";
import axios from "axios";
import Input from "@material-ui/core/Input";

class LoginRegister extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    //this.handleLoginButton = this.handleLoginButton.bind(this);
    this.state = {
      failedLogin: "",
      login_tried: "",
      password_tried: "",
      register_name_tried: "",
      register_password_tried: "",
      occupation: "",
      password_verify_tried: "",
      location: "",
      description: "",
      failedRegister: "",
      first_name: "",
      last_name: "",
    };
  }

  handleLogin(event) {
 //   event.preventDefault;
    console.log("event target value: ", event);
    axios
      .post("admin/login", {
        login_name: this.state.login_tried,
        password: this.state.password_tried,
      })
      .then((response) => {
        this.setState({ failedLogin: "" });
        let user = response.data;
        this.props.changeLoggedIn(user);
        this.setState({ failedLogin: "" });
        //window.location.href = `#/users/${user._id}`;
      })
      .catch((err) => {
        this.setState({ failedLogin: err.response.data });
      });
  }

  handleInputChange(stateUpdate) {
    this.setState(stateUpdate);
  }

  handleRegistration = () => {
    if (
      this.state.register_password_tried !== this.state.password_verify_tried
    ) {
      this.setState({ failedRegister: "Passwords arent matching" });
      return;
    }
//    event.preventDefault;
    axios
      .post("/user", {
        login_name: this.state.register_name_tried,
        password: this.state.register_password_tried,
        occupation: this.state.occupation,
        location: this.state.location,
        description: this.state.description,
        first_name: this.state.first_name,
        last_name: this.state.last_name,
      })
      .then((response) => {
        this.setState({ failedRegister: "" });
        let user = response.data;
        this.props.changeLoggedIn(user);
        window.location.href = `#/users/${user._id}`;
      })
      .catch((err) => {
        this.setState({ failedRegister: err.response.data });
      });
  };


  render() {
    return (
      <Grid container justifyContent="space-around">
        <Grid item>
          <Typography variant="h4" color="inherit">
            Login
          </Typography>
          <Typography variant="body1" color="primary">
            {this.state.failedLogin}
          </Typography>

          <form onSubmit={this.handleLogin}>
            <label>
              <TextField
                required
                label="Username"
                type="text"
                value={this.state.login_tried}
                onChange={(event) => this.handleInputChange({ login_tried: event.target.value })}
              />
            </label>
            <br />
            <label>
              <TextField
                required
                label="Password"
                type="password"
                value={this.state.password_tried}
                onChange={(event) => this.handleInputChange({ password_tried: event.target.value })}
              />
            </label>
            <br />
            <br />
            <Input type="submit" value="Submit" />
          </form>
        </Grid>
        <Grid item>
          <Typography variant="h4">Registration</Typography>
          <Typography variant="body1" color="primary">
            {this.state.failedRegister}
          </Typography>
          <form onSubmit={this.handleRegistration}>
            <label>
              <TextField
                required
                label="First Name"
                type="text"
                value={this.state.first_name}
                onChange={(event) => this.handleInputChange({ first_name: event.target.value })}
              />{" "}
            </label>
            <br />
            <label>
              <TextField
                required
                label="Last Name:"
                type="text"
                value={this.state.last_name}
                onChange={(event) =>this.handleInputChange({ last_name: event.target.value })}
              />{" "}
            </label>
            <br />
            <label>
              <TextField
                required
                label="Username:"
                type="text"
                value={this.state.register_name_tried}
                onChange={(event) =>this.handleInputChange({register_name_tried: event.target.value,})}
              />
            </label>
            <br />
            <label>
              <TextField
                required
                label="Password"
                type="password"
                value={this.state.register_password_tried}
                onChange={(event) => this.handleInputChange({register_password_tried: event.target.value,})}
              />
            </label>
            <br />
            <label>
              <TextField
                required
                label="Verify Password:"
                error={
                  this.state.register_password_tried !==
                  this.state.password_verify_tried
                }
                type="password"
                value={this.state.password_verify_tried}
                onChange={(event) =>this.handleInputChange({password_verify_tried: event.target.value,})}
              />
            </label>
            <br />
            <label>
              <TextField
                label="Write your location:"
                type="text"
                value={this.state.location}
                onChange={(event) =>this.handleInputChange({ location: event.target.value })}
              />
            </label>
            <br />
            <label>
              <TextField
                label="Write your description:"
                type="text"
                value={this.state.description}
                onChange={(event) =>this.handleInputChange({ description: event.target.value })}
              />
            </label>
            <br />
            <label>
              <TextField
                label="Write your occupation:"
                type="text"
                value={this.state.occupation}
                onChange={(event) =>this.handleInputChange({ occupation: event.target.value })}
              />
            </label>
            <br />
            <br />
            <Input type="submit" value="Please Register Me!" />
          </form>
        </Grid>
      </Grid>
    );
  }
}

export default LoginRegister;
