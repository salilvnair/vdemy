import React from 'react';
import { withRouter } from 'react-router-dom';
import './course.page.scss';
import PlayList from  '../../components/playlist/playlist.component';
import { UdemyApiService } from '../../api/service/udemy-api.service';

class Course extends React.Component {
  state = {
    courseItems: [],
    completedLectureIds: null
  }

  loadCompletedLectures(courseId) {
    this.udemyApiService.loadCompletedLectures(courseId).subscribe(resp => {
      let completedLectureIds = resp.data.completed_lecture_ids;
      this.setState({completedLectureIds:completedLectureIds})
    });
  }

  loadCourseItems(courseId) {
      this.udemyApiService.loadCourseItems(courseId).subscribe(resp => {
        let courseItems = [];
        let currentChapter = 0;
        let courseItem = {};
        resp.data.results.forEach(item => {
          if(item['_class']==='chapter') {
            currentChapter++;
            courseItem = {};
            courseItems.push(courseItem);
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
            lecture.type = item.asset.asset_type;
            courseItem.lectures.push(lecture);
          }
        });
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
    this.udemyApiService = new UdemyApiService(this.props);
    if(!this.props.location.state || !this.props.location.state.course) {
      this.props.history.push("/");
    }
    else {
      this.course = this.props.location.state.course;
      this.loadCourseItems(this.course.id);
      this.loadCompletedLectures(this.course.id);
    }
  }

  render() {
    // let course;
    // if(!this.props.location.state || !this.props.location.state.course) {
    //   this.props.history.push("/");
    // }
    // else {
    //   course = this.props.location.state.course;
    // }

    const { courseItems, completedLectureIds } = this.state;
    return (
        <>
            {courseItems.length>0 && completedLectureIds?this.showCourseItems(this.course.id):null}
        </>
    );
  }
}

export default withRouter(Course);
