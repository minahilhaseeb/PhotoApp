import React from 'react';
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
}
from '@material-ui/core';
import './userList.css';
import { Link } from "react-router-dom";
//import fetchModel from "../../lib/fetchModelData";
import axios from 'axios';
/**
 * Define UserList, a React componment of CS142 project #5
 */
class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: undefined,
    };

  }

  componentDidMount() {
    
    let toFetch = axios.get('http://localhost:3000/user/list');

    toFetch.then(response => {
      this.setState({users: response.data});
    },
    (reject) => {console.log(reject); });
  }




  render () {
    return this.state.users ? (
      <div>
        <Typography variant="h3">Friends</Typography>
        <Divider/>
        <List component="nav">
          {this.state.users.map(user => {
            return (
              <Link to={`/users/${user._id}`} key={user._id}>
                <ListItem>
                  <ListItemText className="users"
                    primary={`${user.first_name} ${user.last_name}`}
                  />
                </ListItem>
                <Divider />
              </Link>
            );
          })}
        </List>
      </div>
    ) : (
      <div />
    );
  }
}



export default UserList;

