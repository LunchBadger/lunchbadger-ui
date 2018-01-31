import React, {PureComponent} from 'react';
import md5 from 'md5';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Header from '../Header/Header';
import {Form, EntityProperty, Button} from '../../../../lunchbadger-ui/src/';
import isStorageSupported from '../../utils/isStorageSupported';
import messages from '../../utils/messages';
import envs from '../../utils/fakeLoginEnvs';
import Config from '../../../../../src/config';
import './FakeLogin.scss';

const muiTheme = getMuiTheme({
  fontFamily: 'Open Sans',
  palette: {
    primary1Color: '#4190cd',
    accent1Color: '#047C99'
  }
});

export default class FakeLogin extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      password: '',
    };
  }

  componentDidMount() {
    const input = this.refs.form.querySelector('.input__login input');
    input && input.focus();
  }

  handleResetInvalid = field => () => this.setState({[field]: ''});

  handleSubmit = ({login, password}) => {
    const logins = Config.get('logins') || {};
    if (login === '' || password === '') {
      const state = {};
      if (login === '') state.login = messages.fieldCannotBeEmpty;
      if (password === '') state.password = messages.fieldCannotBeEmpty;
      this.setState(state);
      return;
    }
    let wrongUser = true;
    let preferredUsername;
    if (Object.keys(logins).length === 0) {
      if (envs.includes(login)) {
        wrongUser = false;
        preferredUsername = password;
      }
    } else {
      if (logins[login] === md5(password)) {
        wrongUser = false;
        preferredUsername = login;
      }
    }
    if (wrongUser) {
      this.setState({login: 'Login or password is incorrect'});
      return;
    }
    if (login !== '' && isStorageSupported) {
      localStorage.setItem('fakeLogin', login);
      localStorage.setItem('preferred_username', preferredUsername);
      document.location.reload();
    }
  }

  render() {
    const {login, password} = this.state;
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="FakeLogin">
          <Header blank />
          <div className="FakeLogin__form editable" ref="form">
            <Form name="fakeLogin" onValidSubmit={this.handleSubmit}>
              <EntityProperty
                name="login"
                title="Login"
                placeholder="Enter login here"
                value=""
                invalid={login}
                onBlur={this.handleResetInvalid('login')}
              />
              <EntityProperty
                name="password"
                title="Password"
                placeholder="Enter password here"
                value=""
                password
                invalid={password}
                onBlur={this.handleResetInvalid('password')}
              />
              <div className="FakeLogin__button">
                <Button name="submit" type="submit">LOG IN</Button>
              </div>
            </Form>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}
