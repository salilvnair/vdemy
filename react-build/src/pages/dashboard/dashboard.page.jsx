import React from 'react';
import Course from '../../components/course/course.component';
import { UdemyApiService } from '../../api/service/udemy-api.service';
import { Loading } from '@salilvnair/react-ui';
class Dashboard extends React.Component {

    state = {
        size: 0,
        courses: [],
        coursesReplica: []
    }

    showAllCourses = () => {
        // this.props.get('https://www.udemy.com/api-2.0/users/me/subscribed-courses?num_collections&page_size=50')
        this.udemyApiService
          .showAllCourses()
          .subscribe(resp => {
            resp.data.results.forEach(result => {
              let courses = result.courses.map(course => {
                return {
                  id: course.id,
                  imageUrl: course['image_240x135'],
                  title: course.title,
                  author: course.visible_instructors[0].display_name,
                  authorImageUrl: course.visible_instructors[0]['image_50x50'],
                  lastAccessed: course.last_accessed_time,
                  completionRatio: course.completion_ratio
                }
              })

              let currentCourses = this.state.courses;
              let concatinaedCourses = currentCourses.concat(courses);
              this.setState({courses: concatinaedCourses});
              this.props.addCoursesToHome(courses);
            })
        });
    }

    componentDidMount() {
      this.udemyApiService = new UdemyApiService(this.props);
      this.showAllCourses();
    }

    filteredCourses = (filteredCourses) => {
      const { courses } = this.state;
      this.setState({courses:filteredCourses, coursesReplica: courses});
    }

    resetFilter = () => {
      const { coursesReplica } = this.state;
      this.setState({courses:coursesReplica});
    }

    loadAllCourses () {
      return (
        this.state.courses.map(course => {
          return <Course key={course.id} data={course} currentUser={this.props.currentUser}/>
        })
      );
    }

    getTotalCourses = () => {
      return this.state.courses.length;
    }

    render() {
        const { courses }  = this.state;
        return (
            <>
              {
                courses.length>0? this.loadAllCourses()
                :
                null
              }
            </>
        );
    }

}

export default Dashboard;
