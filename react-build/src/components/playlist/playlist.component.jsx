import React from 'react'
import Player from '../../components/player/player.component';
import withHttpInterceptor from '../hoc/auth/auth.hoc';
import './playlist.component.scss';
import { ExpansionPanel, Checkbox, Icon, Button } from '@salilvnair/react-ui';
class PlayList extends React.Component {
  state = {
    url: '',
    htmlString: '',
    hideList: false,
    isCollapsed:false,
    currentCourselectures: [],
    currentlyPlayingIndex: 0,
    currentPlaylistIndex: 0,
    playlist: [],
    relationalData: [],
    lectureIndexData: [],
    showPrevInfo: false,
    showNextInfo: false,
    playbackSpeed: "1",
    completedLectureIds: []
  }

  highlightedRefs = [];
  expansionPanelRefs = [];
  prevInfoTitle = '';
  nextInfoTitle = '';


  setHighlightedRef = (ref) => {
    this.highlightedRefs.push(ref);
  };

  setExpansionPanelRef = (ref) => {
    this.expansionPanelRefs.push(ref);
  };

  // TODO need to trigger course completed api
  // https://www.udemy.com/api-2.0/users/me/subscribed-courses/${courseId}/completed-lectures/
  // request body {"lecture_id":12835806,"downloaded":false}

  // for resetting as not completed need to trigger below api with request type as DELETE
  //https://www.udemy.com/api-2.0/users/me/subscribed-courses/${courseId}/completed-lectures/12835806

  // completed_lecture_ids for the course
  // https://www.udemy.com/api-2.0/users/me/subscribed-courses/{courseId}/progress?fields[course]=completed_lecture_ids,completed_quiz_ids,last_seen_page,completed_assignment_ids

  // set progress-logs i.e. last accessed video
  // body [{"total":0,"position":0,"openPanel":"default","isFullscreen":false,"context":{"type":"Lecture"}}]
  //https://www.udemy.com/api-2.0/users/me/subscribed-courses/{courseId}/lectures/${lectureId}/progress-logs


  loadLectureItems(lectureId) {
    let endpointURL = "https://www.udemy.com/api-2.0"+
    `/users/me/subscribed-courses/${this.props.courseId}/lectures/${lectureId}?fields[asset]=stream_urls,download_urls,title,filename,data`;

    return this.props.get(endpointURL).subscribe(resp => {
      console.log(resp)
      if(resp.data.asset) {
        if(resp.data.asset.stream_urls) {
          resp.data.asset.stream_urls.Video.forEach(url=>{
            if(url.label=== "720" && url.type === "video/mp4"){
                this.setState({url:url.file, hideList:true})
            }
          })
        }
        else {
          if(resp.data.asset.data && resp.data.asset.data.body) {
            this.setState({htmlString: resp.data.asset.data.body, url:''})
          }
        }
      }
    });

  }

  prepareCourseLectures() {
    let lectures = [];
    let lectureIndexData = [];
    this.props.courseItems.forEach(course => {
      course.lectures.forEach(lecture => {
        lectures.push(lecture);
        lectureIndexData.push(lecture.id);
      })
    })
    let completedLectureIds = this.props.completedLectureIds;
    this.setState(
      {
        currentCourselectures:lectures,
        lectureIndexData:lectureIndexData,
        completedLectureIds:completedLectureIds
      }
    );
    this.initPlay(lectures, lectureIndexData);
  }

  componentDidMount() {
    this.prepareCourseLectures();
  }

  updateProgressLog(lectureId) {
    let endpointURL = `https://www.udemy.com/api-2.0/users/me/subscribed-courses/${this.props.courseId}/lectures/${lectureId}/progress-logs`;
    let progressLogData = [];
    let progressLog = {
      total:0,
      position:0,
      openPanel: "default",
      isFullscreen: false,
      context: {
        type: "Lecture"
      }
    }
    progressLogData.push(progressLog);
    this.props.post(endpointURL, progressLogData).subscribe(resp => {
      console.log(resp,'progress log')
    })
  }

  activateItem(event, lectureId, itemIndex, playlistData) {
    let divElem = event.target;
    const { lectureIndexData, playlist } = this.state;
    this.setState({currentlyPlayingIndex:lectureIndexData.indexOf(lectureId)})
    if(playlist.length > 0) {
      this.setState({currentPlaylistIndex:itemIndex});
    }
    else {
      this.setState({playlist:playlistData, currentPlaylistIndex:itemIndex});
      this.preparePlayListLectureRelationalMap(playlistData);
    }
    this.applyItemHighlight(divElem);
    this.loadLectureItems(lectureId);
    this.updateProgressLog(lectureId);
  }

