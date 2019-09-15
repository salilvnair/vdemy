import React from 'react';
import { withRouter } from 'react-router-dom';
import withHttpInterceptor from '../hoc/auth/auth.hoc';
import './course.component.scss';
import PlayList from '../playlist/playlist.component';

class Course extends React.Component {
  state = {
    courseItems: []
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
            courseItem.lectures.push(lecture);
          }
        })
        this.setState({courseItems:courseItems});
    });

  }

  showCourseItems(courseId) {
    const { courseItems } = this.state;
    return <PlayList
                courseItems={courseItems}
                courseId={courseId}
                currentUser={this.props.currentUser}/>
  }

  handleClick = (e, course) => {
    e.preventDefault()
    //console.log(course)
    /* Look at here, you can add it here */
    this.props.history.push('/dashboard',{ course: course, currentUser:this.props.currentUser });
  }

  render() {
    let course = this.props.data;
    const { courseItems } = this.state;
    return (
    <div className="wrapper">
    		{/* <div className="card radius shadowDepth1" onClick={() => this.loadCourseItems(course.id)}> */}
    		<div className="card radius shadowDepth1" onClick={(e) => this.handleClick(e,course)}>
    			<div className="card__image border-tlr-radius">
    				<img src={course.imageUrl} alt="image" className="border-tlr-radius" />
          </div>

    			<div className="card__content card__padding">

    				<article className="card__article">
	    				<h4 title={course.title}>{course.title.length > 55 ? course.title.substring(0,53)+'...':course.title}</h4>
	    				<p>{course.subtitle}</p>
	    			</article>
    			</div>

    			<div className="card__action">

    				<div className="card__author">
    					<img src={course.authorImageUrl} alt="user" />
    					<div className="card__author-content">
    						By <a title={course.author} href="#">{course.author.length>18?course.author.substring(0,15)+'...':course.author}</a>
    					</div>
    				</div>
    			</div>
    		</div>
    	{courseItems.length>0?this.showCourseItems(course.id):null}
      </div>
    );
  }
}

export default withHttpInterceptor(withRouter(Course));
