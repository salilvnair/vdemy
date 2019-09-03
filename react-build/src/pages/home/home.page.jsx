import React from 'react';
import withHttpInterceptor from '../../components/hoc/auth/auth.hoc';
import Player from '../../components/player/player.component';
class Home extends React.Component {

    state = {
        url: '',
        size: 0
    }

    showAllCourses = () => {
        // this.props.get('https://www.udemy.com/api-2.0/users/me/subscribed-courses?num_collections&page_size=50')
        this.props.get('https://www.udemy.com/api-2.0/users/me/subscribed-courses-collections/?collection_has_courses=True&course_limit=9&fields[course]=@min,visible_instructors,image_240x135,image_480x270,favorite_time,archive_time,is_practice_test_course,completion_ratio,last_accessed_time,enrollment_time,features,published_title&fields[user_has_subscribed_courses_collection]=@all&page=1&page_size=8')
        .subscribe(resp => {
            console.log(resp);
        });
    }

    loadCourseItems(courseId) {
        let endpointURL = "https://www.udemy.com/api-2.0"+
          `/courses/${courseId}/cached-subscriber-curriculum-items?page_size=100000`;
        return this.props.get(endpointURL).subscribe(resp => {
            console.log(this.props.currentUser,resp);
        });
    }

    loadLectureItems(courseId, chapterId) {
        let endpointURL = "https://www.udemy.com/api-2.0"+
        `/users/me/subscribed-courses/${courseId}/lectures/${chapterId}?fields[asset]=stream_urls,download_urls,title,filename,data`;
        return this.props.get(endpointURL).subscribe(resp => {
            resp.data.asset.stream_urls.Video.forEach(url=>{
                if(url.label=== "720" && url.type === "video/mp4"){
                    this.setState({url:url.file})
                }
            })

        });
    }

    render() {
        const { url }  = this.state;
        return (
            <div>
                <h1>HomePage</h1>
                <input type="button" value="LoadCourses" onClick={this.showAllCourses}/>
                <input type="button" value="LoadCourseData" onClick={() => this.loadCourseItems(2365628)}/>
                <input type="button" value="LoadLectureData" onClick={() => this.loadLectureItems(2365628, 14754858)}/>
                {
                    url !=='' ? <Player src={url} /> : null
                }
            </div>
        );
    }

}

let currentUser = {
    token : 'YDttwRN1kV0lYdVOvXaASwaYDqu7nDQ8DT57IUBE'
}

export default withHttpInterceptor(Home);
