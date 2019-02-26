import React, { Component } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import { connect } from 'react-redux';

import firebase from '../../firebase';
import { setUserPosts } from '../../actions';
import MessagesHeader from './MessagesHeader';
import MessagesForm from './MessagesForm';
import Message from './Message';

class Messages extends Component {
  state = {
    isPrivateChannel: this.props.isPrivateChannel,
    privateMessagesRef: firebase.database().ref('privateMessages'),
    messagesRef: firebase.database().ref('messages'),
    connectedRef: firebase.database().ref('.info/connected'),
    usersRef: firebase.database().ref('users'),
    channel: this.props.currentChannel,
    isChannelStarred: false,
    user: this.props.currentUser,
    messages: [],
    messagesLoading: false,
    numUniqueUsers: '',
    searchTerm: '',
    searchLoading: false,
    searchResults: [],
    listeners: []
  };

  componentDidMount() {
    const { channel, user, listeners } = this.state;

    if (channel && user) {
      this.setState({
        messagesLoading: true
      });
      this.removeListeners(listeners);
      this.addListeners(channel.id);
      this.addUserStarsListeners(channel.id, user.uid);
    }
  }

  componentWillUnmount() {
    this.removeListeners(this.state.listeners);
    this.state.connectedRef.off();
  }

  addUserStarsListeners = (channelId, userId) => {
    this.state.usersRef
      .child(userId)
      .child('starred')
      .once('value')
      .then(data => {
        if (data.val() !== null) {
          const channelIds = Object.keys(data.val());
          const prevStarred = channelIds.includes(channelId);
          this.setState({ isChannelStarred: prevStarred });
        }
      });
  };

  addListeners = channelId => {
    this.addMessageListeners(channelId);
  };

  addToListeners = (id, ref, event) => {
    const index = this.state.listeners.findIndex(listener => {
      return listener.id === id && listener.ref === ref && listener.event === event;
    });

    if (index === -1) {
      const newListener = { id, ref, event };
      this.setState({ listeners: this.state.listeners.concat(newListener) });
    }
  };

  removeListeners = listeners => {
    listeners.forEach(listener => {
      listener.ref.child(listener.id).off(listener.event);
    });
  };

  addMessageListeners = channelId => {
    let loadedMessages = [];
    const ref = this.getMessagesRef();
    ref.child(channelId).on('child_added', snap => {
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      });
    });
    this.countUniqueUsers(loadedMessages);
    this.countUserPosts(loadedMessages);
  };

  countUserPosts = messages => {
    let userPosts = messages.reduce((acc, message) => {
      if (message.user.name in acc) {
        acc[message.user.name].count += 1;
      } else {
        acc[message.user.name] = {
          avatar: message.user.avatar,
          count: 1
        };
      }
      return acc;
    }, {});
    this.props.setUserPosts(userPosts);
  };

  getMessagesRef = () => {
    const { messagesRef, privateMessagesRef, isPrivateChannel } = this.state;
    return isPrivateChannel ? privateMessagesRef : messagesRef;
  };

  handleStar = () => {
    this.setState(
      prevState => ({
        isChannelStarred: !prevState.isChannelStarred
      }),
      () => this.starChannel()
    );
  };

  starChannel = () => {
    if (this.state.isChannelStarred) {
      this.state.usersRef.child(`${this.state.user.uid}/starred`).update({
        [this.state.channel.id]: {
          name: this.state.channel.name,
          details: this.state.channel.details,
          createdBy: {
            name: this.state.channel.createdBy.name,
            avatar: this.state.channel.createdBy.avatar
          }
        }
      });
    } else {
      this.state.usersRef
        .child(`${this.state.user.uid}/starred`)
        .child(this.state.channel.id)
        .remove(err => {
          if (err !== null) {
            console.log(err);
          }
        });
    }
  };

  displayMessages = messages =>
    messages.length > 0 &&
    messages.map(message => (
      <Message key={message.timestamp} message={message} user={this.state.user} />
    ));

  displayChannelName = channel => {
    return channel ? `${this.state.isPrivateChannel ? '@' : '#'}${channel.name}` : '';
  };

  countUniqueUsers = messages => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);
    const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;
    const numUniqueUsers = `${uniqueUsers.length} user${plural ? 's' : ''}`;
    this.setState({ numUniqueUsers });
  };

  handleSearchChange = event => {
    this.setState(
      {
        searchTerm: event.target.value,
        searchLoading: true
      },
      () => this.handleSearchMessages()
    );
  };

  handleSearchMessages = () => {
    const channelMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTerm, 'gi');
    const searchResults = channelMessages.reduce((acc, message) => {
      if (
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
      ) {
        acc.push(message);
      }
      return acc;
    }, []);
    this.setState({ searchResults });
    setTimeout(() => this.setState({ searchLoading: false }), 1000);
  };

  render() {
    const {
      messagesRef,
      channel,
      user,
      messages,
      numUniqueUsers,
      searchTerm,
      searchResults,
      searchLoading,
      isPrivateChannel,
      isChannelStarred
    } = this.state;

    return (
      <React.Fragment>
        <MessagesHeader
          displayChannelName={this.displayChannelName(channel)}
          usersCount={numUniqueUsers}
          handleSearchChange={this.handleSearchChange}
          searchLoading={searchLoading}
          isPrivateChannel={isPrivateChannel}
          handleStar={this.handleStar}
          isChannelStarred={isChannelStarred}
        />

        <Segment>
          <Comment.Group className='messages'>
            {searchTerm
              ? this.displayMessages(searchResults)
              : this.displayMessages(messages)}
          </Comment.Group>
        </Segment>

        <MessagesForm
          messagesRef={messagesRef}
          getMessagesRef={this.getMessagesRef}
          channel={channel}
          currentUser={user}
          isPrivateChannel={isPrivateChannel}
        />
      </React.Fragment>
    );
  }
}

export default connect(
  null,
  { setUserPosts }
)(Messages);
