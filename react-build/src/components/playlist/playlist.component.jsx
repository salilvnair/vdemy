import React from 'react'
import Player from '../../components/player/player.component';
import './playlist.component.scss';
import { ExpansionPanel, Checkbox, Icon, Button } from '@salilvnair/react-ui';
import { UdemyApiService } from '../../api/service/udemy-api.service';
class PlayList extends React.Component {
  state = {
    url: '',
    htmlString: '',
    hideList: false,
    isCollapsed:false,
    currentCourselectures: [],
    currentlyPlayingIndex: 0,
    currentPlaylistIndex: 0,
    currentlyPlayingLectureId: null,
    lastPlayedLectureId: null,
    playlist: [],
    relationalData: [],
    lectureIndexData: [],
    showPrevInfo: false,
    showNextInfo: false,
    showCurrentInfo:false,
    playbackSpeed: "1",
    completedLectureIds: []
  }

  highlightedRefs = [];
  expansionPanelRefs = [];
  completionCheckboxRefs = [];
  prevInfoTitle = '';
  nextInfoTitle = '';
  currentlyPlayingTitle = '';
  courseContentContainerRef = React.createRef();
  nxtPrevContainerRef = React.createRef();

  setHighlightedRef = (ref) => {
    this.highlightedRefs.push(ref);
  };

  setExpansionPanelRef = (ref) => {
    this.expansionPanelRefs.push(ref);
  };

  setCompletionCheckboxRef = (ref) => {
    this.completionCheckboxRefs.push(ref);
  };

