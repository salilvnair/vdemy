import { JsxElectronUtil } from '@salilvnair/jsx-electron';
import { Switch, Route } from 'react-router-dom';
import React from 'react';
import reactElectronUpdater from '@jsxeu/core';

import Home from './pages/home/home.page';
import Course from './pages/course/course.page';
import Header from './components/header/header.component';

import { Notifier } from './script';
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
      //this.jsxElectronUtil.ipcRenderer.removeAllListeners();
    })
  }

  checkForUpdate = () => {
    let notifier = new Notifier();
    this.props.checkForUpdate().subscribe(updateStatus=>{
      console.log(updateStatus);
      if(this.props.hasPendingUpdates()) {
        console.log('update available')
      }
      else if(updateStatus.updateAvailable){
        notifier.update(updateStatus);
        notifier.on("update-notifier", "onupdate", (notifierAction) => {
          console.log("updateNotifierEvent:",notifierAction);
          if(notifierAction.action==='download') {
            notifier.download(this.props.download(), 'download');
            notifier.on("download-notifier", "ondownload", (event) => {
              console.log("downloadEvent:",event);
            });
          }
        })
      }
      else{
        if(updateStatus.noInfo){

          notifier.info("Looks like you app is in the development mode,\n\n hence no release found!","400px");
        }
        else{
          notifier.info("Your app is up to date!");
        }
      }
    })
  }

}
let releaseInfo = {
  user: 'salilvnair',
  repo: 'vdemy',
  appName: 'vdemy'
}
export default reactElectronUpdater(releaseInfo)(App);
