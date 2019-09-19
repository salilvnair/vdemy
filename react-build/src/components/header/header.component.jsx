import React from 'react';
import { Button, Avatar  } from '@salilvnair/react-ui';
import { Link, withRouter } from 'react-router-dom';
import './header.component.scss';
import LoginPopup from '../login-popup/login-popup.component';

class Header extends React.Component {
  state= {
    showUserDashboard: false
  }

  showUserDashboard = () => {
    const { showUserDashboard } = this.state;
    this.setState({showUserDashboard:!showUserDashboard})
  }

  goHome = () => {
    this.props.history.push("/");
  }

  render() {
    const { showUserDashboard } = this.state;
    return (
      <div className={`vdemy-header`}>
          {
            <>
              <Button onClick={this.goHome} >Home</Button>
              <div onClick={() => this.showUserDashboard()}>
              <Avatar
                height="50"
                width="50"
                type="button"
                url="https://img.icons8.com/plasticine/344/add-user-male.png"
                name="Logged In As" />
              </div>
            </>
          }
          {
            showUserDashboard ? <LoginPopup /> : null
          }

      </div>
    );
  }


}

export default withRouter(Header);
