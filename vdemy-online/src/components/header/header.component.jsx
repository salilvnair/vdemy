import React from 'react';
import { Button, Avatar  } from '@salilvnair/react-ui';
import { withRouter } from 'react-router-dom';
import './header.component.scss';
import LoginPopup from '../login-popup/login-popup.component';

class Header extends React.Component {
  state= {
    showUserDashboard: false,
    currentFocus: 'home'
  }

  showUserDashboard = () => {
    const { showUserDashboard } = this.state;
    this.setState({showUserDashboard:!showUserDashboard})
  }

  goHome = () => {
    this.props.history.push("/");
  }

  render() {
    let homeBtnStyle = {};
    var routePath = this.props.location.pathname;
    if(routePath==='/') {
      homeBtnStyle = {
        color:'#3f51b5',
        bcolor:'white',
        type: "raised"
      }
    }
    else {
      homeBtnStyle = {
        color:'white',
        bcolor:'#3f51b5',
        type: "basic"
      }
    }
    const { showUserDashboard } = this.state;
    return (
      <div className={`vdemy-header`}>
          <React.Fragment>
              <div>
              <Button type="raised logo" color="primary">
                <div style={{display:'flex'}}>
                <img style={{display:'inline-block',height:'15px',marginTop:'10px'}} src="https://user-images.githubusercontent.com/34584327/70992293-5dba8980-20ef-11ea-84a2-285280100cb8.png" alt="vdemy_logo"/>
                <span style={{display:'inline-block', marginBottom:'5px'}}>&nbsp;DEMY</span>
                </div>
              </Button>
                <Button style={{marginLeft:'100px',color:`${homeBtnStyle.color}`,backgroundColor:`${homeBtnStyle.bcolor}`}} type={homeBtnStyle.type} onClick={this.goHome} >Home</Button>
              </div>
              <div onClick={() => this.showUserDashboard()}>
                <Avatar
                  height="50"
                  width="50"
                  type="button"
                  url="https://img.icons8.com/plasticine/344/add-user-male.png"
                  name="Logged In As" />
              </div>
          </React.Fragment>
          {
            showUserDashboard ? <LoginPopup /> : null
          }

      </div>
    );
  }


}

export default withRouter(Header);
