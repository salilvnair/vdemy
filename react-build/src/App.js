import { Switch, Route } from 'react-router-dom';
import React from 'react';

import LoginPage from './pages/login/login.page';
import Dashboard from './pages/dashboard/dashboard.page';
import Header from './components/header/header.component';
class App extends React.Component {
  render() {
    return (
        <>
          <Header />
          <Switch>
            <Route exact path="/" component={LoginPage} />
            <Route path="/dashboard" component={Dashboard} />
          </Switch>
        </>
      );
    }
}

export default App;
