import React from 'react';

import './player.component.scss';
import { Icon } from '@salilvnair/react-ui';

class Player extends React.Component {
    fadeInBuffer = false;
    fadeOutTimer;
    constructor(props) {
        super(props);
        this.videoElementRef = React.createRef();
        this.seekbarRef = React.createRef();
        this.mediaControlRef = React.createRef();
        this.seekbarTimerRef = React.createRef();
        this.playerContainerRef = React.createRef();
        this.state = {
            playerState: {
                isPaused: false,
                playbackSpeed: "1",
                currentVideoDuration: 0,
                fullScreen: false,
                currentVolume: 50
            }
        }
    }

    metaData = () => {
      let playerMetaData = {
        currentTime : this.videoElementRef.current.currentTime,
        totalDuration : this.videoElementRef.current.duration
      }
      return playerMetaData;
    }

    togglePlayOrPause() {
        const { playerState } = this.state;
        if(playerState.isPaused) {
            this.setState(prevState => ({
                playerState: {
                  ...prevState.playerState,
                  isPaused: false
                }
            }));
            this.videoElementRef.current.play()
        }
        else {
            this.videoElementRef.current.pause();
            this.setState(prevState => ({
                playerState: {
                  ...prevState.playerState,
                  isPaused: true
                }
            }));
        }
    }

    rewindCurrentTime() {
        this.videoElementRef.current.currentTime += -5;
    }

    forwardCurrentTime() {
        this.videoElementRef.current.currentTime += 5;
    }

    handleOnInput  = (event) => {
        var seekBarVal = this.seekbarRef.current.value;
          var vidTime =
          this.videoElementRef.current.duration *
            (seekBarVal / 100);
            this.videoElementRef.current.currentTime = vidTime;
    }

    handleChangeAndMouseMove = (event) => {

        var seekBarVal = (this.seekbarRef.current.value - this.seekbarRef.current.getAttribute('min'))/(this.seekbarRef.current.getAttribute('max')-this.seekbarRef.current.getAttribute('min'));
        var c = this.seekbarRef.current.style;
        c.backgroundImage = '-webkit-gradient(linear, left top, right top, ' +
        'color-stop(' +
        seekBarVal +
        ', #ec5252), ' +
        'color-stop(' +
        seekBarVal +
        ', #818181)' +
        ')';
    }

    handleOnPlay = (event) => {
      if(this.props.playbackSpeed) {
        this.changePlayBackRate(this.props.playbackSpeed);
      }
    }

    handlePlayerOnTimeUpdate = (event) => {
        if (!isNaN(this.videoElementRef.current.duration)) {
            var percentage =
                (this.videoElementRef.current.currentTime /
                this.videoElementRef.current.duration) *
                100;
            this.seekbarRef.current.value = percentage;
            var currentTime =
                this.videoElementRef.current.currentTime;
            var totalDuration =
                this.videoElementRef.current.duration;
            this.seekbarTimerRef.current.innerText = this.formatTime(currentTime) + '/' + this.formatTime(totalDuration);
            var currentVideoDuration = Math.floor(
                this.videoElementRef.current.duration
            );

            this.setState(prevState => ({
                playerState: {
                    ...prevState.playerState,
                    currentVideoDuration: currentVideoDuration
                }
            }));
            this.handleChangeAndMouseMove(event);
        }
    }

    fadeControls = () => {
      //console.log('going to fade after 4 secs')
      this.fadeOutTimer = setTimeout(()=>{
        // if (
        //   !self.playerComponentGlobalData.videoPlayer.paused &&
        //   !self.playerComponentGlobalData.isCurrentFileHtml
        // ) {

        // } else {
        //   fadeInBuffer = false;
        // }
        // $('#playerContainer').css({
        //   cursor: 'none'
        // });
        // $('.media-control__container').addClass('fadeout__controls');
        if(this.playerContainerRef.current && this.mediaControlRef.current) {
          this.playerContainerRef.current.style.cursor= 'none';
          this.mediaControlRef.current.classList.add('fadeout__controls');
          this.fadePlaylistControls(true);
          this.fadeInBuffer = true;
        }
      }, 4000)
    }

    resumeFromLastPlayed() {
      if(this.props.resumeFrom && !isNaN(this.props.resumeFrom)){
        this.videoElementRef.current.currentTime = this.props.resumeFrom;
      }
    }

    componentDidMount() {
      this.resumeFromLastPlayed();
      this.fadeVideoControls();
    }

    componentWillUnmount() {
      if (this.fadeOutTimer) {
        clearTimeout(this.fadeOutTimer);
        this.fadeOutTimer = 0;
      }
    }

    fadeVideoControls = () => {
      if (!this.fadeInBuffer) {
        if (this.fadeOutTimer) {
          clearTimeout(this.fadeOutTimer);
          this.fadeOutTimer = 0;
        }
        // $('html').css({
        //   cursor: ''
        // });
      } else {
        if(this.playerContainerRef.current && this.mediaControlRef.current) {
          this.playerContainerRef.current.style.cursor= 'default';
          // .css({
          //   cursor: 'default'
          // });
          this.mediaControlRef.current.classList.remove('fadeout__controls');
          //$('.media-control__container').removeClass('fadeout__controls');
          this.fadePlaylistControls(false);
          this.fadeInBuffer = false;
        }
      }
      this.fadeControls();
    }

    fadePlaylistControls(fade) {
      this.props.fadePlaylistControls(fade);
    }