  loadLectureItems(lectureId) {
    const { lectureIndexData, currentCourselectures } = this.state;
    let currentIndex = lectureIndexData.indexOf(lectureId);
    console.log('j',lectureId)
    console.log(currentIndex);
    if(currentIndex > -1) {

      this.currentlyPlayingTitle = currentCourselectures[currentIndex].title;
      console.log(this.currentlyPlayingTitle)
      this.setState({showCurrentInfo:true})
    }
    this.setState({currentlyPlayingLectureId:lectureId});
    this.udemyApiService
    .loadLectureItems(this.props.courseId, lectureId)
    .subscribe(resp => {
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

  fadePlaylistControls = (fade) => {
    if(fade) {
      this.courseContentContainerRef.current.style.cursor= 'none';
      this.courseContentContainerRef.current.classList.add('fadeout__controls');
      this.nxtPrevContainerRef.current.style.cursor= 'none';
      this.nxtPrevContainerRef.current.classList.add('fadeout__controls');
    }
    else {
      this.courseContentContainerRef.current.style.cursor= 'default';
      this.courseContentContainerRef.current.classList.remove('fadeout__controls');
      this.nxtPrevContainerRef.current.style.cursor= 'default';
      this.nxtPrevContainerRef.current.classList.remove('fadeout__controls');
    }
  }

  componentDidMount() {
    this.udemyApiService = new UdemyApiService(this.props);
    this.prepareCourseLectures();
  }

  updateProgressLog(lectureId) {
    this.udemyApiService
        .updateProgressLog(this.props.courseId, lectureId)
        .subscribe();
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

  expandPanel(lectureId, lastPlayedLectureId) {
    let { relationalData } = this.state;
    if(relationalData.length === 0) {
      let playlistData = this.props.courseItems;
      relationalData = this.getPlaylistRelationalData(playlistData);
    }
    //collapse last played lecture panel
    let filteredLecture = [];
    if(lastPlayedLectureId) {
      filteredLecture = relationalData.filter(data => data.lectureId === lastPlayedLectureId);
      if(filteredLecture.length>0) {
        let expansionPanelButton = this.expansionPanelRefs[filteredLecture[0].playListIndex];
        if(expansionPanelButton.classList.contains('active')) {
          this.expansionPanelRefs[filteredLecture[0].playListIndex].click();
        }
      }
    }

    //expand playing lecture
    filteredLecture = relationalData.filter(data => data.lectureId === lectureId);
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
    this.udemyApiService
    .loadLastVisitedLecture(this.props.courseId)
    .subscribe(resp => {
        let lectureId = currentCourselectures[0].id;
        let lectureIndex = 0;
        if(resp.request && resp.request.responseURL) {
          let lastVisitedLectureIdURLString = resp.request.responseURL.match(/([^/]*)\/*$/)[1];
          lastVisitedLectureIdURLString = lastVisitedLectureIdURLString.split("?");
          let webLectureId = +lastVisitedLectureIdURLString[0];

          lectureIndex = lectureIndexData.indexOf(webLectureId);
          if(lectureIndex > -1) {
            lectureId = webLectureId;
          }
          else {
                lectureIndex = 0;
          }
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
    const { currentlyPlayingIndex, currentCourselectures, currentlyPlayingLectureId } = this.state;
    if(currentlyPlayingIndex !== currentCourselectures.length-1) {
      this.setState({lastPlayedLectureId:currentlyPlayingLectureId});
      var nextIndex = currentlyPlayingIndex + 1;
      var lectureId = currentCourselectures[nextIndex].id;
      this.expandPanel(lectureId, currentlyPlayingLectureId);
      this.applyItemHighlight(this.highlightedRefs[nextIndex]);
      this.loadLectureItems(lectureId);
      this.setState({currentlyPlayingIndex:nextIndex});
      this.hideInfoHover("N");
      if(autoPlay) {
        this.markCourse(currentlyPlayingLectureId, true);
        this.updateProgressLog(lectureId);
        this.markCompletionCheckbox(currentlyPlayingLectureId);
      }
    }
  }

  markCompletionCheckbox(lectureId) {
    const { completedLectureIds } = this.state;
    completedLectureIds.push(lectureId);
    this.setState({completedLectureIds:completedLectureIds});
  }

  markCourse(lectureId, completed) {
    this.udemyApiService.markCourse(this.props.courseId, lectureId, completed);
  }

  handleVideoEnded() {
    this.playNext(true);
  }

  playBackSpeedChanged(rate) {
    this.setState({playbackSpeed:rate})
  }

  triggerComplete(e, lectureId) {
    e.stopPropagation();
    this.markCompletionCheckbox(lectureId);
    this.markCourse(lectureId, e.target.checked);
  }

  applyItemHighlight(divElem) {
      if(divElem){
        if(divElem.classList && divElem.classList.contains('playlist-content')) {
          document.querySelectorAll('.playlist-content').forEach(item =>{
              item.classList.remove('highlight-item');//
          })
          divElem.classList.add('highlight-item');
          divElem.scrollIntoView();
        }
        else {
            this.applyItemHighlight(divElem.parentNode);
        }
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
        if(index!==currentCourselectures.length-1) {
          this.nextInfoTitle = currentCourselectures[index].title;
        }
      }
    }
    else {
      if(currentlyPlayingIndex !== 0) {
        index = currentlyPlayingIndex - 1;
        console.log(index);
        if(index > -1) {
          this.prevInfoTitle = currentCourselectures[index].title;
        }
      }
    }
  }

  collapsePlayList() {
    const { isCollapsed, currentlyPlayingLectureId } = this.state;
    let collapsed = !isCollapsed;
    if(!isCollapsed) {
      this.expandPanel(currentlyPlayingLectureId);
    }
    this.setState({isCollapsed:collapsed});
  }

  loadLectureCompleteness = (lectureId) => {
    const { completedLectureIds } = this.state;
    if(completedLectureIds.indexOf(lectureId) > -1) {
      return true;
    }
    return false;
  }

  lectureTypeInfoIcon = (remainingTime, type) => {
    return (
      <>
      {
        type === 'Video'?
          <>
          <Icon size="20" style={{marginTop:'-2px', color: 'grey'}}>play_circle_outline</Icon><p style={{margin:'0px'}}>{remainingTime}min</p>
          </>
        :
        <>
          <Icon size="20" style={{marginTop:'-2px', color: 'grey'}}>insert_drive_file</Icon><p style={{margin:'0px'}}>{remainingTime}min</p>
        </>
      }

      </>
    );
  }

  render() {
    const { url,
            htmlString,
            isCollapsed,
            showPrevInfo,
            showNextInfo,
            currentlyPlayingIndex,
            currentCourselectures,
            playbackSpeed,
            showCurrentInfo
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
               <React.Fragment key={item.id}>
                <ExpansionPanel
                  setRef={this.setExpansionPanelRef}
                  header={item.chapterTitle}>
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
                                        ref={this.setCompletionCheckboxRef}
                                        color="primary"
                                        checked={this.loadLectureCompleteness(lecture.id)}
                                        onChange={(e) =>this.triggerComplete(e,lecture.id)} />
                                </div>
                                <div style={{display:'flex', flexDirection:'column',marginTop:'7px'}} onClick={(e) => this.activateItem(e,lecture.id, itemIndex, playlist)}>
                                    <div className="info">
                                        <p style={{margin:'0px'}}>{lecture.title}</p>
                                    </div>
                                    <div style={{display:'flex'}}>
                                        {this.lectureTypeInfoIcon(remainingTime, lecture.type)}
                                    </div>
                                  </div>
                            </div>
                        </div>
                      );
                    })
                  }
                </ExpansionPanel>
              </React.Fragment>
             );
            })
          }
          </div>
          {
            showCurrentInfo ?
              <div className="current-title">
                <Button style={{color:'#3f51b5'}} type="raised">
                  {this.currentlyPlayingTitle}
                </Button>
              </div>
              :null
          }

          <div ref={this.courseContentContainerRef}>
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
        </div>
        <div className="nxt-prev-btn-container" ref={this.nxtPrevContainerRef}>
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
              fadePlaylistControls={this.fadePlaylistControls}
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

export default PlayList;
