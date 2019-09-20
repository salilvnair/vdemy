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
    showNextInfo: false
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
    this.setState({currentCourselectures:lectures, lectureIndexData:lectureIndexData});
  }

  componentDidMount() {
    this.prepareCourseLectures();
  }

  activateItem(event, lectureId, itemIndex, playlistData) {
    let divElem = event.target;
    const { lectureIndexData, playlist } = this.state;
    console.log('activate',lectureIndexData.indexOf(lectureId));
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
    console.log(this.state);
  }

  preparePlayListLectureRelationalMap(playlistData) {
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
    this.setState({relationalData:relationalData});
  }

  expandPanel(lectureId) {
    debugger;
    const { relationalData } = this.state;
    let filteredLecture = relationalData.filter(data => data.lectureId === lectureId);
    if(filteredLecture.length>0) {
      let expansionPanelButton = this.expansionPanelRefs[filteredLecture[0].playListIndex];
      if(!expansionPanelButton.classList.contains('active')) {
        this.expansionPanelRefs[filteredLecture[0].playListIndex].click();
      }
    }
  }

  playPrevious() {
    debugger;
    const { currentlyPlayingIndex, currentCourselectures } = this.state;
    console.log(this.state)
    if(currentlyPlayingIndex !== 0) {
      var prevIndex = currentlyPlayingIndex - 1;
      var lectureId = currentCourselectures[prevIndex].id;
      this.applyItemHighlight(this.highlightedRefs[prevIndex]);
      this.loadLectureItems(lectureId);
      this.setState({currentlyPlayingIndex:prevIndex});
    }
  }

  playNext() {
    const { currentlyPlayingIndex, currentCourselectures } = this.state;
    if(currentlyPlayingIndex !== currentCourselectures.length-1) {
      var nextIndex = currentlyPlayingIndex + 1;
      var lectureId = currentCourselectures[nextIndex].id;
      this.expandPanel(lectureId);
      this.applyItemHighlight(this.highlightedRefs[nextIndex]);
      this.loadLectureItems(lectureId);
      this.setState({currentlyPlayingIndex:nextIndex});
    }
  }

  handleVideoEnded() {
    this.playNext();
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

  render() {
    const { url, htmlString, isCollapsed, showPrevInfo, showNextInfo } = this.state;
    return (
      <div className="playlist-container">
        <div className={`side-bar`}>
          <div className={`playlist ${isCollapsed?'collapse':'expand'}`}>
            <div style={{display:'flex', justifyContent:'flex-end'}}>
              <Button color="warn" type="raised" onClick={()=> this.collapsePlayList()}>X</Button>
            </div>
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
                                  <Checkbox color="primary" onChange={(e) =>this.triggerComplete(e,lecture.id)} />
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
          {
            isCollapsed?
            <div className="collapse-btn">
              <Button onClick={()=> this.collapsePlayList()}>{"====>"}</Button>
            </div>
            :
            null
          }
        </div>
        <div className="nxt-prev-btn-container">
          <div className="nxt-prev-container">
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
          </div>
          <div className="nxt-prev-container">
            <div className={`nxt-prev-info nxt-info ${showNextInfo?'show-info':''}`}>
              <span>{this.nextInfoTitle}</span>
            </div>
            <div
              onMouseEnter={() => this.showInfoHover('N')}
              onMouseLeave={() => this.hideInfoHover('N')}
              className="nxt-prev-btn"
              onClick={()=> this.playNext()}>
              <Icon style={{fontSize: '1.6em'}} provider="semantic" name="chevron right icon"/>
            </div>
          </div>
        </div>
        {
          url !==''?
          <Player src={url} ended={() => this.handleVideoEnded()} />
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
