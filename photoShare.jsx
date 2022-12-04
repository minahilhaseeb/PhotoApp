import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import { Grid, Paper } from "@material-ui/core";
import "./styles/main.css";
//import { Redirect } from "react-router-dom";
//import axios from "axios";
// import necessary components
import TopBar from "./components/topBar/TopBar";
import UserDetail from "./components/userDetail/userDetail";
import UserList from "./components/userList/userList";
import UserPhotos from "./components/userPhotos/userPhotos";
import LoginRegister from "./components/LoginRegister/LoginRegister";

class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "User List",
      //isLoggedIn: true,
      //login_name: undefined,
      current_user: undefined,
    };
    this.changeView = this.changeView.bind(this);
    this.changeLoggedIn = this.changeLoggedIn.bind(this);

    /*
    axios.get("/admin/current").then(response => {
      let user = response.data;
      console.log(user);
      this.setState({current_user: user});
    })
    .catch(() => {
      this.setState({current_user: undefined});
    }); 
  
    */
  }

  changeView = (newText) => {
    this.setState({ text: newText });
  };

  changeLoggedIn = (newUser) => {
    this.setState({ current_user: newUser });
  };

  render() {
    return (
      <HashRouter>
        <div>
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <TopBar
                text={this.state.text}
                changeLoggedIn={this.changeLoggedIn}
                current_user={this.state.current_user}
                changeView={this.changeView}
              />
            </Grid>
            <div className="cs142-main-topbar-buffer" />
            <Grid item sm={3}>
              <Paper className="cs142-main-grid-item">
                {this.state.current_user ? <UserList /> : null}
              </Paper>
            </Grid>
            <Grid item sm={9}>
              <Paper className="cs142-main-grid-item">
                <Switch>
                  <Route
                    exact
                    path="/"
                    render={() => {
                      /* 
                  <Typography variant="body1">
                  Welcome to your photosharing app! This <a href="https://material-ui.com/demos/paper/">Paper</a> component
                  displays the main content of the application. The {"sm={9}"} prop in
                  the <a href="https://material-ui.com/layout/grid/">Grid</a> item component makes it responsively
                  display 9/12 of the window. The Switch component enables us to conditionally render different
                  components to this part of the screen. You don&apos;t need to display anything here on the homepage,
                  so you should delete this Route component once you get started.
                </Typography>*/
                    }}
                  />
                  {this.state.current_user ? (
                    <Redirect
                      path="/login-register"
                      to={`/users/${this.state.current_user._id}`}
                    />
                  ) : (
                    <Route
                      path="/login-register"
                      render={(props) => (
                        <LoginRegister
                          {...props}
                          changeLoggedIn={this.changeLoggedIn}
                        />
                      )}
                    />
                  )}
                  {this.state.current_user ? (
                    <Route
                      path="/users/:userId"
                      render={(props) => (
                        <UserDetail {...props} changeView={this.changeView} />
                      )}
                    />
                  ) : (
                    <Redirect path="/users/:userId" to="/login-register" />
                  )}
                  {this.state.current_user ? (
                    <Route
                      path="/photos/:userId"
                      render={(props) => (
                        <UserPhotos
                          changeView={this.changeView}
                          curr_user_id={this.state.current_user._id}
                          {...props}
                        />
                      )}
                    />
                  ) : (
                    <Redirect path="/photos/:userId" to="/login-register" />
                  )}
                  {this.state.current_user ? (
                    <Redirect
                      path="/"
                      to={`/users/${this.state.current_user._id}`}
                    />
                  ) : (
                    <Redirect path="/" to="/login-register" />
                  )}
                </Switch>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </HashRouter>
    );
  }
}

/*exact path="/"
                render={() => (
                <Typography variant="body1">
                  Welcome to your photosharing app! This <a href="https://mui.com/components/paper/">Paper</a> component
                  displays the main content of the application. The {"sm={9}"} prop in
                  the <a href="https://mui.com/components/grid/">Grid</a> item component makes it responsively
                  display 9/12 of the window. The Switch component enables us to conditionally render different
                  components to this part of the screen. You don&apos;t need to display anything here on the homepage,
                  so you should delete this Route component once you get started.
                </Typography>
                )}
              />
              <Route path="/users/:userId"
                render={ props => <UserDetail {...props} /> }
              />
              <Route path="/photos/:userId"
                render ={ props => <UserPhotos {...props} /> }
              />
              <Route path="/users" component={UserList}  />
            </Switch>
          </Paper>
        </Grid>
      </Grid>
      </div>
      </HashRouter>
    );
  }
}
*/

ReactDOM.render(<PhotoShare />, document.getElementById("photoshareapp"));
