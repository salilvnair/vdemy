import React from 'react';
import withHttpInterceptor from '../../components/hoc/auth/auth.hoc';
import Player from '../../components/player/player.component';

class Home extends React.Component {

    state = {
        url: ''
    }

    showAllCourses = () => {
        this.props.get('https://www.udemy.com/api-2.0/users/me/subscribed-courses?num_collections&page_size=50')
        .subscribe(resp => {
            console.log(resp);
        });
    }

    loadCourseItems(courseId) {
        let endpointURL = "https://www.udemy.com/api-2.0"+
          `/courses/${courseId}/cached-subscriber-curriculum-items?page_size=100000`;
        return this.props.get(endpointURL).subscribe(resp => {
            console.log(resp);
        });
    }

    loadLectureItems(courseId, chapterId) {
        let endpointURL = "https://www.udemy.com/api-2.0"+
        `/users/me/subscribed-courses/${courseId}/lectures/${chapterId}?fields[asset]=stream_urls,download_urls,title,filename,data`;
        return this.props.get(endpointURL).subscribe(resp => {
            console.log(resp);
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
                <input type="button" value="LoadCourseData" onClick={() => this.loadCourseItems(1302770)}/>
                <input type="button" value="LoadLectureData" onClick={() => this.loadLectureItems(1302770, 8870434)}/>
                {
                    url !=='' ? <Player src={url} /> : null
                }
            </div>
        );
    }

}

let currentUser = {
    token : localStorage.getItem('token')
}

export default withHttpInterceptor(currentUser)(Home);
