import React from 'react';
import { JsxElectronUtil } from '@salilvnair/jsx-electron';
import { Button, Avatar, Modal, Input  } from '@salilvnair/react-ui';
import { LoginRepo } from '../../pages/login/repo/login.repo';
import { Login } from '../../pages/login/model/login.model';
import './user-dashboard.component.scss';

class UserDashboard extends React.Component {
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
    this.child.current.close();
  }

  addUser = () => {
      //console.log(this.state.userName);
      this.login();
      this.closeModal();
  }

  recordUserMail = (e) => {
      this.setState({userName: e.target.value})
  }

  onClose() {
      console.log('I got closed so what!');
  }

  showModal() {
      this.child.current.open();
  }
  login = () => {
    this.jsxElectronUtil.ipcRenderer().send('logout');
    this.jsxElectronUtil.ipcRenderer().send('login');
    this.setState({task:'login'})
    if(!this.subsribedLoginListener) {
      this.jsxElectronUtil.ipcRenderer().on('logged-in',(event, token)=>{
        let login = new Login();
        login.email = this.state.userName;
        login.token = token;
        this.loginRepo.save(login);
        this.loginRepo.compactDatabase();
        this.subsribedLoginListener = true;
        let loggedInUsers = this.loginRepo.selectAllSync();
        this.setState({users: loggedInUsers});
      });
    }
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
    console.log(users)
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
                  loggedInUsers.map(user => {
                    return (
                      <div className="user" key={user._id}>
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
        <Modal disableClose onClose={() => this.onClose()}width="300px" height="200px" ref={this.child}>
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
                        onClick={() => this.addUser()}
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

export default UserDashboard;
