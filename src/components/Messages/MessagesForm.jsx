import React, { Component } from 'react';
import uuidv4 from "uuid/v4";
import { Button, Input, Segment } from 'semantic-ui-react';

import firebase from '../../firebase';
import FileModal from './FileModal';

class MessagesForm extends Component {
  state = {
    storageRef: firebase.storage().ref(),
    uploadTask: null,
    uploadState: "",
    percentUploaded: 0,
    user: this.props.currentUser,
    message: '',
    channel: this.props.channel,
    errors: [],
    loading: false,
    modal: false
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  createMessage = () => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: this.state.user.uid,
        name: this.state.user.displayName,
        avatar: this.state.user.photoURL
      },
      content: this.state.message
    };
    return message;
  };

  sendMessage = () => {
    const { messagesRef } = this.props;
    const { message, channel } = this.state;

    if (message) {
      this.setState({ loading: true });
      // console.log('message: ', message);
      messagesRef
        .child(channel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ loading: false, message: '', errors: [] });
        })
        .catch(error => {
          console.log('Error', error);
          this.setState({ loading: false, errors: this.state.concat(error) });
        });
    } else {
      this.setState({
        errors: this.state.errors.concat({ message: 'Add a message' })
      });
    }
  };

  uploadFile = (file, metadata) => {
    console.log(file, metadata);
    const pathToUpload = this.state.channel.id;
    const ref = this.props.getMessagesRef();
    const filePath = `${this.getPath()}/${uuidv4()}.jpg`;
  };

  openModal = () => {
    this.setState({ modal: true });
  };

  closeModal = () => {
    this.setState({ modal: false });
  };

  render() {
    const { loading, errors, message, modal } = this.state;
    return (
      <Segment className='message__from'>
        <Input
          value={message}
          fluid
          name='message'
          style={{ marginBottom: '0.7em' }}
          label={<Button icon='add' />}
          labelPosition='left'
          placeholder='Write your message'
          onChange={this.handleChange}
          className={
            errors.some(error => error.message.includes('message')) ? 'error' : ''
          }
        />
        <Button.Group icon widths='2'>
          <Button
            color={'orange'}
            content={'Add Reply'}
            labelPosition={'left'}
            icon={'edit'}
            onClick={this.sendMessage}
            loading={loading}
          />
          <Button
            color={'teal'}
            onClick={this.openModal}
            content={'Upload Media'}
            labelPosition={'right'}
            icon={'cloud upload'}
          />
          <FileModal
            modal={modal}
            uploadFile={this.uploadFile}
            closeModal={this.closeModal}
          />
        </Button.Group>
      </Segment>
    );
  }
}

export default MessagesForm;
