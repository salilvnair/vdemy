import { JsxElectronUtil } from '@salilvnair/jsx-electron';
import { Switch, Route } from 'react-router-dom';
import React from 'react';
import reactElectronUpdater from '@jsxeu/core';

import Home from './pages/home/home.page';
import Course from './pages/course/course.page';
import Header from './components/header/header.component';
class App extends React.Component {
  render() {
    return (
        <>
          <Header />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/course" component={Course} />
          </Switch>
        </>
      );
  }
  componentDidMount() {
    this.jsxElectronUtil = new JsxElectronUtil();
    this.jsxElectronUtil.ipcRenderer.on('checkForUpdate', ()=> {
      this.checkForUpdate();
      this.jsxElectronUtil.ipcRenderer.removeAllListeners();
    })
  }

  checkForUpdate = () => {
    this.props.checkForUpdate().subscribe(response=>{
      //console.log(response);
    })
  }

}
let releaseInfo = {
  user: 'salilvnair',
  repo: 'vdemy',
  appName: 'vdemy'
}
export default reactElectronUpdater(releaseInfo)(App);