    changePlayBackRate = (rate) => {
        if(this.videoElementRef.current) {
            this.videoElementRef.current.playbackRate = rate;
            this.setState(prevState => ({
                playerState: {
                    ...prevState.playerState,
                    playbackSpeed:rate+''
                }
            }));
            if(this.props.playBackSpeedChanged) {
              this.props.playBackSpeedChanged(rate);
            }
        }
    }

    formatTime(seconds) {
        if (isNaN(seconds)) {
          return '00:00';
        }
        let minutes = Math.floor(seconds / 60);
        let sMinutes = minutes >= 10 ? minutes : '0' + minutes;
        seconds = Math.floor(seconds % 60);
        let sSeconds = seconds >= 10 ? seconds : '0' + seconds;
        return sMinutes + ':' + sSeconds;
    }

    toggleFullScreen = () => {
        var fullscreenElement =
      document["fullscreenElement"] || document["webkitFullscreenElement"];
      if (fullscreenElement) {
        this.exitFullscreen();
      }
      else {
        this.launchIntoFullscreen(this.playerContainerRef.current);
      }

    }

    launchIntoFullscreen = (element) => {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        }
    }

    exitFullscreen = () => {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document["webkitExitFullscreen"]) {
          document["webkitExitFullscreen"]();
        }
    }

    handleVideoEnded() {
        if(this.props.ended) {
            this.props.ended()
        }
    }

    render() {
        const { playerState } = this.state;
        return (
            <div
                id="playerContainer"
                ref={this.playerContainerRef}
                onMouseMove={this.fadeVideoControls}
                className="video-player">
                <video
                    id="videoPlayer"
                    src={this.props.src}
                    ref={this.videoElementRef}
                    onPlay={this.handleOnPlay}
                    onTimeUpdate={this.handlePlayerOnTimeUpdate}
                    onEnded={() => this.handleVideoEnded()}
                    autoPlay>
                </video>
                <div
                  className="media-control__container"
                  ref={this.mediaControlRef}
                  id="playerControls">
                    <div>
                        <div className="seekbar-slider__container">
                            <input
                                type="range"
                                min="1"
                                max="100"
                                defaultValue="0"
                                className="seekbar-slider"
                                id="seekbar"
                                onInput={this.handleOnInput}
                                onChange={this.handleChangeAndMouseMove}
                                onMouseMove={this.handleChangeAndMouseMove}
                                ref={this.seekbarRef} />
                        </div>
                        <div id="seekbarTimer" className="seekbar-timer" ref={this.seekbarTimerRef}></div>
                    </div>
                    <div className="controls">
                        <button id="btnPlayPause" className="btn__play-pause"   onClick={()=>{this.togglePlayOrPause()}}>
                            {
                                playerState.isPaused ?
                                <Icon>play_arrow</Icon>: <Icon>pause</Icon>
                            }
                        </button>
                        <button id="btnPullTimerBack" className="btn__rewind" onClick={()=>{this.rewindCurrentTime()}}>
                            {
                              <Icon>replay_5</Icon>
                            }
                        </button>
                        <div className="common-dropup">
                            <button className="playback__rate" id="playBackSpeedBtn">{playerState.playbackSpeed + 'x'}</button>
                            <div className="dropup__container">
                                <button
                                    className="rate-dropup"
                                    style={
                                        {
                                            background:playerState.playbackSpeed==='2' ? '#ec5252' : 'black'
                                        }
                                    }
                                    onClick={()=>{this.changePlayBackRate(2)}}>
                                        2x</button>
                                <button
                                    className="rate-dropup"
                                    style={
                                        {
                                            background:playerState.playbackSpeed==='1.5' ? '#ec5252' : 'black'
                                        }
                                    }
                                    onClick={()=>{this.changePlayBackRate(1.5)}}>
                                        1.5x</button>
                                <button
                                    className="rate-dropup"
                                    style={
                                        {
                                            background:playerState.playbackSpeed==='1.25' ? '#ec5252' : 'black'
                                        }
                                    }
                                    onClick={()=>{this.changePlayBackRate(1.25)}}>
                                        1.25x</button>
                                <button
                                    className="rate-dropup"
                                    style={
                                        {
                                            background:playerState.playbackSpeed==='1' ? '#ec5252' : 'black'
                                        }
                                    }
                                    onClick={()=>{this.changePlayBackRate(1)}}>
                                        1x</button>
                                <button
                                    className="rate-dropup"
                                    style={
                                        {
                                            background:playerState.playbackSpeed==='0.75' ? '#ec5252' : 'black'
                                        }
                                    }
                                    onClick={()=>{this.changePlayBackRate(0.75)}}>
                                        0.75x</button>
                                <button
                                    className="rate-dropup"
                                    style={
                                        {
                                            background:playerState.playbackSpeed==='0.5' ? '#ec5252' : 'black'
                                        }
                                    }
                                    onClick={()=>{this.changePlayBackRate(0.5)}}>
                                        0.5x</button>
                            </div>
                        </div>
                        <button id="btnPullTimerForward" className="btn__forward" onClick={()=>{this.forwardCurrentTime()}}>
                            {
                                <Icon>forward_5</Icon>
                            }
                        </button>
                        <button
                            id="btnFullScreen"
                            className="btn__fullScreen"
                            onClick={this.toggleFullScreen}  >
                          <Icon>fullscreen</Icon>
                        </button>

                    </div>
                </div>
            </div>
        );
    }
}

export default Player;
