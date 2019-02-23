import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Icon, Input, Menu, Modal } from 'semantic-ui-react';

import { setCurrentChannel } from '../../actions';
import firebase from '../../firebase';

class Channels extends Component {
  state = {
    user: this.props.currentUser,
    activeChannel: '',
    channel: null,
    channels: [],
    channelName: '',
    channelDetails: '',
    channelsRef: firebase.database().ref('channels'),
    modal: false,
    firstLoad: true
  };

  componentDidMount() {
    this.addListeners();
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  addListeners = () => {
    let loadedChannels = [];
    this.state.channelsRef.on('child_added', snap => {
      loadedChannels.push(snap.val());
      this.setState({ channels: loadedChannels }, () =>
        this.setFirstChannel());
    });
  };

  removeListeners = () => {
    this.state.channelsRef.off();
    // this.state.channels.forEach(channel => {
    //   this.state.messagesRef.child(channel.id).off();
    // });
  };

  // ===================================================================
  // CHANNELS ==========================================================
  // ===================================================================
  addChannel = () => {
    const { channelsRef, channelName, channelDetails, user } = this.state;

    const key = channelsRef.push().key;

    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL
      }
    };

    channelsRef.child(key).update(newChannel).then(() => {
      // console.log('Channel added to firebase');
      this.setState({ channelName: '', channelDetails: '' });
      this.closeModal();
    }).catch((err) => {
      console.log('Error', err);
    });
  };

  changeChannel = (channel) => {
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
    this.setState({ channel });
  };

  displayChannels = channels =>
    channels.length > 0 && channels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={() => this.changeChannel(channel)}
        name='channel.name'
        style={{ opacity: 0.7 }}
        active={channel.id === this.state.activeChannel}
      >
        # {channel.name}
      </Menu.Item>
    ));

  setFirstChannel = () => {
    const firstChannel = this.state.channels[0];
    if (this.state.firstLoad && this.state.channels.length > 0) {
      this.props.setCurrentChannel(firstChannel);
      this.setActiveChannel(firstChannel);
      this.setState({ channel: firstChannel });
    }
    this.setState({ firstLoad: false });
  };

  setActiveChannel = channel => {
    this.setState({ activeChannel: channel.id });
  };


  isFormValid = ({ channelName, channelDetails }) => channelName && channelDetails;

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      // console.log('channel added');
      this.addChannel();
    }
  };

  closeModal = () => this.setState({ modal: false });
  openModal = () => this.setState({ modal: true });

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };


  render() {
    const { channels, modal } = this.state;

    return (
      <React.Fragment>
        <Menu.Menu className='menu'>
          <Menu.Item>
          <span>
            <Icon name='exchange'/> CHANNELS
          </span>{' '}
            ({channels.length}) <Icon name='add' onClick={this.openModal}/>
          </Menu.Item>
          {this.displayChannels(channels)}
        </Menu.Menu>

        <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header>Add a Channel</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>

              <Form.Field>
                <Input
                  fluid
                  label='Name of Channel'
                  name='channelName'
                  onChange={this.handleChange}
                />
              </Form.Field>

              <Form.Field>
                <Input
                  fluid
                  label='About the Channel'
                  name='channelDetails'
                  onChange={this.handleChange}
                />
              </Form.Field>

            </Form>
          </Modal.Content>

          <Modal.Actions>
            <Button inverted onClick={this.closeModal}>
              <Icon name='cancel'/> Cancel
            </Button>
            <Button color='blue' inverted onClick={this.handleSubmit}>
              <Icon name='checkmark'/> Add
            </Button>
          </Modal.Actions>
        </Modal>

      </React.Fragment>
    );
  }
}

export default connect(null, { setCurrentChannel })(Channels);
