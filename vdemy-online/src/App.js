import { Switch, Route, Redirect } from "react-router-dom";
import React from "react";
import Home from "./pages/home/home.page";
import Course from "./pages/course/course.page";
import Header from "./components/header/header.component";
import Courses from "./pages/courses/courses.page";
import ProgressBar from "./components/progress-bar/progress-bar.component";
import { Provider as ProgressBarProvider } from "./context/ProgressBarContext";
class App extends React.Component {
  render() {
    const defaultRoute = () => <Redirect to="/" />;
    return (
      <>
        <ProgressBarProvider>
          <Header />
          <ProgressBar hide />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/courses" component={Courses} />
            <Route path="/course" component={Course} />
            <Route component={defaultRoute} />
          </Switch>
        </ProgressBarProvider>
      </>
    );
  }
}
export default App;
