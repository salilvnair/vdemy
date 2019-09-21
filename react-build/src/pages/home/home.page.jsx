import React from 'react';
import { LoginRepo } from '../../components/login-popup/repo/login.repo';
import Dashboard from '../dashboard/dashboard.page';
import './home.page.scss';

class Home extends React.Component {
  loginRepo = new LoginRepo();
  render() {
    const { to, staticContext, ...rest } = this.props;
    let loggedInUsers = this.loginRepo.selectAllSync();
    return (
        <div {...rest} className="home">
          {
            loggedInUsers.length > 0 ?
            loggedInUsers.map(user => {
              console.log(user)
              return (
                <Dashboard key={user._id} currentUser={user} />
              );
            })
            : <h1>Welcome toWeb!!!</h1>
          }
        </div>
    );
  }
}

export default Home;
