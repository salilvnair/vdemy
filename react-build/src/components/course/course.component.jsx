import React from 'react';
import { withRouter } from 'react-router-dom';
import './course.component.scss';

class Course extends React.Component {
  state = {
    courseItems: []
  }

  handleClick = (e, course) => {
    e.preventDefault()
    this.props.history.push('/course',{ course: course, currentUser:this.props.currentUser });
  }

  render() {
    let course = this.props.data;
    return (
    <div className="wrapper" title={this.props.currentUser.email}>
    		<div className="card radius shadowDepth1" onClick={(e) => this.handleClick(e,course)}>
    			<div className="card__image border-tlr-radius">
    				<img src={course.imageUrl} alt="" className="border-tlr-radius" />
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
    						<span title={course.author}>
                      {course.author.length>18?course.author.substring(0,15)+'...':course.author}
                </span>
    					</div>
    				</div>
    			</div>
          <div id="progressbar">
            <div style={{width:course.completionRatio+"%"}}></div>
            <span>{course.completionRatio}%</span>
          </div>
    		</div>
      </div>
    );
  }
}

export default withRouter(Course);
