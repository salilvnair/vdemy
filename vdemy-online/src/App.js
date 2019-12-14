import { Switch, Route, Redirect } from 'react-router-dom';
import React from 'react';
import Home from './pages/home/home.page';
import Course from './pages/course/course.page';
import Header from './components/header/header.component';
class App extends React.Component {
  render() {
    const defaultRoute = () => <Redirect to='/'/>
    return (
        <React.Fragment>
          <Header />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/course" component={Course} />
            <Route component={defaultRoute} />
          </Switch>
        </React.Fragment>
      );
  }
}
export default App;
