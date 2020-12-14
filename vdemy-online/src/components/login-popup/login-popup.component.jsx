import React from 'react';
import { JsxElectronUtil } from '@salilvnair/jsx-electron';
import { Button, Avatar, Modal, Input, Checkbox  } from '@salilvnair/react-ui';
import { LoginRepo } from './repo/login.repo';
import { Login } from './model/login.model';
import './login-popup.component.scss';
import ContextMenu from '../util/context-menu.component';
import { StarredCourseRepo } from '../course/repo/starred-course.repo';
import { withRouter } from 'react-router-dom';

class LoginPopup extends React.Component {
  jsxElectronUtil = new JsxElectronUtil();
  loginRepo = new LoginRepo();
  starredCourseRepo = new StarredCourseRepo();
  constructor(props) {
    super(props);
    this.child = React.createRef();
  }
  subsribedLoginListener = false;
  state = {
    userName: '',
    businessAccount: false,
    businessDomainUrl: '',
    task: '',
    users: []
  }

  closeModal() {
    this.jsxElectronUtil.ipcRenderer.send('test');
    this.child.current.close();
  }

  addUser = (clicked) => {
    let userInfo = {
                      email: this.state.userName,
                      businessAccount: this.state.businessAccount,
                      businessDomainUrl: this.state.businessDomainUrl
    }
    this.login(clicked, userInfo);
    this.closeModal();
  }

  recordUserMail = (e) => {
      this.setState({userName: e.target.value})
  }

  recordBusinessMail = (e) => {
    //console.log(e.target.checked)
    this.setState({businessAccount: e.target.checked});
  }

  recordBusinessDomainUrl = (e) => {
    let subDomain = e.target.value;
    const businessDomainUrl = `https://${subDomain}.udemy.com`
    this.setState({businessDomainUrl});
  }

  showModal() {
    this.child.current.open();
  }

  login = (clicked, userInfo) => {
    let data = {...userInfo}
    //this.jsxElectronUtil.ipcRenderer.send('logout');
    this.jsxElectronUtil.ipcRenderer.send('login', data);
    this.setState({task:'login'})
    if(clicked) {
      let loggedInUsers = this.loginRepo.selectAllSync();
      this.jsxElectronUtil.ipcRenderer.on('logged-in',(event, userData)=>{
        const { token } = userData;
        this.storeLoginData(loggedInUsers, token);
        this.jsxElectronUtil.ipcRenderer.removeAllListeners();
      });
    }
  }

  storeLoginData = (loggedInUsers, token) => {
    let login = new Login();
    login.email = this.state.userName;
    login.token = token;
    login.businessAccount = this.state.businessAccount;
    login.businessDomainUrl = this.state.businessDomainUrl;
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
    this.props.goHome();
  }

  handleUserName = (e) => {
    this.setState({userName: e.target.value});
  }

  logoutByUser = (user) => {
    this.loginRepo.deleteById(user._id);
    this.loginRepo.compactDatabase();
    const { users } = this.state;
    let newUsers = users.filter(userItr => userItr._id !== user._id)
    this.deleteStarredCoursesOfThisUser(user);
    this.setState({users: newUsers, task:'logout'});
    this.props.goHome();
    let data = {...user}
    this.jsxElectronUtil.ipcRenderer.send('logout', data);
  }

  deleteStarredCoursesOfThisUser(user) {
    let courses = this.starredCourseRepo.selectAllSync();
    let starredCourse = courses.find(course => course.user.email === user.email);
    if(starredCourse) {
      this.starredCourseRepo.deleteById(starredCourse._id)
      this.starredCourseRepo.compactDatabase();
    }
  }

  handlerAvatarSync = (userInfo) => {
    //e.clipboardData.setData('text/plain', mail);
    this.setState({
                    userName: userInfo.email,
                    businessAccount: userInfo.businessAccount,
                    businessDomainUrl: userInfo.businessDomainUrl
    });
    var textField = document.createElement('textarea')
    textField.innerText = userInfo.email;
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove();
    let loginUserInfo = {
      email: userInfo.email,
      ...userInfo
    }
    this.login(true, loginUserInfo);
  }

  menuItems = (user) => {
    return (
      <>
        <div className="contextMenu--option" onClick={()=>this.handlerAvatarSync(user)}>Authenticate</div>
        <div className="contextMenu--option" onClick={()=>this.logoutByUser(user)}>Log Out</div>
      </>
    )
  }

  render() {
    let loggedInUsers = [];
    const { task, users, businessAccount } = this.state;
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
                      <div
                        className="user"
                        key={index}
                        id={user.email}
                        >
                        <Avatar
                          className="user-avatar"
                          type="letter"
                          name={user.email} />
                          <ContextMenu id={user.email} menuItems = {() => this.menuItems(user)} />
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
                          <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-end'}}>
                            <span>Business Account</span>
                            <Checkbox color="primary" onChange={this.recordBusinessMail} />
                          </div>
                          {businessAccount ? (
                            <Input
                              type="filled"
                              onChange={(e) => this.recordBusinessDomainUrl(e)}
                              placeholder="Sub Domain Address" />
                          ) : null}

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

export default withRouter(LoginPopup);
