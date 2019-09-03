import React from 'react';

import './course.component.scss';

class Course extends React.Component {
  render() {
    let course = this.props.data;
    return (
  <div class="wrapper">
    		<div class="card radius shadowDepth1">
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
    	</div>
    );
  }
}

export default Course;
