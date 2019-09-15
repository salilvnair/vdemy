import React from 'react';
import { LoginRepo } from '../login/repo/login.repo';
import Home from '../home/home.page';
import './login.page.scss';

class LoginPage extends React.Component {
  loginRepo = new LoginRepo();
  render() {
    const { to, staticContext, ...rest } = this.props;
    let loggedInUsers = this.loginRepo.selectAllSync();
    return (
        <div {...rest} className="home-container">
          {
            loggedInUsers.length > 0 ?
            loggedInUsers.map(user => {
              return (
                <Home key={user._id} currentUser={user} />
              );
            })
            : ''
          }
        </div>
    );
  }
}

export default LoginPage;
