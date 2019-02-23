import React, { Component } from 'react';
import { Header, Icon, Segment } from 'semantic-ui-react';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input';

class MessagesHeader extends Component {
  render() {
    const {
      displayChannelName,
      usersCount,
      handleSearchChange,
      searchLoading
    } = this.props;

    return (
      <Segment clearing>
        <Header fluid='true' as='h2' floated='left' style={{ marginBottom: 0 }}>
          <span>
            {displayChannelName}
            <Icon name='star outline' color='black' />
          </span>
          <Header.Subheader>{usersCount}</Header.Subheader>
        </Header>
        <Header floated='right'>
          <Input
            loading={searchLoading}
            onChange={handleSearchChange}
            size='mini'
            icon='search'
            name='searchTerms'
            placeholder='Search Messages'
          />
        </Header>
      </Segment>
    );
  }
}

export default MessagesHeader;
