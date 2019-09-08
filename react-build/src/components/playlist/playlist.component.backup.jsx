import React from 'react'
import Player from '../../components/player/player.component';
import withHttpInterceptor from '../hoc/auth/auth.hoc';
import './playlist.component.scss';
import { ExpansionPanel } from '@salilvnair/react-ui';
class PlayList extends React.Component {
  state = {
    url: '',
    hideList: false
  }

  // TODO need to trigger course completed api
  // https://www.udemy.com/api-2.0/users/me/subscribed-courses/${courseId}/completed-lectures/
  // request body {"lecture_id":12835806,"downloaded":false}

  // for resetting as not completed need to trigger below api with request type as DELETE
  //https://www.udemy.com/api-2.0/users/me/subscribed-courses/${courseId}/completed-lectures/12835806

  loadLectureItems(lectureId) {
    let endpointURL = "https://www.udemy.com/api-2.0"+
    `/users/me/subscribed-courses/${this.props.courseId}/lectures/${lectureId}?fields[asset]=stream_urls,download_urls,title,filename,data`;
    return this.props.get(endpointURL).subscribe(resp => {
        resp.data.asset.stream_urls.Video.forEach(url=>{
            if(url.label=== "720" && url.type === "video/mp4"){
                this.setState({url:url.file, hideList:true})
            }
        })

    });
  }

  activateItem(event, lectureId) {
    let divElem = event.target;
    this.applyItemHighlight(divElem);
    this.loadLectureItems(lectureId);
  }

  applyItemHighlight(divElem) {
      if(divElem.classList && divElem.classList.contains('playlist-content')) {
          document.querySelectorAll('.playlist-content').forEach(item =>{
              item.classList.remove('highlight-item');
          })
          divElem.classList.add('highlight-item');
      }
      else {
          this.applyItemHighlight(divElem.parentNode);
      }
  }

  stopPlaying() {
    this.setState({url:'', hideList:false})
  }

  render() {
    const { url, hideList } = this.state;
    return (
      <div>
        <button className={hideList?'':'hide'} onClick={() => this.stopPlaying()}>Stop Player</button>
        <ul className={hideList?'hide':''}>
        {
                  this.props.courseItems.map(item => {

                    return (
                      <div>
                      <h2>{item.chapterTitle} </h2>
                      <ul>
                        {
                          item.lectures.map(lecture => {
                            return (
                              <div>
                              <h4>{lecture.title} </h4>
                              <button onClick={() => this.loadLectureItems(lecture.id)}>Play</button>
                              </div>
                            );
                            })
                        }
                      </ul>
                      </div>
                    );
                  })
        }
      </ul>


        <div style={{maxWidth:'400px'}}>
          {
            this.props.courseItems.map(item => {
              <ExpansionPanel header={item.chapterTitle}>
                {
                  item.lectures.map(lecture => {
                    return (
                      <div className="playlist-content" onClick={(e) => this.activateItem(e,lecture.id)}>
                      <div className= "playlist-item" >
                          <div style={{marginTop:'7px'}}>
                              <Checkbox color="primary" />
                          </div>
                          <div style={{display:'flex', flexDirection:'column',marginTop:'10px'}}>
                              <div className="info">
                                  <p style={{margin:'0px'}}>{lecture.title}</p>
                              </div>
                              <div style={{display:'flex'}}>
                                  <Icon style={{marginTop:'10px'}}>play_circle_outline</Icon><p>8min</p>
                              </div>
                            </div>
                      </div>
                  </div>
                    );
                    })
                }
              </ExpansionPanel>
            })
          }
        </div>
      </div>
    );
  }

}

export default withHttpInterceptor(PlayList);
