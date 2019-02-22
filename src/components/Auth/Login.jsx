import React, { Component } from 'react';
import { Form, Grid, Header, Icon, Message, Segment, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import firebase from '../../firebase';

class Login extends Component {
  state = {
    email: '',
    password: '',
    errors: [],
    loading: false
  };

  isFormEmpty = ({ email, password }) => {
    return !email.length || !password.length;
  };

  isPasswordValid = ({ password }) => {
    return password.length >= 6;
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
      this.setState({ errors: [], loading: true });
      firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((signedInUser) => {
          // console.log('Login successful', signedInUser);
          this.setState({ loading: false });
        })
        .catch(error => {
          console.log("Error", error);
          this.setState({ errors: this.state.errors.concat(error), loading: false });
        });
    }
  };

  handleInputError = (errors, input) => {
    return errors.some(error =>
      error.message.toLowerCase()
        .includes(input)) ? 'error' : '';
  };

  render() {
    const { email, password, errors, loading } = this.state;

    return (
      <Grid textAlign='center' verticalAlign='middle' className='app'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header textAlign='center' as='h2' icon color='violet'>
            <Icon name='code branch' color='violet'/>
            Login to DevChat
          </Header>
          <Form size='large' onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input fluid name='email' icon='mail' iconPosition='left'
                          placeholder='Email address' type='email' value={email}
                          onChange={this.handleChange}
                          className={this.handleInputError(errors, 'email')}
              />

              <Form.Input fluid name='password' icon='lock' iconPosition='left'
                          placeholder='Password' type='password' value={password}
                          onChange={this.handleChange}
                          className={this.handleInputError(errors, 'password')}
              />
              <Button className={loading ? 'loading' : ''} disabled={loading}
                      color='violet' fluid size='large'>Submit</Button>
            </Segment>
          </Form>
          {errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(errors)}
            </Message>
          )}
          <Message>New user? <Link to='/register'>&nbsp;Register</Link></Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Login;

