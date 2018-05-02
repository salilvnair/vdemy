import { Injectable, ElementRef } from '@angular/core';
import { ResumePlayerModel } from '../model/resume-player.model';
import { PlayerComponentGlobalData } from '../model/player-global.model';
import { CurrentPlayListModel } from '../model/current-playlist.model';
import { TimeoutDialogService } from '../../auth/timeout/timeout-dialog.service';
import { DashboardService } from '../../dashboard/service/dashboard.service';
import { PlayerDataService } from './player-data.service';
import { ElectronService } from 'ngx-electron';
import * as $ from 'jquery';
import * as CommonConstant from '../../shared/constant/common.constant';
@Injectable()
export class PlayerService {
  playerComponentGlobalData: PlayerComponentGlobalData;
  constructor(
    private dashboardService: DashboardService,
    private timeoutDialogService: TimeoutDialogService,
    private elementRef: ElementRef,
    private electronService: ElectronService
  ) {}
  initPlayerComponentGlobalData(
    playerComponentGlobalData: PlayerComponentGlobalData
  ) {
    this.playerComponentGlobalData = playerComponentGlobalData;
  }
  onRouterNavigate() {
    this.showOrHideElementsOnExit();
    this.populateResumeFromTimeOnExit();
    this.timeoutDialogService.pauseOrContinueTimeOut(false);
  }
  showOrHideElementsOnInit() {
    //below will be hidden once the router navigates inside the player component.
    $('#headerNav').hide();
  }
  showOrHideElementsOnExit() {
    //below will be shown once the router navigates outside the player component.
    $('#headerNav').show();
  }
  initCoursePlayListModel(resumePlayerInfo?: ResumePlayerModel) {
    if (this.playerComponentGlobalData.currentPlayListModel == undefined) {
      this.playerComponentGlobalData.currentPlayListModel = new CurrentPlayListModel();
    }
    if (resumePlayerInfo != undefined) {
      this.playerComponentGlobalData.currentPlayListModel.playListIndex =
        resumePlayerInfo.playListIndex;
      this.playerComponentGlobalData.currentPlayListModel.fileIndex =
        resumePlayerInfo.fileIndex;
    }
    this.playerComponentGlobalData.currentPlayListModel.fileLocation = this.getFileLocationFromPlayList(
      this.playerComponentGlobalData.currentPlayListModel.playListIndex,
      this.playerComponentGlobalData.currentPlayListModel.fileIndex
    );
  }
  getFileLocationFromPlayList(playListIndex: number, fileIndex: number) {
    let playListIndexCounter: number = 0;
    let fileLocation = '';
    this.playerComponentGlobalData.playList.some(function(playListItem, i) {
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
  resumeFromTime() {
    let resumePlayerInfo: ResumePlayerModel = this.dashboardService.getResumeCourseInfo();
    if (resumePlayerInfo.resumeFromTime != undefined) {
      this.playerComponentGlobalData.videoPlayer.currentTime =
        resumePlayerInfo.resumeFromTime;
      this.playerComponentGlobalData.playbackRate =
        resumePlayerInfo.playerSpeed;
      this.changePlayBackRate(this.playerComponentGlobalData.playbackRate);
      this.initCoursePlayListModel(resumePlayerInfo);
      this.play(
        this.getFileLocationFromPlayList(
          resumePlayerInfo.playListIndex,
          resumePlayerInfo.fileIndex
        )
      );
    }
  }
  play(fileLocation: string) {
    this.prePlay(fileLocation);
    if (!this.playerComponentGlobalData.isCurrentFileHtml) {
      this.playerComponentGlobalData.videoPlayer.src = fileLocation;
      this.playerComponentGlobalData.videoPlayer.playbackRate = this.playerComponentGlobalData.playbackRate;
      this.playerComponentGlobalData.videoPlayer.play();
    } else {
      if (
        this.playerComponentGlobalData.videoPlayer &&
        !this.playerComponentGlobalData.videoPlayer.paused
      ) {
        this.playerComponentGlobalData.videoPlayer.pause();
      }
    }
    this.postPlay();
  }
  prePlay(fileLocation: string) {
    //check if the fileType is html or video
    var fileType: string = this.splitByLastDot(fileLocation)[1];
    if (fileType.toLowerCase() == 'html' || fileType.toLowerCase() == 'htm') {
      $('#videoPlayerContainer').hide();
      $('#htmlDisplayContainer').show();
      this.readHtmlFile(fileLocation);
      this.playerComponentGlobalData.isCurrentFileHtml = true;
    } else {
      $('#htmlDisplayContainer').hide();
      $('#videoPlayerContainer').show();
      this.playerComponentGlobalData.isCurrentFileHtml = false;
    }
  }
  postPlay() {
    this.populateAndPublishFileContentMetaData();
    this.styleFileBeingViewed();
    this.populateCurrentFileNamePostInit();
  }
  populateAndPublishFileContentMetaData() {
    this.populateFileContentMetaData();
    this.dashboardService.setCoursePlayListData(
      this.playerComponentGlobalData.playList
    );
  }
  populateFileContentMetaData() {
    let playListIndex =
      this.playerComponentGlobalData.currentPlayListModel == undefined
        ? 0
        : this.playerComponentGlobalData.currentPlayListModel.playListIndex;
    let fileIndex =
      this.playerComponentGlobalData.currentPlayListModel == undefined
        ? 0
        : this.playerComponentGlobalData.currentPlayListModel.fileIndex;
    let currentVideoDuration = this.playerComponentGlobalData.videoPlayer
      .duration;
    this.playerComponentGlobalData.playList[playListIndex].fileContent[
      fileIndex
    ].totalDuration = currentVideoDuration;
  }
  styleFileBeingViewed() {
    this.removeStyleFileBeingViewed();
    this.addStyleFileBeingViewed();
  }
  removeStyleFileBeingViewed() {
    var self = this;
    if (self.getCourseListFilePlayedCompletelyInd()) {
      $('.file__playing .removePostBlink').text('visibility');
    } else {
      $('.file__playing .removePostBlink').text('visibility_off');
    }
    $('.file__playing').removeClass('file__playing');
  }
  getCourseListFilePlayedCompletelyInd() {
    let playListIndex =
      this.playerComponentGlobalData.currentPlayListModel == undefined
        ? 0
        : this.playerComponentGlobalData.currentPlayListModel.playListIndex;
    let fileIndex =
      this.playerComponentGlobalData.currentPlayListModel == undefined
        ? 0
        : this.playerComponentGlobalData.currentPlayListModel.fileIndex;
    return this.playerComponentGlobalData.playList[playListIndex].fileContent[
      fileIndex
    ].played;
  }
  addStyleFileBeingViewed() {
    var fileIndex = this.playerComponentGlobalData.currentPlayListModel
      .fileIndex;
    var playListIndex = this.playerComponentGlobalData.currentPlayListModel
      .playListIndex;
    this.playerComponentGlobalData.btnFileBeingViewedId =
      'btnFileVisited_' + playListIndex + '_' + fileIndex;
    this.playerComponentGlobalData.iconFileBeingViewedId =
      'iconFileNonVisited_' + playListIndex + '_' + fileIndex;
    $('#' + this.playerComponentGlobalData.btnFileBeingViewedId).addClass(
      'file__playing'
    );
    $('#' + this.playerComponentGlobalData.iconFileBeingViewedId).text(
      'visibility'
    );
  }
  populateCurrentFileNamePostInit() {
    var fileIndex = this.playerComponentGlobalData.currentPlayListModel
      .fileIndex;
    var playListIndex = this.playerComponentGlobalData.currentPlayListModel
      .playListIndex;
    this.playerComponentGlobalData.currentFileName = this.playerComponentGlobalData.playList[
      playListIndex
    ].fileContent[fileIndex].fileName;
  }
  splitByLastDot(text) {
    var index = text.lastIndexOf('.');
    return [text.slice(0, index), text.slice(index + 1)];
  }
  readHtmlFile(filepath) {
    var self = this;
    var fs = this.electronService.remote.require('fs');
    fs.readFile(filepath, 'utf-8', (err, data) => {
      if (err) {
        alert('An error ocurred reading the file :' + err.message);
        return;
      }
      this.playerComponentGlobalData.staticHtml = data; // Change how to handle the file content
      // console.log('The file content is : ' + data);
    });
  }
  changePlayBackRate(rate: number) {
    this.playerComponentGlobalData.videoPlayer.playbackRate = rate;
    this.playerComponentGlobalData.playbackRate = rate;
    $('#playBackSpeedBtn').text(rate + 'x');
    this.styleDropupRate();
  }
  styleDropupRate() {
    var rate = this.playerComponentGlobalData.videoPlayer.playbackRate;
    $('.rate-dropup').each(function() {
      var dropupRate = $(this)
        .text()
        .replace('x', '');
      if (rate == dropupRate) {
        $(this).css('background', '#3f51b5');
      } else {
        $(this).css('background', '#818181');
      }
    });
  }
  initEventListeners() {
    var self = this;
    this.playerComponentGlobalData.videoPlayer = document.querySelector(
      'video'
    );
    this.playerComponentGlobalData.playerVolume = this.playerComponentGlobalData.videoPlayer.volume;
    $('#seekbar')[0].oninput = function() {
      var seekBarVal = $('#seekbar').val();
      var vidTime =
        self.playerComponentGlobalData.videoPlayer.duration *
        (seekBarVal / 100);
      self.playerComponentGlobalData.videoPlayer.currentTime = vidTime;
    };
    $('#seekbar').on('change mousemove', function() {
      var val =
        ($(this).val() - $(this).attr('min')) /
        ($(this).attr('max') - $(this).attr('min'));
      $(this).css(
        'background-image',
        '-webkit-gradient(linear, left top, right top, ' +
          'color-stop(' +
          val +
          ', #3f51b5), ' +
          'color-stop(' +
          val +
          ', #818181)' +
          ')'
      );
    }); //init the minimum volumeFiller
    $('#volumeControl').css(
      'background-image',
      '-webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(0.353535, rgb(63, 81, 181)),' +
        'color-stop(0.353535, rgb(129, 129, 129)))'
    );
    $('#volumeControl').on('change input click', function() {
      if (self.playerComponentGlobalData.videoPlayer.muted) {
        self.controlMuteOrUnmute(CommonConstant.PLAYLIST_VOLUME_UNMUTE);
      }
      if ($(this).val() < 35) {
        $(this).val(36);
        return false;
      }
      var val =
        ($(this).val() - $(this).attr('min')) /
        ($(this).attr('max') - $(this).attr('min'));
      $(this).css(
        'background-image',
        '-webkit-gradient(linear, left top, right top, ' +
          'color-stop(' +
          val +
          ', #3f51b5), ' +
          'color-stop(' +
          val +
          ', #818181)' +
          ')'
      ); //restrict volumecontrol to go beyond the button icon
      //console.log('Before: ' + self.videoPlayer.volume);
      self.playerComponentGlobalData.videoPlayer.volume = $(this).val() / 100; //console.log('After: ' + self.videoPlayer.volume);
    });
    $('#videoPlayer').on('click', function(e) {
      self.controlAction(CommonConstant.PLAYLIST_PLAY_PAUSE);
    });
    this.playerComponentGlobalData.videoPlayer.addEventListener(
      'ended',
      function(e) {
        self.autoPlayNext();
      }
    );
    this.playerComponentGlobalData.videoPlayer.ontimeupdate = function() {
      if (!isNaN(self.playerComponentGlobalData.videoPlayer.duration)) {
        var percentage =
          self.playerComponentGlobalData.videoPlayer.currentTime /
          self.playerComponentGlobalData.videoPlayer.duration *
          100;
        $('#seekbar')
          .val(percentage)
          .change();
        var currentTime: number =
          self.playerComponentGlobalData.videoPlayer.currentTime;
        var totalDuration: number =
          self.playerComponentGlobalData.videoPlayer.duration;
        $('#seekbarTimer').text(
          self.formatTime(currentTime) + '/' + self.formatTime(totalDuration)
        );
      }
    };
  }
  controlAction(type: string) {
    let isVideoPaused = false;
    if (this.playerComponentGlobalData.videoPlayer) {
      isVideoPaused = this.playerComponentGlobalData.videoPlayer.paused;
    }
    if (type === CommonConstant.PLAYLIST_PLAY_PAUSE) {
      if (this.playerComponentGlobalData.videoPlayer.paused) {
        type = CommonConstant.PLAYLIST_PLAY;
        this.showControlActionPerformed(CommonConstant.PLAYLIST_PLAY, false);
      } else {
        type = CommonConstant.PLAYLIST_PAUSE;
        this.showControlActionPerformed(CommonConstant.PLAYLIST_PAUSE, true);
      }
      this.togglePlayOrPause(type);
    } else if (type === CommonConstant.PLAYLIST_PLAY_NEXT) {
      if (!isVideoPaused) {
        this.showControlActionPerformed(
          CommonConstant.PLAYLIST_PLAY_NEXT,
          false
        );
      }
      this.forwardCurrentTime();
    } else if (type === CommonConstant.PLAYLIST_PLAY_PREVIOUS) {
      if (!isVideoPaused) {
        this.showControlActionPerformed(
          CommonConstant.PLAYLIST_PLAY_PREVIOUS,
          false
        );
      }
      this.rewindCurrentTime();
    } else if (type === CommonConstant.PLAYLIST_VOLUME) {
      if (this.playerComponentGlobalData.videoPlayer.muted) {
        type = CommonConstant.PLAYLIST_VOLUME_UNMUTE;
        this.showControlActionPerformed(
          CommonConstant.PLAYLIST_VOLUME_UNMUTE,
          false
        );
      } else {
        type = CommonConstant.PLAYLIST_VOLUME_MUTE;
        this.showControlActionPerformed(
          CommonConstant.PLAYLIST_VOLUME_MUTE,
          false
        );
      }
      this.toggleMuteOrUnmute(type);
    }
  }
  togglePlayOrPause(type: string) {
    if (
      type != undefined &&
      !this.playerComponentGlobalData.isCurrentFileHtml
    ) {
      if (type === CommonConstant.PLAYLIST_PLAY) {
        this.playerComponentGlobalData.videoPlayer.play();
        $('#iconPlayPause').text('pause');
      } else if (type === CommonConstant.PLAYLIST_PAUSE) {
        this.playerComponentGlobalData.videoPlayer.pause();
        $('#iconPlayPause').text('play_arrow');
      }
    }
  }
  rewindCurrentTime() {
    this.playerComponentGlobalData.videoPlayer.currentTime += -5;
  }
  forwardCurrentTime() {
    this.playerComponentGlobalData.videoPlayer.currentTime += 5;
  }
  controlMuteOrUnmute(type: string) {
    this.toggleMuteOrUnmute(type);
    this.showControlActionPerformed(type, false);
  }
  toggleMuteOrUnmute(type: string) {
    if (type != undefined) {
      if (type === CommonConstant.PLAYLIST_VOLUME_MUTE) {
        this.playerComponentGlobalData.videoPlayer.muted = true;
        $('#iconMuteUnmute').text('volume_off');
        $('#btnVolume').toggleClass('btn__volume-mute');
        this.playerComponentGlobalData.currentVolumeBarFill = $(
          '#volumeControl'
        ).css('background-image');
        console.log(
          'this.currentVolumeBarFill',
          this.playerComponentGlobalData.currentVolumeBarFill
        );
        $('#volumeControl').css({
          'background-image': 'none'
        });
      } else if (type === CommonConstant.PLAYLIST_VOLUME_UNMUTE) {
        this.playerComponentGlobalData.videoPlayer.muted = false;
        $('#iconMuteUnmute').text('volume_up');
        $('#btnVolume').toggleClass('btn__volume-mute');
        $('#volumeControl').css({
          'background-image': this.playerComponentGlobalData
            .currentVolumeBarFill
        });
      }
    }
  }
  showControlActionPerformed(type: string, disableFadeOut: boolean) {
    $('#controlActionPerfContainer').removeClass('hide fadeout__action');
    if (!disableFadeOut) {
      setTimeout(function() {
        $('#controlActionPerfContainer').addClass('fadeout__action');
      }, 200);
    }
    if (type === CommonConstant.PLAYLIST_PLAY) {
      $('#iconControlAction').text('play_arrow');
    } else if (type === CommonConstant.PLAYLIST_PAUSE) {
      $('#iconControlAction').text('pause');
    } else if (type === CommonConstant.PLAYLIST_PLAY_NEXT) {
      $('#iconControlAction').text('forward_5');
    } else if (type === CommonConstant.PLAYLIST_PLAY_PREVIOUS) {
      $('#iconControlAction').text('replay_5');
    } else if (type === CommonConstant.PLAYLIST_VOLUME_MUTE) {
      $('#iconControlAction').text('volume_off');
    } else if (type === CommonConstant.PLAYLIST_VOLUME_UNMUTE) {
      $('#iconControlAction').text('volume_up');
    }
  }
  formatTime(seconds): string {
    if (isNaN(seconds)) {
      return '00:00';
    }
    let minutes = Math.floor(seconds / 60);
    let sMinutes = minutes >= 10 ? minutes : '0' + minutes;
    seconds = Math.floor(seconds % 60);
    let sSeconds = seconds >= 10 ? seconds : '0' + seconds;
    return sMinutes + ':' + sSeconds;
  }
  autoPlayNext() {
    var self = this;
    self.playNext();
    self.populateCoursePlayListFilePlayedCompletely();
  }
  populateCoursePlayListFilePlayedCompletely() {
    let playListIndex =
      this.playerComponentGlobalData.currentPlayListModel == undefined
        ? 0
        : this.playerComponentGlobalData.currentPlayListModel.playListIndex;
    let fileIndex =
      this.playerComponentGlobalData.currentPlayListModel == undefined
        ? 0
        : this.playerComponentGlobalData.currentPlayListModel.fileIndex;
    this.playerComponentGlobalData.playList[playListIndex].fileContent[
      fileIndex
    ].played = true;
  }
  playNext() {
    var self = this;
    let fileLocation = self.getPrevOrNextFileLocation(
      CommonConstant.PLAYLIST_PLAY_NEXT
    );
    if (
      self.playerComponentGlobalData.currentPlayListModel.fileLocation !=
      fileLocation
    ) {
      self.play(fileLocation);
    }
  }
  playPrev() {
    let fileLocation = this.getPrevOrNextFileLocation(
      CommonConstant.PLAYLIST_PLAY_PREVIOUS
    );
    if (
      this.playerComponentGlobalData.currentPlayListModel.fileLocation !=
      fileLocation
    ) {
      this.play(fileLocation);
    }
  }
  getPrevOrNextFileLocation(type: string) {
    let playListIndex =
      this.playerComponentGlobalData.currentPlayListModel == undefined
        ? 0
        : this.playerComponentGlobalData.currentPlayListModel.playListIndex;
    let fileIndex =
      this.playerComponentGlobalData.currentPlayListModel == undefined
        ? 0
        : this.playerComponentGlobalData.currentPlayListModel.fileIndex;
    if (type === CommonConstant.PLAYLIST_PLAY_PREVIOUS) {
      if (fileIndex < 1) {
        if (playListIndex > 0) {
          playListIndex -= 1;
          fileIndex =
            this.playerComponentGlobalData.playList[playListIndex].fileContent
              .length - 1;
          this.playerComponentGlobalData.currentPlayListModel.playListIndex = playListIndex;
          this.playerComponentGlobalData.currentPlayListModel.fileIndex = fileIndex;
        }
      } else {
        fileIndex -= 1;
        this.playerComponentGlobalData.currentPlayListModel.fileIndex = fileIndex;
      }
    } else if (type === CommonConstant.PLAYLIST_PLAY_NEXT) {
      let fileContentLength =
        this.playerComponentGlobalData.playList[playListIndex].fileContent
          .length - 1;
      let playListSize = this.playerComponentGlobalData.playList.length - 1;
      if (fileIndex == fileContentLength) {
        if (playListIndex < playListSize) {
          playListIndex += 1;
          fileIndex = 0;
          this.playerComponentGlobalData.currentPlayListModel.playListIndex = playListIndex;
          this.playerComponentGlobalData.currentPlayListModel.fileIndex = fileIndex;
        }
      } else {
        fileIndex += 1;
        this.playerComponentGlobalData.currentPlayListModel.fileIndex = fileIndex;
      }
    }
    return this.getFileLocationFromPlayList(playListIndex, fileIndex);
  }
  controlPlayOrPause(type: string) {
    if (type == CommonConstant.PLAYLIST_PLAY) {
      this.showControlActionPerformed(type, false);
      this.togglePlayOrPause(type);
    } else if (type == CommonConstant.PLAYLIST_PAUSE) {
      this.showControlActionPerformed(type, true);
      this.togglePlayOrPause(type);
    }
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
        $('#videoPlayerContainer').css({
          cursor: 'default'
        });
        $('.media-control__container').removeClass('fadeout__controls');
        $('.controls__more').removeClass('fadeout__controls');
        fadeInBuffer = false;
      }
      this.fadeOutTimer = setTimeout(function() {
        if (!this.videoPlayer.paused) {
          $('#videoPlayerContainer').css({
            cursor: 'none'
          });
          $('.media-control__container').addClass('fadeout__controls');
          $('.controls__more').addClass('fadeout__controls');
          fadeInBuffer = true;
        } else {
          fadeInBuffer = false;
        }
      }, 4000);
    });
    $('.media-control__container').css({
      cursor: 'default'
    });
    $('#videoPlayerContainer').css({
      cursor: 'default'
    });
  }
  togglePlayList() {
    $('.app-playlist').toggleClass('hide');
    if ($('#btnTogglePlayList').hasClass('toggle__playlist-close')) {
      if (!this.playerComponentGlobalData.initToggler) {
        this.controlPlayOrPause(CommonConstant.PLAYLIST_PLAY);
      }
      $('#playListCloseIcon').text('playlist_play');
      $('#btnTogglePlayList').css({
        background: '#3f51b5'
      });
    } else {
      this.controlPlayOrPause(CommonConstant.PLAYLIST_PAUSE);
      $('#playListCloseIcon').text('close');
      $('#btnTogglePlayList').css({
        background: '#f44336'
      });
    }
    $('#btnTogglePlayList').toggleClass('toggle__playlist-close');
    this.playerComponentGlobalData.initToggler = false;
  }
  initPlayList() {
    if (this.dashboardService.getCourseData().length > 0) {
      var index = this.dashboardService.findCourseIndexFromDashboard(
        this.dashboardService.playCourseId,
        this.dashboardService.getCourseData()
      );
      this.playerComponentGlobalData.playList = this.dashboardService.getCourseData()[
        index
      ].coursePlayList;
    }
  }
  toggleFullScreen() {
    $('#videoPlayer').toggleClass('video__fullscreen--maxheight'); //this.videoPlayer.classList.toggle('video__fullscreen--maxheight');
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
  exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
  populateResumeFromTime() {
    let playListIndex =
      this.playerComponentGlobalData.currentPlayListModel == undefined
        ? 0
        : this.playerComponentGlobalData.currentPlayListModel.playListIndex;
    let fileIndex =
      this.playerComponentGlobalData.currentPlayListModel == undefined
        ? 0
        : this.playerComponentGlobalData.currentPlayListModel.fileIndex;
    this.playerComponentGlobalData.playList[playListIndex].fileContent[
      fileIndex
    ].resumeFromTime = this.playerComponentGlobalData.videoPlayer.currentTime;
  }
  populateResumeFromTimeOnExit() {
    let playListIndex =
      this.playerComponentGlobalData.currentPlayListModel == undefined
        ? 0
        : this.playerComponentGlobalData.currentPlayListModel.playListIndex;
    let fileIndex =
      this.playerComponentGlobalData.currentPlayListModel == undefined
        ? 0
        : this.playerComponentGlobalData.currentPlayListModel.fileIndex;
    this.playerComponentGlobalData.playList[playListIndex].fileContent[
      fileIndex
    ].resumeFromTime = this.playerComponentGlobalData.videoPlayer.currentTime;
    this.dashboardService.setCoursePlayListData(
      this.playerComponentGlobalData.playList
    );
    let resumeCourseInfo = new ResumePlayerModel();
    resumeCourseInfo.fileIndex = fileIndex;
    resumeCourseInfo.playListIndex = playListIndex;
    resumeCourseInfo.resumeFromTime = this.playerComponentGlobalData.videoPlayer.currentTime;
    resumeCourseInfo.playerSpeed = this.playerComponentGlobalData.videoPlayer.playbackRate;
    this.dashboardService.addResumeCourseInfo(resumeCourseInfo);
  }
  initPlaying(currentPlayListModel: CurrentPlayListModel) {
    this.playerComponentGlobalData.currentPlayListModel = currentPlayListModel;
    this.play(currentPlayListModel.fileLocation);
    this.playerComponentGlobalData.initToggler = true;
    this.controlPlayOrPause(CommonConstant.PLAYLIST_PLAY);
  }
  onKeypressEvent(event) {
    var self = this;
    switch (event.keyCode) {
      case 32: // space
        //handle the play pause if the playPause btn is focused
        if (document.activeElement.id == 'btnPlayPause') {
          $('#btnPlayPause').click();
          break;
        }
        self.controlAction(CommonConstant.PLAYLIST_PLAY_PAUSE);
        document.activeElement.classList.add('focusable-thing');
        break;
      case 37: // left arrow
        self.controlAction(CommonConstant.PLAYLIST_PLAY_PREVIOUS);
        break;
      case 39: // right arrow
        self.controlAction(CommonConstant.PLAYLIST_PLAY_NEXT);
        break;
      default:
        return;
    }
  }
}
