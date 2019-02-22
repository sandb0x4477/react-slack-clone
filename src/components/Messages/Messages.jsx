import React, { Component } from 'react';
import { Segment, Comment } from 'semantic-ui-react';

import firebase from '../../firebase';
import MessagesHeader from './MessagesHeader';
import MessagesForm from './MessagesForm';
import Message from './Message';

class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref('messages'),
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    messages: [],
    messagesLoading: false
  };

  componentDidMount() {
    const { channel, user } = this.state;

    if (channel && user) {
      this.setState({
        messagesLoading: true
      });

      this.addListeners(channel.id);
    }
  }

  addListeners = (channelId) => {
    this.addMessageListeners(channelId);
  };

  addMessageListeners = (channelId) => {
    let loadedMessages = [];
    this.state.messagesRef.child(channelId).on('child_added', snap => {
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      });
    });
  };

  displayMessages = (messages) => (
    messages.length > 0 && messages.map(message => (
      <Message
        key={message.timestamp}
        message={message}
        user={this.state.user}
      />
    ))
  );

  render() {
    const { messagesRef, channel, user, messages } = this.state;
    return (
      <React.Fragment>
        <MessagesHeader/>

        <Segment>
          <Comment.Group className='messages'>
            {this.displayMessages(messages)}
          </Comment.Group>
        </Segment>
        <MessagesForm messagesRef={messagesRef} channel={channel} currentUser={user}/>
      </React.Fragment>
    );
  }
}

export default Messages;
