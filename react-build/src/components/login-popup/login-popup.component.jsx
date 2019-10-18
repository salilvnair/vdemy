import React from 'react';
import { JsxElectronUtil } from '@salilvnair/jsx-electron';
import { Button, Avatar, Modal, Input  } from '@salilvnair/react-ui';
import { LoginRepo } from './repo/login.repo';
import { Login } from './model/login.model';
import './login-popup.component.scss';

class LoginPopup extends React.Component {
  jsxElectronUtil = new JsxElectronUtil();
  loginRepo = new LoginRepo();
  constructor(props) {
    super(props);
    this.child = React.createRef();
  }
  subsribedLoginListener = false;
  state = {
    userName: '',
    task: '',
    users: []
  }

  closeModal() {
    this.jsxElectronUtil.ipcRenderer().send('test');
    this.child.current.close();
  }

  addUser = (clicked) => {
      this.login(clicked);
      this.closeModal();
  }

  recordUserMail = (e) => {
      this.setState({userName: e.target.value})
  }

  showModal() {
    this.child.current.open();
  }

  login = (clicked) => {
    let data = {
      email : this.state.userName
    }
    //this.jsxElectronUtil.ipcRenderer().send('logout');
    this.jsxElectronUtil.ipcRenderer().send('login', data);
    this.setState({task:'login'})
    if(clicked) {
      let loggedInUsers = this.loginRepo.selectAllSync();
      this.jsxElectronUtil.ipcRenderer().on('logged-in',(event, userData)=>{
        const { token } = userData;
        this.storeLoginData(loggedInUsers, token);
        this.jsxElectronUtil.ipcRenderer().removeAllListeners();
      });
    }
  }

  storeLoginData = (loggedInUsers, token) => {
    let login = new Login();
    login.email = this.state.userName;
    login.token = token;
    let existingUser = loggedInUsers.filter(user => user.email===login.email);
    if(existingUser.length > 0 ) {
      this.loginRepo.update(existingUser[0], login);
      this.loginRepo.compactDatabase();
    }
    else {
      this.loginRepo.save(login);
      loggedInUsers.push(login);
    }
    this.subsribedLoginListener = true;
    this.setState({users: loggedInUsers});
  }

  handleUserName = (e) => {
    this.setState({userName: e.target.value});
  }

  logout = () => {
    this.loginRepo.deleteAll();
  }
  render() {
    let loggedInUsers = [];
    const { task, users } = this.state;
    if(task==='') {
      loggedInUsers = this.loginRepo.selectAllSync();
    }
    else {
      loggedInUsers = users;
    }
    return (
      <div className="user-dashboard">
        <div className="users">
            {
                  loggedInUsers.length>0 ?
                  loggedInUsers.map((user,index) => {
                    return (
                      <div className="user" key={index}>
                        <Avatar
                          type="letter"
                          name={user.email} />
                      </div>
                    );
                  })
                  : null
            }
        </div>
        <Button style={{marginTop:'5px'}}
          type="raised"
          onClick={() => this.showModal()}
          color="primary">ADD USER</Button>
        <Modal disableClose width="300px" height="200px" ref={this.child}>
              <Modal.Header>
                  Add User
              </Modal.Header>
              <Modal.Content>
                  <div style={{display:'flex', flexDirection:'column'}}>
                      <Input
                          type="filled"
                          onChange={(e) => this.recordUserMail(e)}
                          placeholder="Enter Email" />
                  </div>
              </Modal.Content>
              <Modal.Actions>
                  <React.Fragment>
                      <Button
                        type="raised"
                        style={{margin:'5px'}}
                        onClick={() => this.addUser(true)}
                        color="primary">Add
                      </Button>
                      <Button
                        type="raised"
                        onClick={() => this.closeModal()}
                        color="warn">Cancel
                      </Button>
                  </React.Fragment>
              </Modal.Actions>
          </Modal>
    </div>
    );
  }
}

export default LoginPopup;
