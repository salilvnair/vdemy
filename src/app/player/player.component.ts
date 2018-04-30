import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { DashboardService } from './../dashboard/service/dashboard.service';
import * as $ from 'jquery';
import * as CommonConstant from '../shared/constant/common.constant';
import { PlayList } from './model/playlist.model';
import { CourseModel } from '../dashboard/course/model/course.model';
import { CurrentPlayListModel } from './model/current-playlist.model';
import { PLAYLIST_PLAY_NEXT } from '../shared/constant/common.constant';
import { Router } from '@angular/router';
import { TimeoutDialogService } from '../auth/timeout/timeout-dialog.service';
import { PlayerDataService } from './service/player-data.service';
import { ResumePlayerModel } from './model/resume-player.model';
import { BeforeUnload } from '../util/unload/service/unload.service';
import { Observable } from 'rxjs/Observable';
import { AfterViewInit } from '@angular/core';
@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent
  implements OnInit, OnDestroy, BeforeUnload, AfterViewInit {
  constructor(
    private dashboardService: DashboardService,
    private router: Router,
    private timeoutDialogService: TimeoutDialogService,
    private playerDataService: PlayerDataService
  ) {}
  playList: PlayList[];
  videoPlayer: HTMLVideoElement;
  currentPlayListModel: CurrentPlayListModel;
  currentVideoCounter: number = 0;
  globalVideoCounter: number = 0;
  fadeOutTimer;
  initToggler = false;
  playerVolume: number = 0;
  playbackRate: number = 1;
  currentVolumeBarFill: string;
  totalVideoDuration: number;
  btnFileBeingViewedId: string;
  iconFileBeingViewedId: string;
  ngOnInit() {
    this.timeoutDialogService.pauseOrContinueTimeOut(true);
    this.init();
  }
  ngOnDestroy(): void {}
  beforeunload(): boolean | Observable<boolean> | Promise<boolean> {
    $('#headerNav').show();
    this.populateResumeFromTimeOnExit();
    this.timeoutDialogService.pauseOrContinueTimeOut(false);
    return true;
  }
  init() {
    this.initPlayList();
    this.initCoursePlayListModel();
    this.initEventListeners();
  }
  ngAfterViewInit(): void {
    this.resumeFromTime();
    this.hideHeaderNav();
    this.fadeVideoControls();
    this.styleDropupRate();
  }
  hideHeaderNav() {
    $('#headerNav').hide();
  }
  initCoursePlayListModel(resumePlayerInfo?: ResumePlayerModel) {
    if (this.currentPlayListModel == undefined) {
      this.currentPlayListModel = new CurrentPlayListModel();
    }
    if (resumePlayerInfo != undefined) {
      this.currentPlayListModel.playListIndex = resumePlayerInfo.playListIndex;
      this.currentPlayListModel.fileIndex = resumePlayerInfo.fileIndex;
    }
    this.currentPlayListModel.fileLocation = this.getFileLocationFromPlayList(
      this.currentPlayListModel.playListIndex,
      this.currentPlayListModel.fileIndex
    );
  }
  initEventListeners() {
    var self = this;
    this.videoPlayer = document.querySelector('video');
    this.playerVolume = this.videoPlayer.volume;
    $('#seekbar')[0].oninput = function() {
      var seekBarVal = $('#seekbar').val();
      var vidTime = self.videoPlayer.duration * (seekBarVal / 100);
      self.videoPlayer.currentTime = vidTime;
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
      '-webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(0.353535, rgb(63, 81, 181)), color-stop(0.353535, rgb(129, 129, 129)))'
    );
    $('#volumeControl').on('change input click', function() {
      if (self.videoPlayer.muted) {
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
      self.videoPlayer.volume = $(this).val() / 100; //console.log('After: ' + self.videoPlayer.volume);
    });
    $('#videoPlayer').on('click', function(e) {
      self.controlAction(CommonConstant.PLAYLIST_PLAY_PAUSE);
    });
    document.addEventListener('keydown', e => {
      // console.log(e.keyCode);
      switch (e.keyCode) {
        case 32: // space
          self.controlAction(CommonConstant.PLAYLIST_PLAY_PAUSE);
          break;
        case 37: // left arrow
          self.controlAction(CommonConstant.PLAYLIST_PLAY_PREVIOUS);
          break;
        case 39: // right arrow
          self.controlAction(CommonConstant.PLAYLIST_PLAY_NEXT);
          break;
      }
    });
    this.videoPlayer.addEventListener('ended', function(e) {
      self.autoPlayNext();
    });
    this.videoPlayer.ontimeupdate = function() {
      if (!isNaN(self.videoPlayer.duration)) {
        var percentage =
          self.videoPlayer.currentTime / self.videoPlayer.duration * 100;
        $('#seekbar')
          .val(percentage)
          .change();
        var currentTime: number = self.videoPlayer.currentTime;
        var totalDuration: number = self.videoPlayer.duration;
        $('#seekbarTimer').text(
          self.formatTime(currentTime) + '/' + self.formatTime(totalDuration)
        );
      } //listen to hover of ratebar
      // $('#playBackSpeedBtn').hover(function() {
      // });
    };
  }
  initPlaying(currentPlayListModel: CurrentPlayListModel) {
    this.currentPlayListModel = currentPlayListModel;
    this.play(currentPlayListModel.fileLocation);
    this.initToggler = true;
    this.controlPlayOrPause(CommonConstant.PLAYLIST_PLAY);
  }
  play(fileLocation: string) {
    this.videoPlayer.src = fileLocation;
    this.videoPlayer.playbackRate = this.playbackRate;
    this.videoPlayer.play();
    //push the details of fileContent metadata into the playlist
    this.populateAndPublishFileContentMetaData();
    this.styleFileBeingViewed();
  }
  populateFileContentMetaData() {
    let playListIndex =
      this.currentPlayListModel == undefined
        ? 0
        : this.currentPlayListModel.playListIndex;
    let fileIndex =
      this.currentPlayListModel == undefined
        ? 0
        : this.currentPlayListModel.fileIndex;
    let currentVideoDuration = this.videoPlayer.duration;
    this.playList[playListIndex].fileContent[
      fileIndex
    ].totalDuration = currentVideoDuration;
  }

  populateResumeFromTimeOnExit() {
    let playListIndex =
      this.currentPlayListModel == undefined
        ? 0
        : this.currentPlayListModel.playListIndex;
    let fileIndex =
      this.currentPlayListModel == undefined
        ? 0
        : this.currentPlayListModel.fileIndex;
    this.playList[playListIndex].fileContent[
      fileIndex
    ].resumeFromTime = this.videoPlayer.currentTime;
    this.dashboardService.setCoursePlayListData(this.playList);
    let resumeCourseInfo = new ResumePlayerModel();
    resumeCourseInfo.fileIndex = fileIndex;
    resumeCourseInfo.playListIndex = playListIndex;
    resumeCourseInfo.resumeFromTime = this.videoPlayer.currentTime;
    resumeCourseInfo.playerSpeed = this.videoPlayer.playbackRate;
    this.dashboardService.addResumeCourseInfo(resumeCourseInfo);
  }

  populateCoursePlayListFilePlayedCompletely() {
    let playListIndex =
      this.currentPlayListModel == undefined
        ? 0
        : this.currentPlayListModel.playListIndex;
    let fileIndex =
      this.currentPlayListModel == undefined
        ? 0
        : this.currentPlayListModel.fileIndex;
    this.playList[playListIndex].fileContent[fileIndex].played = true;
  }

  getCourseListFilePlayedCompletelyInd() {
    let playListIndex =
      this.currentPlayListModel == undefined
        ? 0
        : this.currentPlayListModel.playListIndex;
    let fileIndex =
      this.currentPlayListModel == undefined
        ? 0
        : this.currentPlayListModel.fileIndex;
    return this.playList[playListIndex].fileContent[fileIndex].played;
  }

  populateAndPublishFileContentMetaData() {
    this.populateFileContentMetaData();
    this.dashboardService.setCoursePlayListData(this.playList);
  }

  populateResumeFromTime() {
    let playListIndex =
      this.currentPlayListModel == undefined
        ? 0
        : this.currentPlayListModel.playListIndex;
    let fileIndex =
      this.currentPlayListModel == undefined
        ? 0
        : this.currentPlayListModel.fileIndex;
    this.playList[playListIndex].fileContent[
      fileIndex
    ].resumeFromTime = this.videoPlayer.currentTime;
  }

  resumeFromTime() {
    let resumePlayerInfo: ResumePlayerModel = this.dashboardService.getResumeCourseInfo();
    if (resumePlayerInfo.resumeFromTime != undefined) {
      this.videoPlayer.currentTime = resumePlayerInfo.resumeFromTime;
      this.playbackRate = resumePlayerInfo.playerSpeed;
      this.changePlayBackRate(this.playbackRate);
      this.initCoursePlayListModel(resumePlayerInfo);
      this.play(
        this.getFileLocationFromPlayList(
          resumePlayerInfo.playListIndex,
          resumePlayerInfo.fileIndex
        )
      );
    }
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
  controlMuteOrUnmute(type: string) {
    this.toggleMuteOrUnmute(type);
    this.showControlActionPerformed(type, false);
  }
  controlAction(type: string) {
    let isVideoPaused = false;
    if (this.videoPlayer) {
      isVideoPaused = this.videoPlayer.paused;
    }
    if (type === CommonConstant.PLAYLIST_PLAY_PAUSE) {
      if (this.videoPlayer.paused) {
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
      if (this.videoPlayer.muted) {
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
    if (type != undefined) {
      if (type === CommonConstant.PLAYLIST_PLAY) {
        this.videoPlayer.play();
        $('#iconPlayPause').text('pause');
      } else if (type === CommonConstant.PLAYLIST_PAUSE) {
        this.videoPlayer.pause();
        $('#iconPlayPause').text('play_arrow');
      }
    }
  }
  toggleMuteOrUnmute(type: string) {
    if (type != undefined) {
      if (type === CommonConstant.PLAYLIST_VOLUME_MUTE) {
        this.videoPlayer.muted = true;
        $('#iconMuteUnmute').text('volume_off');
        $('#btnVolume').toggleClass('btn__volume-mute');
        this.currentVolumeBarFill = $('#volumeControl').css('background-image');
        console.log('this.currentVolumeBarFill', this.currentVolumeBarFill);
        $('#volumeControl').css({
          'background-image': 'none'
        });
      } else if (type === CommonConstant.PLAYLIST_VOLUME_UNMUTE) {
        this.videoPlayer.muted = false;
        $('#iconMuteUnmute').text('volume_up');
        $('#btnVolume').toggleClass('btn__volume-mute');
        $('#volumeControl').css({
          'background-image': this.currentVolumeBarFill
        });
      }
    }
  }
  rewindCurrentTime() {
    this.videoPlayer.currentTime += -5;
  }
  changePlayBackRate(rate: number) {
    this.videoPlayer.playbackRate = rate;
    this.playbackRate = rate;
    $('#playBackSpeedBtn').text(rate + 'x');
    this.styleDropupRate();
  }
  styleDropupRate() {
    var rate = this.videoPlayer.playbackRate;
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
  forwardCurrentTime() {
    this.videoPlayer.currentTime += 5;
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

  playNext() {
    var self = this;
    let fileLocation = self.getPrevOrNextFileLocation(
      CommonConstant.PLAYLIST_PLAY_NEXT
    );
    if (self.currentPlayListModel.fileLocation != fileLocation) {
      self.play(fileLocation);
    }
  }

  autoPlayNext() {
    var self = this;
    self.playNext();
    self.populateCoursePlayListFilePlayedCompletely();
  }

  playPrev() {
    let fileLocation = this.getPrevOrNextFileLocation(
      CommonConstant.PLAYLIST_PLAY_PREVIOUS
    );
    if (this.currentPlayListModel.fileLocation != fileLocation) {
      this.play(fileLocation);
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
  getPrevOrNextFileLocation(type: string) {
    let playListIndex =
      this.currentPlayListModel == undefined
        ? 0
        : this.currentPlayListModel.playListIndex;
    let fileIndex =
      this.currentPlayListModel == undefined
        ? 0
        : this.currentPlayListModel.fileIndex;
    if (type === CommonConstant.PLAYLIST_PLAY_PREVIOUS) {
      if (fileIndex < 1) {
        if (playListIndex > 0) {
          playListIndex -= 1;
          fileIndex = this.playList[playListIndex].fileContent.length - 1;
          this.currentPlayListModel.playListIndex = playListIndex;
          this.currentPlayListModel.fileIndex = fileIndex;
        }
      } else {
        fileIndex -= 1;
        this.currentPlayListModel.fileIndex = fileIndex;
      }
    } else if (type === CommonConstant.PLAYLIST_PLAY_NEXT) {
      let fileContentLength =
        this.playList[playListIndex].fileContent.length - 1;
      let playListSize = this.playList.length - 1;
      if (fileIndex == fileContentLength) {
        if (playListIndex < playListSize) {
          playListIndex += 1;
          fileIndex = 0;
          this.currentPlayListModel.playListIndex = playListIndex;
          this.currentPlayListModel.fileIndex = fileIndex;
        }
      } else {
        fileIndex += 1;
        this.currentPlayListModel.fileIndex = fileIndex;
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
  initPlayList() {
    if (this.dashboardService.getCourseData().length > 0) {
      var index = this.dashboardService.findCourseIndexFromDashboard(
        this.dashboardService.playCourseId,
        this.dashboardService.getCourseData()
      );
      this.playList = this.dashboardService.getCourseData()[
        index
      ].coursePlayList;
    }
  }

  togglePlayList() {
    $('.app-playlist').toggleClass('hide');
    if ($('#btnTogglePlayList').hasClass('toggle__playlist-close')) {
      if (!this.initToggler) {
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
    this.initToggler = false;
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
  jumpToDashboard() {
    this.router.navigate(['/dashboard']);
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

  addStyleFileBeingViewed() {
    var fileIndex = this.currentPlayListModel.fileIndex;
    var playListIndex = this.currentPlayListModel.playListIndex;
    this.btnFileBeingViewedId =
      'btnFileVisited_' + playListIndex + '_' + fileIndex;
    this.iconFileBeingViewedId =
      'iconFileNonVisited_' + playListIndex + '_' + fileIndex;
    $('#' + this.btnFileBeingViewedId).addClass('file__playing');
    $('#' + this.iconFileBeingViewedId).text('visibility');
  }
}
