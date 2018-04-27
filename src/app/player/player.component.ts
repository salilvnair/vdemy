import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { DashboardService } from './../dashboard/service/dashboard.service';
import * as $ from 'jquery';
import * as CommonConstant from '../shared/constant/common.constant';
import { PlayList } from './model/playlist.model';
import { CourseModel } from '../dashboard/course/model/course.model';
import { CurrentPlayListModel } from './model/current-playlist.model';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  constructor(private dashboardService: DashboardService) {}
  playList: PlayList[];
  videoPlayer: HTMLVideoElement;
  currentPlayListModel: CurrentPlayListModel;
  currentVideoCounter: number = 0;
  globalVideoCounter: number = 0;
  fadeOutTimer;
  ngOnInit() {
    this.init();
  }

  init() {
    this.preparePlayList();
    this.initEventListeners();
    this.fadeVideoControls();
  }

  initEventListeners() {
    var self = this;
    this.videoPlayer = document.querySelector('video');

    $('#seekbar').on('click', function(e) {
      var offset = $(this).offset();
      var left = e.pageX - offset.left;
      var totalWidth = $('#seekbar').width();
      var percentage = left / totalWidth;
      var vidTime = self.videoPlayer.duration * percentage;
      self.videoPlayer.currentTime = vidTime;
    });

    $('#videoPlayer').on('click', function(e) {
      self.togglePlayOrPause();
    });

    document.addEventListener('keydown', e => {
      // console.log(e.keyCode);
      switch (e.keyCode) {
        case 32: // space
          self.togglePlayOrPause();
          break;
        case 37: // left arrow
          self.rewindCurrentTime();
          break;
        case 39: // right arrow
          self.forwardCurrentTime();
          break;
      }
    });

    this.videoPlayer.addEventListener('ended', function(e) {
      self.playNext();
    });

    this.videoPlayer.ontimeupdate = function() {
      var percentage =
        self.videoPlayer.currentTime / self.videoPlayer.duration * 100;
      $('#seekbar span').css('width', percentage + '%');
      var currentTime: number = self.videoPlayer.currentTime;
      var totalDuration: number = self.videoPlayer.duration;
      $('#seekbarTimer').text(
        self.formatTime(currentTime) + '/' + self.formatTime(totalDuration)
      );
    };
  }

  forwardCurrentTime() {
    this.videoPlayer.currentTime += 5;
  }
  rewindCurrentTime() {
    this.videoPlayer.currentTime += -5;
  }

  toggleFullScreen() {
    $('#videoPlayer').toggleClass('video__fullscreen--maxheight');
    //this.videoPlayer.classList.toggle('video__fullscreen--maxheight');
    var self = this;
    var fullscreenElement =
      document.fullscreenElement || document.webkitFullscreenElement;
    if (fullscreenElement) {
      $('#iconFullScreen').text('fullscreen');
      self.exitFullscreen();
    } else {
      $('#iconFullScreen').text('fullscreen_exit');
      self.launchIntoFullscreen(
        document.getElementById('videoPlayerContainer')
      );
    }
  }

  launchIntoFullscreen(element) {
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

  // Whack fullscreen
  exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }

  //const fullScreen = document.querySelector('input[type=button]');

  formatTime(seconds): string {
    if (seconds === NaN) {
      return '00:00';
    }
    let minutes = Math.floor(seconds / 60);
    let sMinutes = minutes >= 10 ? minutes : '0' + minutes;
    seconds = Math.floor(seconds % 60);
    let sSeconds = seconds >= 10 ? seconds : '0' + seconds;
    return sMinutes + ':' + sSeconds;
  }

  // handle changes to speed input
  //    speedInput.addEventListener('change', e => {
  //        video.playbackRate = Number(playBackSpeedBtn);
  //        // write actual playback rate value back to input
  //        playBackSpeedBtn = Number(video.playbackRate);
  //    });

  // add keyboard shortcuts for pause (space) and 5 sec jump (left/right arrow)

  autoPlayNext(e) {
    this.playNext();
  }

  initPlaying(currentPlayListModel: CurrentPlayListModel) {
    this.currentPlayListModel = currentPlayListModel;
    this.play(currentPlayListModel.fileLocation);
  }

  play(fileLocation: string) {
    this.videoPlayer.src = fileLocation;
    this.videoPlayer.playbackRate = Number(1);
    this.videoPlayer.play();
  }

  playNext() {
    var self = this;
    let fileLocation = self.getPrevOrNextFileLocation(
      CommonConstant.PLAYLIST_PLAY_NEXT
    );
    if (self.currentPlayListModel.fileLocation != fileLocation) {
      self.play(fileLocation);
    }
  }

  playPrev() {
    let fileLocation = this.getPrevOrNextFileLocation(
      CommonConstant.PLAYLIST_PLAY_PREVIOUS
    );
    if (this.currentPlayListModel.fileLocation != fileLocation) {
      this.play(fileLocation);
    }
  }

  getPrevOrNextFileLocation(type: string) {
    let playListIndex = this.currentPlayListModel.playListIndex;
    let fileIndex = this.currentPlayListModel.fileIndex;
    if (type === CommonConstant.PLAYLIST_PLAY_PREVIOUS) {
      if (fileIndex < 1) {
        if (playListIndex > 0) {
          playListIndex -= 1;
          fileIndex = this.playList[playListIndex].fileContent.length - 1;
        }
      } else {
        fileIndex -= 1;
      }
    } else if (type === CommonConstant.PLAYLIST_PLAY_NEXT) {
      let fileContentLength =
        this.playList[playListIndex].fileContent.length - 1;
      let playListSize = this.playList.length - 1;
      if (fileIndex == fileContentLength) {
        if (playListIndex < playListSize) {
          playListIndex += 1;
          fileIndex = 0;
        }
      } else {
        fileIndex += 1;
      }
    }
    return this.getFileLocationFromPlayList(playListIndex, fileIndex);
  }

  getFileLocationFromPlayList(playListIndex: number, fileIndex: number) {
    let playListIndexCounter: number = 0;
    let fileLocation = '';
    this.playList.some(function(playListItem, i) {
      playListItem.fileContent.some(function(fileItem, k) {
        if (playListIndex == i && fileIndex == k) {
          fileLocation = fileItem.fileLocation;
          return true;
        }
      });
      if (fileLocation == '') {
        return false;
      } else {
        return true;
      }
    });
    return fileLocation;
  }

  togglePlayOrPause() {
    if (this.videoPlayer.paused) {
      this.videoPlayer.play();

      $('#iconPlayPause').text('pause');
    } else {
      this.videoPlayer.pause();
      $('#iconPlayPause').text('play_arrow');
    }
  }

  playCourse() {}

  preparePlayList() {
    if (this.dashboardService.getCourseData().length > 0) {
      var index = this.findCourseIndexFromDashboard(
        this.dashboardService.playCourseId,
        this.dashboardService.getCourseData()
      );
      this.playList = this.dashboardService.getCourseData()[
        index
      ].coursePlayList;
    }
  }

  findCourseIndexFromDashboard(id, dashboardData: CourseModel[]) {
    let arrayIndex = 0;
    dashboardData.find(function(dashboardItr, index) {
      arrayIndex = index;
      return dashboardItr.id === id;
    });
    return arrayIndex;
  }

  togglePlayList() {
    $('.app-playlist').toggleClass('hide');
  }

  fadeVideoControls() {
    var fadeInBuffer = false;
    $(document).mousemove(function() {
      if (!fadeInBuffer) {
        if (this.fadeOutTimer) {
          clearTimeout(this.fadeOutTimer);
          this.fadeOutTimer = 0;
        }
        $('html').css({
          cursor: ''
        });
      } else {
        //console.log('lets comeback');
        $('#videoPlayer').css({ cursor: 'default' });
        $('.media-control__container').toggleClass('fadeout');
        fadeInBuffer = false;
      }

      this.fadeOutTimer = setTimeout(function() {
        //console.log('lets fadeout');
        if (!this.videoPlayer.paused) {
          $('#videoPlayer').css({ cursor: 'none' });
          $('.media-control__container').toggleClass('fadeout');
          fadeInBuffer = true;
        } else {
          fadeInBuffer = false;
        }
      }, 4000);
    });
    $('.media-control__container').css({ cursor: 'default' });
  }
}
