import React from 'react'
import Player from '../../components/player/player.component';
import withHttpInterceptor from '../hoc/auth/auth.hoc';
import './playlist.component.scss';
import { ExpansionPanel, Checkbox, Icon, Button } from '@salilvnair/react-ui';
class PlayList extends React.Component {
  state = {
    url: '',
    hideList: false,
    isCollapsed:false,
    currentCourselectures: [],
    currentlyPlayingIndex: 0
  }

  highlightedRefs = [];

  setHighlightedRef = (ref) => {
    this.highlightedRefs.push(ref);
  };

  // TODO need to trigger course completed api
  // https://www.udemy.com/api-2.0/users/me/subscribed-courses/${courseId}/completed-lectures/
  // request body {"lecture_id":12835806,"downloaded":false}

  // for resetting as not completed need to trigger below api with request type as DELETE
  //https://www.udemy.com/api-2.0/users/me/subscribed-courses/${courseId}/completed-lectures/12835806

  loadLectureItems(lectureId) {
    let endpointURL = "https://www.udemy.com/api-2.0"+
    `/users/me/subscribed-courses/${this.props.courseId}/lectures/${lectureId}?fields[asset]=stream_urls,download_urls,title,filename,data`;
    return this.props.get(endpointURL).subscribe(resp => {
      console.log(resp)
      if(resp.data.asset && resp.data.asset.stream_urls) {
        resp.data.asset.stream_urls.Video.forEach(url=>{
          if(url.label=== "720" && url.type === "video/mp4"){
              this.setState({url:url.file, hideList:true})
          }
        })
      }
    });
  }

  activateItem(event, lectureId, index, lectures) {
    console.log(this.highlightedRefs);
    let divElem = event.target;
    const { currentCourselectures } = this.state;
    if(currentCourselectures.length > 0) {
      this.setState({currentlyPlayingIndex:index});
    }
    else {
      this.setState({currentCourselectures:lectures, currentlyPlayingIndex:index});
    }
    this.applyItemHighlight(divElem);
    this.loadLectureItems(lectureId);
  }

  playPrevious() {
    const { currentlyPlayingIndex, currentCourselectures } = this.state;
    if(currentlyPlayingIndex!=0) {
      var prevIndex = currentlyPlayingIndex - 1;
      var lectureId = currentCourselectures[prevIndex].id;
      this.applyItemHighlight(this.highlightedRefs[prevIndex]);
      this.loadLectureItems(lectureId);
      this.setState({currentlyPlayingIndex:prevIndex});
    }
  }

  playNext() {
    const { currentlyPlayingIndex, currentCourselectures } = this.state;
    if(currentlyPlayingIndex!= currentCourselectures.length-1) {
      var nextIndex = currentlyPlayingIndex + 1;
      var lectureId = currentCourselectures[nextIndex].id;
      this.applyItemHighlight(this.highlightedRefs[nextIndex]);
      this.loadLectureItems(lectureId);
      this.setState({currentlyPlayingIndex:nextIndex});
    }
  }

  triggerComplete(e, lectureId) {
    e.stopPropagation();
    console.log(e.target.checked,'going to mark lecture '+ lectureId+ ' as complete')
  }

  applyItemHighlight(divElem) {
      if(divElem.classList && divElem.classList.contains('playlist-content')) {
          document.querySelectorAll('.playlist-content').forEach(item =>{
              item.classList.remove('highlight-item');
          })
          divElem.classList.add('highlight-item');
          divElem.scrollIntoView();
      }
      else {
          this.applyItemHighlight(divElem.parentNode);
      }
  }

  stopPlaying() {
    this.setState({url:'', hideList:false})
  }

  collapsePlayList() {
    const { isCollapsed } = this.state;
    let collapsed = !isCollapsed;
    this.setState({isCollapsed:collapsed});
  }

  render() {
    const { url } = this.state;
    const { isCollapsed } = this.state;
    return (
      <div className="playlist-container">
        <div className={`side-bar`}>
          <div className={`playlist ${isCollapsed?'collapse':'expand'}`}>
            <div style={{display:'flex', justifyContent:'flex-end'}}>
              <Button color="warn" type="raised" onClick={()=> this.collapsePlayList()}>X</Button>
            </div>
          {
            this.props.courseItems.map(item => {
             return (
               <>
              <ExpansionPanel header={item.chapterTitle} key={item.id}>
                {
                  item.lectures.map((lecture, index, lectures) => {
                    let remainingTime = Math.floor(lecture.time_estimation/60);
                    return (
                      <div
                      key={lecture.id} className="playlist-content"
                      ref={this.setHighlightedRef} >
                          <div className= "playlist-item">
                              <div style={{marginTop:'7px'}}>
                                  <Checkbox color="primary" onChange={(e) =>this.triggerComplete(e,lecture.id)} />
                              </div>
                              <div style={{display:'flex', flexDirection:'column',marginTop:'7px'}} onClick={(e) => this.activateItem(e,lecture.id, index, lectures)}>
                                  <div className="info">
                                      <p style={{margin:'0px'}}>{lecture.title}</p>
                                  </div>
                                  <div style={{display:'flex'}}>
                                      <Icon style={{marginTop:'-2px'}}>play_circle_outline</Icon><p style={{margin:'0px'}}>{remainingTime}min</p>
                                  </div>
                                </div>
                          </div>
                      </div>
                    );
                  })
                }
              </ExpansionPanel>
              </>
             );
            })
          }
          </div>
          {
            isCollapsed?
            <div className="collapse-btn">
              <Button onClick={()=> this.collapsePlayList()}>Expand</Button>
              <Button onClick={()=> this.playPrevious()}>Prev</Button>
            </div>
            :
            null
          }
        </div>
        <div className="side-bar-r">
        <Button onClick={()=> this.playNext()}>Next</Button>
        </div>
        {
          url !==''?
          <Player src={url} />
          : null
        }
      </div>
    );
  }

}

export default withHttpInterceptor(PlayList);
