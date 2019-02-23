import React, { Component } from 'react';
import { Menu, Icon } from 'semantic-ui-react';

import firebase from '../../firebase';

class DirectMessages extends Component {
  state = {
    user: this.props.currentUser,
    users: [],
    usersRef: firebase.database().ref('users'),
    connectedRef: firebase.database().ref('.info/connected'),
    presenceRef: firebase.database().ref('presence')
  };

  componentDidMount() {
    if (this.state.user) {
      this.addListeners(this.state.user.uid);
    }
  }

  addListeners = userUid => {
    let loadedUsers = [];
    this.state.usersRef.on('child_added', snap => {
      if (userUid !== snap.key) {
        let user = snap.val();
        user['uid'] = snap.key;
        user['status'] = 'offline';
        loadedUsers.push(user);
        this.setState({ users: loadedUsers });
      }
    });

    this.state.connectedRef.on('value', snap => {
      if (snap.val() === true) {
        const ref = this.state.presenceRef.child(userUid);
        ref.set(true);
        ref.onDisconnect().remove(err => {
          if (err !== null) {
            console.error(err);
          }
        });
      }
    });

    this.state.presenceRef.on('child_added', snap => {
      if (userUid !== snap.key) {
        this.addStatusToUser(snap.key);
      }
    });

    this.state.presenceRef.on('child_removed', snap => {
      if (userUid !== snap.key) {
        this.addStatusToUser(snap.key, false);
      }
    });
  };


  addStatusToUser = (userId, connected = true) => {
    const updatedUsers = this.state.users.reduce((acc, user) => {
      if (user.uid === userId) {
        user['status'] = `${connected ? 'online' : 'offline'}`;
      }
      return acc.concat(user);
    }, []);
    this.setState({users: updatedUsers})
  }

  isUserOnline = user =>  user.status === 'online';

  changeChannel = user => {
    const channelId = this.getChannelId(user.uid);
  }

  getChannelId = userId => {
    const currentUserId = this.state.user.uid;

  }

  render() {
    const { users } = this.state;
    return (
      <Menu.Menu className='menu'>
        <Menu.Item>
          <span>
            <Icon name='mail' /> DIRECT MESSAGES
          </span>{' '}
          ({users.length})
        </Menu.Item>
        {users && users.map(user => (
          <Menu.Item
          key={user.uid}
          onClick={() => this.changeChannel(user)}
          style={{ opacity: 0.7, fontStle: 'italic'}}

          >
          <Icon
          name='circle'
          color={this.isUserOnline(user) ? 'green' : 'red'}
          />
          @ {user.name}
          </Menu.Item>
        ))}
      </Menu.Menu>
    );
  }
}

export default DirectMessages;
