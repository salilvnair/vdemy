import React from "react";
import Course from "../../components/course/course.component";
import { StarredCourseRepo } from "../../components/course/repo/starred-course.repo";
import "./home.page.scss";
import { LoginRepo } from "../../components/login-popup/repo/login.repo";
class Home extends React.Component {
  state = {
    courses: [],
  };

  starredCourseRepo = new StarredCourseRepo();
  loginRepo = new LoginRepo();

  componentDidMount() {
    let courses = this.starredCourseRepo.selectAllSync();
    if (courses && courses.length > 0) {
      let filteredCourses = courses.filter((course) => course.pinned);
      this.setState({ courses: filteredCourses });
    }
  }
  handleStarClick(starredCourse) {
    let filteredCourses = this.state.courses.filter(
      (course) => starredCourse._id !== course._id
    );
    this.setState({ courses: filteredCourses });
  }

  loadAllCourses() {
    return this.state.courses.map((course) => {
      return (
        <React.Fragment key={course.id}>
          <Course
            key={course.id}
            starredCourseRepo={this.starredCourseRepo}
            loginRepo={this.loginRepo}
            data={course}
            onStarClick={(course) => this.handleStarClick(course)}
            currentUser={course.user}
          />
        </React.Fragment>
      );
    });
  }

  render() {
    const { courses } = this.state;
    return (
      <div className="home">
        <div className="course-container">
          {courses.length > 0 ? this.loadAllCourses() : null}
        </div>
      </div>
    );
  }
}

export default Home;
