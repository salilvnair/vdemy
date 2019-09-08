import React from 'react';
import withHttpInterceptor from '../hoc/auth/auth.hoc';
import './course.component.scss';
import PlayList from '../playlist/playlist.component';

class Course extends React.Component {
  state = {
    courseItems: []
  }

  loadCourseItems(courseId) {
    let endpointURL = "https://www.udemy.com/api-2.0"+
      `/courses/${courseId}/cached-subscriber-curriculum-items?page_size=100000`;
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
        console.log(courseItems);
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

  render() {
    let course = this.props.data;
    const { courseItems } = this.state;
    return (
    <div class="wrapper">
    		<div class="card radius shadowDepth1" onClick={() => this.loadCourseItems(course.id)}>
    			<div class="card__image border-tlr-radius">
    				<img src={course.imageUrl} alt="image" class="border-tlr-radius" />
          </div>

    			<div class="card__content card__padding">


    				<div class="card__meta">
    					<a href="#">{course.id}</a>
                        <time>{course.lastAccessed}</time>
    				</div>

    				<article class="card__article">
	    				<h2>{course.title}</h2>

	    				<p>{course.subtitle}</p>
	    			</article>
    			</div>

    			<div class="card__action">

    				<div class="card__author">
    					<img src={course.authorImageUrl} alt="user" />
    					<div class="card__author-content">
    						By <a href="#">{course.author}</a>
    					</div>
    				</div>
    			</div>
    		</div>
    	{courseItems.length>0?this.showCourseItems(course.id):null}
      </div>
    );
  }
}

export default withHttpInterceptor(Course);
