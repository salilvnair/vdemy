import { Component, OnInit } from '@angular/core';

import { DashboardService } from './../dashboard/service/dashboard.service';
import * as $ from 'jquery';
import { IPlayList } from './model/playlist.model';
import { ICourseModel } from '../dashboard/course/model/course.model';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  playList: IPlayList[];
  constructor(private dashboardService: DashboardService) {}
  video = document.querySelector('video');
  //playBackSpeedBtn = document.getElementById('playBackSpeedBtn').innerText;
  filesButton = document.querySelector('a');
  currentVideoCounter = 0;
  globalVideoCounter = 0;
  ngOnInit() {
    debugger;

    this.preparePlayList();
    this.video = document.querySelector('video');
    //this.tada();
    this.onLoad();
  }

  goFullScreen() {
    this.video.classList.toggle('video__fullscreen--maxheight');
    var self = this;
    var fullscreenElement =
      document.fullscreenElement || document.webkitFullscreenElement;
    if (fullscreenElement) {
      self.exitFullscreen();
    } else {
      self.launchIntoFullscreen(document.getElementById('container'));
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

  onLoad() {
    debugger;
    var self = this;
    $('#custom-seekbar').on('click', function(e) {
      var offset = $(this).offset();
      var left = e.pageX - offset.left;
      var totalWidth = $('#custom-seekbar').width();
      var percentage = left / totalWidth;
      var vidTime = self.video.duration * percentage;
      self.video.currentTime = vidTime;
    });

    this.video.addEventListener('click', function(e) {
      self.togglePlayOrPause();
    });
    document.addEventListener('keydown', e => {
      // console.log(e.keyCode);
      switch (e.keyCode) {
        case 32: // space
          this.togglePlayOrPause();
          break;
        case 37: // left arrow
          this.video.currentTime += -5;
          break;
        case 39: // right arrow
          this.video.currentTime += 5;
          break;
      }
    });

    this.video.addEventListener('ended', this.myHandler, false);

    // var fs = document.getElementById('btnFS');

    // var btnPlayPause = document.getElementById('btnPlayPause');

    // fs.addEventListener('click', this.goFullScreen);
    // btnPlayPause.addEventListener('click', this.togglePlayOrPause);
    var self = this;
    this.video.ontimeupdate = function() {
      var percentage = self.video.currentTime / self.video.duration * 100;
      $('#custom-seekbar span').css('width', percentage + '%');

      var currentTime: number = self.video.currentTime;
      var totalDuration: number = self.video.duration;
      //console.log(formatTime(currentTime)+"/"+formatTime(totalDuration));
      $('#timer').text(
        self.formatTime(currentTime) + '/' + self.formatTime(totalDuration)
      );
      console.log($('#timer').text());
    };
  }
  // handle changes to speed input
  //    speedInput.addEventListener('change', e => {
  //        video.playbackRate = Number(playBackSpeedBtn);
  //        // write actual playback rate value back to input
  //        playBackSpeedBtn = Number(video.playbackRate);
  //    });

  // add keyboard shortcuts for pause (space) and 5 sec jump (left/right arrow)

  myHandler(e) {
    //alert('khatam hogya bhai!!');
    if (this.currentVideoCounter + 1 < this.globalVideoCounter) {
      this.playNext();
    }
  }

  playNext() {
    const listItem = document.getElementById(
      'video_' + (this.currentVideoCounter + 1)
    );
    this.currentVideoCounter = this.currentVideoCounter + 1;
    listItem.classList.add('played');
    this.video.src = listItem.getAttribute('objUrl');
    this.video.playbackRate = Number(1);
    this.video.play();
  }

  play(fileLocation) {
    this.video.src = fileLocation;
    this.video.playbackRate = Number(1);
    this.video.play();
  }

  playPrev() {
    const listItem = document.getElementById(
      'video_' + (this.currentVideoCounter - 1)
    );
    this.currentVideoCounter = this.currentVideoCounter - 1;
    listItem.classList.add('played');
    this.video.src = listItem.getAttribute('objUrl');
    this.video.playbackRate = Number(1);
    this.video.play();
  }

  togglePlayOrPause() {
    if (this.video.paused) {
      this.video.play();
      $('#iconPlayPause').text('pause');
    } else {
      this.video.pause();
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

  findCourseIndexFromDashboard(id, dashboardData: ICourseModel[]) {
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
}
