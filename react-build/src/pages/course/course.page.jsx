import React from 'react';
import { withRouter } from 'react-router-dom';
import './course.page.scss';
import PlayList from  '../../components/playlist/playlist.component';
import withHttpInterceptor from '../../components/hoc/auth/auth.hoc';

class Course extends React.Component {
  state = {
    courseItems: [],
    completedLectureIds: null
  }

  loadCompletedLectures(courseId) {
    let endpointURL = `https://www.udemy.com/api-2.0/users/me/subscribed-courses/${courseId}/progress?fields[course]=completed_lecture_ids,completed_quiz_ids,last_seen_page,completed_assignment_ids`;
    this.props.get(endpointURL).subscribe(resp => {

      let completedLectureIds = resp.data.completed_lecture_ids;
      this.setState({completedLectureIds:completedLectureIds})
    });
  }

  loadCourseItems(courseId) {
    let endpointURL = "https://www.udemy.com/api-2.0"+
      `/courses/${courseId}/cached-subscriber-curriculum-items?page_size=100000&fields[asset]=title,filename,asset_type,external_url,status,time_estimation`;
    this.props.get(endpointURL).subscribe(resp => {
        //console.log(this.props.currentUser,resp);
        let courseItems = [];
        let currentChapter = 0;
        let courseItem = {};
        resp.data.results.forEach(item => {
          if(item['_class']==='chapter') {
            if(currentChapter!==0) {
              courseItems.push(courseItem);
            }
            currentChapter++;
            courseItem = {};
            courseItem.chapterNumber = currentChapter;
            courseItem.chapterTitle = item.title;
            courseItem.id = item.id;
            courseItem.lectures = [];
          }
          else if(item['_class']==='lecture') {
            let lecture = {};
            lecture.title = item.title;
            lecture.id = item.id;
            lecture.time_estimation = item.asset.time_estimation;
            courseItem.lectures.push(lecture);
          }
        })
        this.setState({courseItems:courseItems});
    });
  }

  showCourseItems(courseId) {
    const { courseItems, completedLectureIds } = this.state;
    const { currentUser } = this.props.location.state;
    return <PlayList
                courseItems={courseItems}
                completedLectureIds={completedLectureIds}
                courseId={courseId}
                currentUser={currentUser}/>
  }

  componentDidMount() {
    let course;
    if(!this.props.location.state || !this.props.location.state.course) {
      this.props.history.push("/");
    }
    else {
      course = this.props.location.state.course;
      {
        this.loadCourseItems(course.id);
        this.loadCompletedLectures(course.id);
      }
    }
  }

  render() {
    let course;
    if(!this.props.location.state || !this.props.location.state.course) {
      this.props.history.push("/");
    }
    else {
      course = this.props.location.state.course;
    }

    const { courseItems, completedLectureIds } = this.state;
    console.log(this.state);
    return (
        <>
            {courseItems.length>0 && completedLectureIds?this.showCourseItems(course.id):null}
        </>
    );
  }
}

export default withHttpInterceptor(withRouter(Course));
