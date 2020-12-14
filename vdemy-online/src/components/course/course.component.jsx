import React from "react";
import { withRouter } from "react-router-dom";
import "./course.component.scss";
import { Icon } from "@salilvnair/react-ui";
import { Context as ProgressBarContext } from "../../context/ProgressBarContext";

class Course extends React.Component {
  state = {
    courseItems: [],
    pinned: false,
  };

  static contextType = ProgressBarContext;

  handleClick = (e, course) => {
    const { show } = this.context;
    show();
    e.preventDefault();
    let currentUser = this.props.currentUser;
    if (this.props.currentUser && !this.props.currentUser.token) {
      currentUser = this.loadCurrentUserWithLatestToken(currentUser);
    }
    //console.log(currentUser)
    this.props.history.push("/course", {
      course: course,
      currentUser,
    });
  };

  loadCurrentUserWithLatestToken(currentUser) {
    let currentUserInfo = this.props.loginRepo.selectOneByColumnSync(
      "_id",
      currentUser._id
    );
    ////console.log("loadCurrentUserWithLatestToken", currentUser);
    return currentUserInfo;
  }

  handleStarClick = (e, course) => {
    e.preventDefault();
    e.stopPropagation();
    let starredCourseRepo = this.props.starredCourseRepo;
    let starredCourse = starredCourseRepo.selectOneByColumnSync(
      "id",
      course.id
    );
    let pinned = !this.state.pinned;
    this.setState({ pinned: pinned });
    ////console.log(pinnedCourse,'before check');
    if (starredCourse._id) {
      let oldStarredCourse = { ...starredCourse };
      starredCourse.pinned = pinned;
      ////console.log(pinnedCourse,'update check');
      starredCourseRepo.update(oldStarredCourse, starredCourse);
      starredCourseRepo.compactDatabase();
    } else {
      let { user, ...courseInfo } = course;
      let { token, ...userInfo } = user;
      courseInfo.user = userInfo;
      starredCourse = courseInfo;
      starredCourse.pinned = pinned;
      ////console.log(starredCourse, "save check");
      starredCourseRepo.save(starredCourse);
    }
    if (this.props.onStarClick) {
      this.props.onStarClick(starredCourse);
    }
  };

  componentDidMount() {
    let course = this.props.data;
    let pinnedCourse = this.props.starredCourseRepo.selectOneByColumnSync(
      "id",
      course.id
    );
    if (pinnedCourse && pinnedCourse._id) {
      let pinned = pinnedCourse.pinned;
      this.setState({ pinned: pinned });
    }
  }

  render() {
    let course = this.props.data;
    const { pinned } = this.state;
    return (
      <div className="wrapper" title={this.props.currentUser.email}>
        <div
          className="card radius shadowDepth1"
          onClick={(e) => this.handleClick(e, course)}
        >
          <div
            className="star__card-container"
            onClick={(e) => this.handleStarClick(e, course)}
          >
            {pinned ? (
              <Icon style={{ color: "red" }} size="35">
                star
              </Icon>
            ) : (
              <Icon size="35">star_border</Icon>
            )}
          </div>
          <div className="card__image border-tlr-radius">
            <img src={course.imageUrl} alt="" className="border-tlr-radius" />
          </div>

          <div className="card__content card__padding">
            <article className="card__article">
              <h4 title={course.title}>
                {course.title.length > 55
                  ? course.title.substring(0, 53) + "..."
                  : course.title}
              </h4>
              <p>{course.subtitle}</p>
            </article>
          </div>

          <div className="card__action">
            <div className="card__author">
              {
                course.authorImageUrl? <img src={course.authorImageUrl} alt="user" /> : null
              }
              <div className="card__author-content">
                <span title={course.author}>
                  {course.author.length > 18
                    ? course.author.substring(0, 15) + "..."
                    : course.author}
                </span>
              </div>
            </div>
          </div>
          <div id="progressbar">
            <div style={{ width: course.completionRatio + "%" }}></div>
            <span>{course.completionRatio}%</span>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Course);
