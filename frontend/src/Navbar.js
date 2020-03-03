import React from 'react';
import ReactDOM from 'react-dom';

import Modal from 'react-modal';
const axios = require('axios');
const store = require('store');


const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

Modal.setAppElement('#root');

export class Navbar extends React.Component {

  
  constructor(props){
    super(props)

    var resetToken;
    console.log(props);
    this.title = "TITLE"
    //Check to see if logged in
    // var user = store.get('user');
    var token = "Token " + store.get('token');
    if(token && token != "Token undefined") {
      var currentUser = this.current(token);
      this.token = token;
      var loggedIn = true;
    } else {
      var loggedIn = false;
    }

    this.state = {
      loggedIn: loggedIn,
      user: "",
      showLoginForm: false,
      showRegisterForm: false,
      showResetPasswordForm: false,
      showChangePasswordForm: false,
      showResetPasswordForm: false,
      showChangePasswordForm: false,
      newUsername: "",
      email: "",
      password: "",
      newPassword: "",
      modalIsOpen: false
    }

    



    this.toggleLoginForm = this.toggleLoginForm.bind(this);
    this.toggleRegisterForm = this.toggleRegisterForm.bind(this);
    this.toggleResetForm = this.toggleResetForm.bind(this);
    this.toggleChangeForm = this.toggleChangeForm.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleNewPasswordChange = this.handleNewPasswordChange.bind(this);
    this.handleNewUsernameChange = this.handleNewUsernameChange.bind(this);
    this.login = this.login.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.register = this.register.bind(this);
    this.current = this.current.bind(this);
    this.logout = this.logout.bind(this);
    this.change = this.change.bind(this);
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    

  }

  componentDidMount() {
    // this.formatPrice();
    // this.openModal();
  }

  login() {
    //Post login route
    var email = this.state.email;
    var password = this.state.password;
    var login = axios.post('api/users/login', {
      user: {
        email: email,
        password: password,
      }
    })
    .then((response) => {
      console.log(response.data)
      // alert(response.data.user.email)
      store.set('token', response.data.user.token)
      console.log(response.data)
      this.setState({
        user: response.data.user,
        username: response.data.user.username,
        token: response.data.user.token,
        loggedIn: true,
        showLoginForm: false,
        modalIsOpen: false
      })
    })
    .catch(function (error) {
      // handle error
      console.log("error")
      console.log(error)
    });
  }
  
  forgotPassword() {
    //Post forgotPassword route
    console.log("WOW");
    var email = this.state.email;
    var password = this.state.password;
    var forgot = axios.post('api/users/forgot', {
      user: {
        email: email,
      }
    })
    .then((response) => {
      console.log(response.data)
      // alert(response.data.user.email)
      store.set('token', response.data.user.token)
      console.log(response.data)
      this.setState({
        user: response.data.user,
        username: response.data.user.username,
        token: response.data.user.token,
        loggedIn: true,
        showLoginForm: false,
        modalIsOpen: false
      })
    })
    .catch(function (error) {
      // handle error
      console.log("error")
      console.log(error)
    });
  }
  register() {
    //Post register route
    var email = this.state.email;
    var password = this.state.password;
    var username = this.state.newUsername;
    var register = axios.post('api/users/register', { 
      user: {
        email: email,
        password: password,
        username: username,
        modalIsOpen: false
      }
    })
    .then((response) => {
      console.log(response.data);
      this.setState(state => ({
        showRegisterForm: false
      }));
    })
    .catch(function (error) {
      // handle error
    });
  }

  current(token) {
    var login = axios.get('api/users/current', {
      headers: {Authorization: token}
    })
    .then((response) => {
      // alert(response.data.user.email)
      store.set('user', response.data.user)
      this.setState({
        user: response.data.user,
        // token: response.data.user.token,
        username: response.data.user.username,
        loggedIn: true,
        showLoginForm: false
      })

      console.log(this.state.user)
    })
    .catch(function (error) {
      // handle error
      console.log("error")
      console.log(error)
    });
  }

  logout() {
    store.remove('token');
    this.setState({
      loggedIn: false
    });
  }

