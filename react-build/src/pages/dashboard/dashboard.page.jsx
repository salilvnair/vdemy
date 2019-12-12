import React from 'react';
import Course from '../../components/course/course.component';
import { UdemyApiService } from '../../api/service/udemy-api.service';
class Dashboard extends React.Component {
    state = {
        size: 0,
        courses: [],
        coursesReplica: []
    }
    currentSize = 0;

    showAllCourses = (user) => {
        // this.props.get('https://www.udemy.com/api-2.0/users/me/subscribed-courses?num_collections&page_size=50')
        let userInfo = {
          currentUser: user
        }
        this.udemyApiService = new UdemyApiService(userInfo);
        this.udemyApiService
          .showAllCourses()
          .subscribe(resp => {
            let concatinaedCourses;
            resp.data.results.forEach(result => {
              let courses = result.courses.map(course => {
                return {
                  user:user,
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
              concatinaedCourses = currentCourses.concat(courses);
              this.setState({courses: concatinaedCourses});
              this.props.addCoursesToHome(courses);
            })
            this.currentSize = this.currentSize - 1;
            if(this.currentSize === 0) {
              this.setState({coursesReplica: concatinaedCourses});
            }
        });
    }

    componentDidMount() {
      let loggedInUsers = this.props.loggedInUsers;
      if(loggedInUsers.length > 0) {
        loggedInUsers.forEach((user, index) => {
          this.currentSize =  index+1;
          this.showAllCourses(user);
        })
      }
    }

    filteredCourses = (filteredCourses) => {
      this.setState({courses:filteredCourses});
    }

    resetFilter = () => {
      const { coursesReplica } = this.state;
      this.setState({courses:coursesReplica});
    }

    loadAllCourses () {
      return (
        this.state.courses.map(course => {
          return <Course key={course.id} data={course} currentUser={course.user}/>
        })
      );
    }

    getTotalCourses = () => {
      return this.state.courses.length;
    }

    render() {
        const { courses }  = this.state;
        return (
            <React.Fragment>
              {
                courses.length>0? this.loadAllCourses()
                :
                null
              }
            </React.Fragment>
        );
    }

}

export default Dashboard;
