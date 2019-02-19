import React, { Component } from 'react';
import { Form, Grid, Header, Icon, Message, Segment, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import firebase from '../../firebase';

class Register extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    errors: []
  };

  isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    return !username.length || !email.length || !password.length || !passwordConfirmation.length;
  };

  isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false;
    }
    return password === passwordConfirmation;
  };

  isFormValid = () => {
    let errors = [];
    let error;

    if (this.isFormEmpty(this.state)) {
      error = { message: 'Fill in all fields' };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else if (!this.isPasswordValid(this.state)) {
      error = { message: 'Password is invalid' };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else {
      return true;
    }
  };

  displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>);

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.isFormValid()) {
      firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(createdUser => {
          console.log('createdUser', createdUser);
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  render() {
    const { username, email, password, passwordConfirmation, errors } = this.state;

    return (
      <Grid textAlign='center' verticalAlign='middle' className='app'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header textAlign='center' as='h2' icon color='orange'>
            <Icon name='puzzle piece' color='orange'/>
            Register for DevChat
          </Header>
          <Form size='large' onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input fluid name='username' icon='user' iconPosition='left'
                          placeholder='Username' type='text' value={username}
                          onChange={this.handleChange}/>

              <Form.Input fluid name='email' icon='mail' iconPosition='left'
                          placeholder='Email address' type='email' value={email}
                          onChange={this.handleChange}/>

              <Form.Input fluid name='password' icon='lock' iconPosition='left'
                          placeholder='Password' type='password' value={password}
                          onChange={this.handleChange}/>

              <Form.Input fluid name='passwordConfirmation' icon='repeat'
                          iconPosition='left'
                          placeholder='Confirm Password' type='password'
                          value={passwordConfirmation}
                          onChange={this.handleChange}/>
              <Button color='orange' fluid size='large'>Submit</Button>
            </Segment>
          </Form>
          {errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(errors)}
            </Message>
          )}
          <Message>Already a user? <Link to='/login'>&nbsp;Login</Link></Message>
        </Grid.Column>
      </Grid>
    );
  }

}

export default Register;