  change() {
    //Post change route
    var change = axios.post('/api/users/change', 
    {
      "token": this.token,
      "password": this.state.password,
      "newPassword": this.state.newPassword},
    {
      headers: {Authorization: this.token},
        
    })
    .then((response) => {
      console.log(response.data);
      //Navigate home
    })
    .catch(function (error) {
      // handle error
    });
  }
  toggleLoginForm() {
    this.setState(state => ({
      modalIsOpen: !state.showLoginForm,
      showLoginForm: !state.showLoginForm,
      showRegisterForm: false,
      showResetPasswordForm: false,
      showChangeForm: false,
    }));
  }
  toggleRegisterForm() {
    this.setState(state => ({
      modalIsOpen: !state.showRegisterForm,
      showRegisterForm: !state.showRegisterForm,
      showLoginForm: false,
      showResetPasswordForm: false,
      showChangeForm: false,
    }));
  }
  toggleResetForm() {
    this.setState(state => ({
      modalIsOpen: !state.showResetPasswordForm,
      showResetPasswordForm: !state.showResetPasswordForm,
      showLoginForm: false,
      showRegisterForm: false,
      showChangeForm: false,
    }));
  }
  toggleChangeForm() {
    this.setState(state => ({
      modalIsOpen: !state.showChangeForm,
      showChangeForm: !state.showChangeForm,
      showLoginForm: false,
      showRegisterForm: false,
      showResetPasswordForm: false,
    }));
  }
  handleEmailChange(event) {
    this.setState({email: event.target.value});
  }
  handlePasswordChange(event) {
    this.setState({password: event.target.value});
  }
  handleNewPasswordChange(event) {
    this.setState({newPassword: event.target.value});
  }
  handleNewUsernameChange(event) {
    this.setState({newUsername: event.target.value});
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }
 
  afterOpenModal() {
    // references are now sync'd and can be accessed.
    // this.subtitle.style.color = '#f00';
  }
 
  closeModal() {
    this.setState({
      modalIsOpen: false,
      showLoginForm: false,
      showRegisterForm: false,
      showResetPasswordForm: false,
      showChangeForm: false,

    });
  }
 


  render() {
    return (
      <div className="navbar-container">
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Login Modal"
        >
          <div>
            <div className={this.state.showLoginForm ? '' : 'hidden'}>
              <h2 className="login-modal">Login</h2>
              <div className="login-row">Email: <input type="email" value={this.state.email} onChange={this.handleEmailChange}/></div>
              <div className="login-row">Password: <input type="password" value={this.state.password} onChange={this.handlePasswordChange}/></div>
              <button onClick={this.login}>Log In</button>
              <button onClick={this.closeModal}>Close</button>
              <button onClick={this.forgotPassword}>Forgot Password</button>
            </div>
            <div className={this.state.showRegisterForm ? '' : 'hidden'}>
              <h2 className="register-modal">Register</h2>
              <div className="login-row">Username: <input type="text" value={this.state.newUsername} onChange={this.handleNewUsernameChange}/></div>
              <div className="login-row">Email: <input type="email" value={this.state.email} onChange={this.handleEmailChange}/></div>
              <div className="login-row">Password: <input type="password" value={this.state.password} onChange={this.handlePasswordChange}/></div>
              <button onClick={this.register}>Sign Up</button>
              <button onClick={this.closeModal}>Close</button>
            </div>
            
            <div className={this.state.showChangeForm ? '' : 'hidden'}>
              <h2 className="change-modal">Change</h2>
              <div className="login-row">Current password: <input type="password" value={this.state.password} onChange={this.handlePasswordChange}/></div>
              <div className="login-row">New password: <input type="password" value={this.state.newPassword} onChange={this.handleNewPasswordChange}/></div>
              <button onClick={this.change}>Submit</button>
              <button onClick={this.closeModal}>Close</button>
            </div>
          </div> 
          {/* <LoginRegisterModal></LoginRegisterModal> */}
        </Modal>
        
        <div className="navbar">
          <div className="center logo">
            {this.title}
          </div>
          <div className="welcome-message">
            <div>
              <div className={this.state.loggedIn ? 'hidden' : ''}>
                <button className="nav-button" onClick={this.toggleLoginForm}>Login</button>
                <button className="nav-button" onClick={this.toggleRegisterForm}>Sign Up</button>
              </div>
              <div className={this.state.loggedIn ? '' : 'hidden'}>
                <div>
                  {
                    this.state.username &&
                    "Welcome, " + this.state.username
                  }
                  
                  <button className="nav-button" onClick={this.toggleChangeForm}>Change Password</button>
                  <button className="nav-button" onClick={this.logout}>Logout</button>
                </div>
              </div>
            </div>
            {/* <div className={this.state.showLoginForm ? '' : 'hidden'}>
              Email: <input type="email" value={this.state.email} onChange={this.handleEmailChange}/>
              Password: <input type="password" value={this.state.password} onChange={this.handlePasswordChange}/>
              <button onClick={this.login}>Log In</button>
            </div>
            <div className={this.state.showRegisterForm ? '' : 'hidden'}>
              Email: <input type="email" value={this.state.email} onChange={this.handleEmailChange}/>
              Password: <input type="password" value={this.state.password} onChange={this.handlePasswordChange}/>
              <button onClick={this.register}>Sign Up</button>
            </div> */}
          </div>
        </div>
      </div>
    );
  }
  
}

export default Navbar;