  getPlaylistRelationalData(playlistData) {
    let relationalData = [];
    playlistData.forEach((item, index) => {
      item.lectures.forEach(lecture => {
        let relationalMap = {};
        relationalMap.playListIndex = index;
        relationalMap.playListId = item.id;
        relationalMap.lectureId = lecture.id;
        relationalData.push(relationalMap);
      })
    })
    return relationalData;
  }

  preparePlayListLectureRelationalMap(playlistData) {
    let relationalData = this.getPlaylistRelationalData(playlistData);
    this.setState({relationalData:relationalData});
  }

  expandPanel(lectureId) {
    let { relationalData } = this.state;
    if(relationalData.length === 0) {
      let playlistData = this.props.courseItems;
      relationalData = this.getPlaylistRelationalData(playlistData);
    }
    let filteredLecture = relationalData.filter(data => data.lectureId === lectureId);
    if(filteredLecture.length>0) {
      let expansionPanelButton = this.expansionPanelRefs[filteredLecture[0].playListIndex];
      if(!expansionPanelButton.classList.contains('active')) {
        this.expansionPanelRefs[filteredLecture[0].playListIndex].click();
      }
    }
  }

  initPlay(currentCourselectures,  lectureIndexData) {
    this.loadLastVisitedLecture(currentCourselectures, lectureIndexData);
  }

