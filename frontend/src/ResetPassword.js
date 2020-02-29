import React from 'react';
const axios = require('axios');
const store = require('store');


class ResetPassword extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      token: ""
    }
    
    this.reset = this.reset.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    
  }

  componentDidMount() {
    if(this.props.match != null) {
      this.setState({
        token: this.props.match.params.token
      })
      // this.resetToken = this.props.match.params.token
      console.log("Token: " + this.props.match.params.token);
    } 
  }
 
  reset() {
    //Post reset route
    var reset = axios.post('/api/users/reset', { 
        "token": this.state.token,
        "newPassword": this.state.password
    })
    .then((response) => {
      console.log(response.data);
      //Navigate home
    })
    .catch(function (error) {
      // handle error
    });
  }

  handlePasswordChange(event) {
    this.setState({password: event.target.value});
  }

  render() {
    return (
        <div>
          <div className='stock-card reset-password-card'>
            <h2 className="reset-modal">Reset</h2>
            <div className="login-row">New Password: <input type="password" value={this.state.password} onChange={this.handlePasswordChange}/></div>
            <button onClick={this.reset}>Reset Password</button>
          </div>
        </div>
    )
  }

  

  
}

export default ResetPassword;