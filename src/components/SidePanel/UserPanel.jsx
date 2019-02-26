import React, { Component } from 'react';
// import { connect } from 'react-redux';
import { Dropdown, Grid, Header, Icon, Image } from 'semantic-ui-react';

import firebase from '../../firebase';

class UserPanel extends Component {
  state = {
    user: this.props.currentUser
  };

  dropdownOptions = () => [
    {
      key: 'user',
      text: (
        <span>
          Signed in as <strong>{this.state.user.displayName}</strong>
        </span>
      ),
      disabled: true
    },
    {
      key: 'avatar',
      text: <span>Change Avatar</span>
    },
    {
      key: 'signout',
      text: <span onClick={this.handleSignout}>Sign out</span>
    }
  ];

  handleSignout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log('User Signed Out');
      });
  };

  render() {
    const { user } = this.state;
    const { primaryColor } = this.props;
    return (
      <Grid style={{ background: primaryColor }}>
        <Grid.Column>
          <Grid.Row style={{ padding: '1.2em', margin: 0 }}>
            <Header inverted floated='left' as='h2'>
              <Icon name='code' />
              <Header.Content>DevChat</Header.Content>
            </Header>
          </Grid.Row>

          <Header inverted as='h4' style={{ padding: '0.25em' }}>
            <Dropdown
              trigger={
                <span>
                  <Image src={user.photoURL} avatar spaced='right' />
                  {user.displayName}
                </span>
              }
              options={this.dropdownOptions()}
            />
          </Header>
        </Grid.Column>
      </Grid>
    );
  }
}

export default UserPanel;