  loadLastVisitedLecture( currentCourselectures, lectureIndexData) {
    let endpointURL = `https://www.udemy.com/course-dashboard-redirect/?course_id=${this.props.courseId}`;
    this.props.get(endpointURL).subscribe(resp => {
        let lectureId = currentCourselectures[0].id;
        let lectureIndex = 0;
        if(resp.request && resp.request.responseURL) {
          let lastVisitedLectureIdURLString = resp.request.responseURL.match(/([^\/]*)\/*$/)[1];
          lastVisitedLectureIdURLString = lastVisitedLectureIdURLString.split("?");
          lectureId = +lastVisitedLectureIdURLString[0];

          lectureIndex = lectureIndexData.indexOf(lectureId);
        }
        this.applyItemHighlight(this.highlightedRefs[lectureIndex]);
        this.loadLectureItems(lectureId);
        this.expandPanel(lectureId);
        this.setState({currentlyPlayingIndex:lectureIndex});
    })
  }

  playPrevious() {
    const { currentlyPlayingIndex, currentCourselectures } = this.state;
    if(currentlyPlayingIndex !== 0) {
      var prevIndex = currentlyPlayingIndex - 1;
      var lectureId = currentCourselectures[prevIndex].id;
      this.expandPanel(lectureId);
      this.applyItemHighlight(this.highlightedRefs[prevIndex]);
      this.loadLectureItems(lectureId);
      this.setState({currentlyPlayingIndex:prevIndex});
      this.hideInfoHover("P");
    }
  }

  playNext(autoPlay) {
    const { currentlyPlayingIndex, currentCourselectures } = this.state;
    if(currentlyPlayingIndex !== currentCourselectures.length-1) {
      var nextIndex = currentlyPlayingIndex + 1;
      var lectureId = currentCourselectures[nextIndex].id;
      this.expandPanel(lectureId);
      this.applyItemHighlight(this.highlightedRefs[nextIndex]);
      this.loadLectureItems(lectureId);
      this.setState({currentlyPlayingIndex:nextIndex});
      this.hideInfoHover("N");
      if(autoPlay) {
        this.markCourse(lectureId, true);
        this.updateProgressLog(lectureId);
      }
    }
  }

  markCourse(lectureId, completed) {
      let endpointURL = `https://www.udemy.com/api-2.0/users/me/subscribed-courses/${this.props.courseId}/completed-lectures/`

    if(completed) {
      //{"lecture_id":12835806,"downloaded":false}
      let requestBody = {
        lecture_id: lectureId,
        downloaded: false
      }
      this.props.post(endpointURL, requestBody).subscribe(resp => {
        console.log(resp,'marked completed')
      })
    }
    else {
      endpointURL = endpointURL + lectureId;
      this.props.delete(endpointURL).subscribe(resp => {
        console.log(resp,'unmarked completed')
      })
    }
  }

  handleVideoEnded() {
    this.playNext(true);
  }

  playBackSpeedChanged(rate) {
    console.log('changing the parent rate',rate)
    this.setState({playbackSpeed:rate})
  }

  triggerComplete(e, lectureId) {
    e.stopPropagation();
    console.log(e.target.checked,'goin to mark lecture '+ lectureId+ ' as complete')
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

  showInfoHover = (nextOrPrev) => {
    this.getNxtPrevInfoTitle(nextOrPrev);
    if(nextOrPrev==='N') {
      this.setState({showNextInfo:true});
    }
    else {
      this.setState({showPrevInfo:true});
    }
  }

  hideInfoHover = (nextOrPrev) => {
    if(nextOrPrev==='N') {
      this.setState({showNextInfo:false});
    }
    else {
      this.setState({showPrevInfo:false});
    }
  }

  getNxtPrevInfoTitle = (nextOrPrev) => {
    const { currentlyPlayingIndex, currentCourselectures } = this.state;
    var index = 0;
    if(nextOrPrev==='N') {
      if(currentlyPlayingIndex !== currentCourselectures.length-1) {
        index = currentlyPlayingIndex + 1;
        this.nextInfoTitle = currentCourselectures[index].title;
      }
    }
    else {
      if(currentlyPlayingIndex !== 0) {
        index = currentlyPlayingIndex - 1;
        this.prevInfoTitle = currentCourselectures[index].title;
      }
    }
  }

  collapsePlayList() {
    const { isCollapsed } = this.state;
    let collapsed = !isCollapsed;
    this.setState({isCollapsed:collapsed});
  }

  loadLectureCompleteness = (lectureId) => {
    const { completedLectureIds } = this.state;
    if(completedLectureIds.indexOf(lectureId) > -1) {
      return true;
    }
    return false;
  }

  render() {
    const { url,
            htmlString,
            isCollapsed,
            showPrevInfo,
            showNextInfo,
            currentlyPlayingIndex,
            currentCourselectures,
            playbackSpeed
          } = this.state;
    let hasPrev = currentlyPlayingIndex !== 0;
    let hasNext = currentlyPlayingIndex !== currentCourselectures.length-1;

    return (
      <div className="playlist-container">
        <div className={`side-bar`}>
          <div className={`playlist ${isCollapsed?'collapse':'expand'}`}>
          {
            this.props.courseItems.map((item, itemIndex, playlist) => {
             return (
               <>
              <ExpansionPanel
                setRef={this.setExpansionPanelRef}
                header={item.chapterTitle}
                key={item.id}>
                {
                  item.lectures.map(lecture => {
                    let remainingTime = Math.ceil(lecture.time_estimation/60);
                    return (
                      <div
                        key={lecture.id} className="playlist-content"
                        ref={this.setHighlightedRef} >
                          <div className= "playlist-item">
                              <div style={{marginTop:'7px'}}>
                                  <Checkbox
                                      color="primary"
                                      checked={this.loadLectureCompleteness(lecture.id)}
                                      onChange={(e) =>this.triggerComplete(e,lecture.id)} />
                              </div>
                              <div style={{display:'flex', flexDirection:'column',marginTop:'7px'}} onClick={(e) => this.activateItem(e,lecture.id, itemIndex, playlist)}>
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
        </div>
        <div>
        {
            isCollapsed?
            <div
              className="course-content-btn"
              onClick={()=> this.collapsePlayList()}>
                <span className="course-content-btn-info">Course Content</span>
              <Icon
                style={{fontSize: '1.6em'}}
                provider="semantic"
                name="arrow right icon"/>
            </div>
            :
            <div
              className="course-content-btn collapse-btn"
              onClick={()=> this.collapsePlayList()}>
              <Icon
                style={{fontSize: '1.6em'}}
                provider="semantic"
                name="arrow left icon"/>
            </div>
          }
        </div>
        <div className="nxt-prev-btn-container">
          <div className="nxt-prev-container">
            {
              hasPrev ?
                <>
                  <div
                    onMouseEnter={() => this.showInfoHover('P')}
                    onMouseLeave={() => this.hideInfoHover('P')}
                    className="nxt-prev-btn"
                    onClick={()=> this.playPrevious()}>
                    <Icon style={{fontSize: '1.6em'}} provider="semantic" name="chevron left icon"/>
                  </div>
                  <div className={`nxt-prev-info prev-info ${showPrevInfo? 'show-info':''}`}>
                    <span>{this.prevInfoTitle}</span>
                  </div>
                </>
              : null
            }
          </div>
          <div className="nxt-prev-container">
            {
              hasNext ?
                <>
                  <div className={`nxt-prev-info nxt-info ${showNextInfo?'show-info':''}`}>
                    <span>{this.nextInfoTitle}</span>
                  </div>
                  <div
                    onMouseEnter={() => this.showInfoHover('N')}
                    onMouseLeave={() => this.hideInfoHover('N')}
                    className="nxt-prev-btn"
                    onClick={()=> this.playNext(false)}>
                    <Icon style={{fontSize: '1.6em'}} provider="semantic" name="chevron right icon"/>
                  </div>
                </>
              : null
            }
          </div>
        </div>
        {
          url !==''?
          <Player
              src={url}
              playbackSpeed = {playbackSpeed}
              playBackSpeedChanged = { (rate) => this.playBackSpeedChanged(rate) }
              ended={() => this.handleVideoEnded()} />
          :
          <div className="course-lecture-container">
              <div className="course-lecture-html"
                dangerouslySetInnerHTML={{ __html: htmlString }} />
          </div>
        }
      </div>
    );
  }

}

export default withHttpInterceptor(PlayList);
