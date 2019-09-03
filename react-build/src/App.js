import React from 'react';
import Home from './pages/home/home.page';
import { JsxElectronUtil } from '@salilvnair/jsx-electron';
import { Login } from './pages/login/model/login.model';
import { LoginRepo } from './pages/login/repo/login.repo';
class App extends React.Component {
   jsxElectronUtil = new JsxElectronUtil();
   loginRepo = new LoginRepo();
   subsribedLoginListener = false;
   state = {
      token : '',
      userName: ''
   }

   logout = () => {
    this.setState({token:''});
    localStorage.removeItem('token');
   }

   login = () => {
    localStorage.removeItem('token');
    this.jsxElectronUtil.ipcRenderer().send('logout');
    this.jsxElectronUtil.ipcRenderer().send('login');
    if(!this.subsribedLoginListener) {
      this.jsxElectronUtil.ipcRenderer().on('logged-in',(event, token)=>{
        localStorage.setItem(this.state.userName,token);
        let login = new Login();
        login.email = this.state.userName;
        login.token = token;
        this.loginRepo.save(login);
        console.log(localStorage)
        this.setState({token:token});
        this.subsribedLoginListener = true;
      });
    }
  }

  handleUserName = (e) => {
    this.setState({userName: e.target.value});
  }

  render() {
    let token = localStorage.getItem('salilvnair@gmail.com');
    let login = this.loginRepo.selectAllSync();
    console.log(login);
    return (
        <div className="App">
          <input type="text" onChange={this.handleUserName}/>
          <input type="button" value="Logout" onClick={this.logout}/>
          <input type="button" value="Login" onClick={this.login}/>
          <Home currentUser={login[0]} />
          <Home currentUser={login[1]} />
        </div>
      );
    }
}

export default App;
