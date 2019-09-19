import { Switch, Route } from 'react-router-dom';
import React from 'react';

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
}

export default App;
