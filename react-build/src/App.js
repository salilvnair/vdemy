import React from 'react';
import Home from './pages/home/home.page';
import { JsxElectronUtil } from '@salilvnair/jsx-electron';

class App extends React.Component {
   jsxElectronUtil = new JsxElectronUtil();
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
    this.jsxElectronUtil.ipcRenderer().on('logged-in',(event, token)=>{
        localStorage.setItem(this.state.userName,token);
        console.log(localStorage)
        this.setState({token:token});
    });
  }

  handleUserName = (e) => {
    this.setState({userName: e.target.value});
  }

  render() {
    let token = localStorage.getItem('mailsalilvnair@gmail.com');
    console.log('rendered', token);
    return (
        <div className="App">
          <input type="text" onChange={this.handleUserName}/>
          <input type="button" value="Logout" onClick={this.logout}/>
          <input type="button" value="Login" onClick={this.login}/>
          {
            token!=null ? <Home loggedIn={'salil'} />:null
          }
        </div>
      );
    }
}

export default App;
