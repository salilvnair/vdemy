import React from 'react';
import withHttpInterceptor from '../../components/hoc/auth/auth.hoc';
import Course from '../../components/course/course.component';
class Dashboard extends React.Component {

    state = {
        size: 0,
        courses: []
    }

    showAllCourses = () => {
        // this.props.get('https://www.udemy.com/api-2.0/users/me/subscribed-courses?num_collections&page_size=50')
        this.props.get('https://www.udemy.com/api-2.0/users/me/subscribed-courses-collections/?collection_has_courses=True&course_limit=9&fields[course]=@min,visible_instructors,image_240x135,image_480x270,favorite_time,archive_time,is_practice_test_course,completion_ratio,last_accessed_time,enrollment_time,features,published_title,remaining_time&fields[user_has_subscribed_courses_collection]=@all&page=1&page_size=8')
        .subscribe(resp => {
            resp.data.results.forEach(result => {
              let courses = result.courses.map(course => {
                return {
                  id: course.id,
                  imageUrl: course['image_240x135'],
                  title: course.title,
                  author: course.visible_instructors[0].display_name,
                  authorImageUrl: course.visible_instructors[0]['image_50x50'],
                  lastAccessed: course.last_accessed_time
                }
              })

              let currentCourses = this.state.courses;
              let concatinaedCourses = currentCourses.concat(courses);
              this.setState({courses: concatinaedCourses});
            })
        });
    }

    componentDidMount() {
      this.showAllCourses()
    }

    loadAllCourses () {
      return (
        this.state.courses.map(course => {
          return <Course key={course.id} data={course} currentUser={this.props.currentUser}/>
        })
      );
    }

    render() {
        const { courses }  = this.state;
        return (
            <>
              {
                courses.length>0? this.loadAllCourses() :null
              }
            </>
        );
    }

}

export default withHttpInterceptor(Dashboard);
