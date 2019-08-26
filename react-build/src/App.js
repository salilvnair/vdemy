import React from 'react';
import Home from './pages/home/home.page';
import { JsxElectronUtil } from '@salilvnair/jsx-electron';

class App extends React.Component {
   state = {
      token : ''
   }
   
   logout = () => {
    this.setState({token:''});
    localStorage.removeItem('token');
   }
   
   login = () => {
    let jsxElectronUtil = new JsxElectronUtil();
    jsxElectronUtil.ipcRenderer().send('login');
    jsxElectronUtil.ipcRenderer().on('logged-in',(event, token)=>{
        //console.log(token);
        localStorage.setItem('token',token);
        console.log('setting the new state')
        this.setState({token:token});
    }); 
  }
  render() {
    let token = localStorage.getItem('token');
    console.log('rendered', token);
    return (
        <div className="App">
          <input type="button" value="Logout" onClick={this.logout}/>
          <input type="button" value="Login" onClick={this.login}/>
          {
            token!=null ? <Home />:null
          }
        </div>
      );
    }
}

export default App;
