import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  AfterViewInit,
  HostListener,
  ChangeDetectorRef
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
import { Observable } from 'rxjs/Observable';
import { ElectronService } from 'ngx-electron';
import { PlayerService } from './service/player.service';
import { PlayerComponentGlobalData } from './model/player-global.model';
import { OnRouterNavigate } from '../util/router/service/router-navigate.service';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router/src/router_state';
@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
  providers: [PlayerService]
})
export class PlayerComponent
  implements OnInit, OnDestroy, OnRouterNavigate, AfterViewInit {
  constructor(
    private router: Router,
    private timeoutDialogService: TimeoutDialogService,
    private playerService: PlayerService,
    private cdRef: ChangeDetectorRef
  ) {}
  playerComponentGlobalData: PlayerComponentGlobalData;

  ngOnInit() {
    this.init();
  }
  ngOnDestroy(): void {}

  beforeRouterNavigate(): boolean | Observable<boolean> | Promise<boolean> {
    this.playerService.onRouterNavigate();
    return true;
  }

  init() {
    console.log('ngOninit');
    this.initOverrideSessionTimeout();
    this.initGlobalFields();
    this.playerService.initPlayList();
    this.playerService.initCoursePlayListModel();
    this.playerService.initEventListeners();
  }
  initOverrideSessionTimeout() {
    this.timeoutDialogService.pauseOrContinueTimeOut(true);
  }
  initGlobalFields() {
    this.playerComponentGlobalData = new PlayerComponentGlobalData();
    this.playerService.initPlayerComponentGlobalData(
      this.playerComponentGlobalData
    );
  }
  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
    this.playerService.resumeFromTime();
    this.playerService.showOrHideElementsOnInit();
    this.playerService.fadeVideoControls();
    this.playerService.styleDropupRate();
    this.cdRef.detectChanges();
  }
  // @HostListener('window:unload', ['$event'])
  // unloadHandler(event) {
  //   //add the logic to save resume time and other info post db implementation
  // }
  // @HostListener('window:beforeunload', ['$event'])
  // beforeUnloadHander(event) {
  //   //add the logic to save resume time and other info post db implementation
  // }

  @HostListener('document:keyup', ['$event'])
  onKeypressEventHandler(event) {
    this.playerService.onKeypressEvent(event);
  }
  initPlaying(currentPlayListModel: CurrentPlayListModel) {
    this.playerService.initPlaying(currentPlayListModel);
  }

  jumpToDashboard() {
    this.router.navigate(['/dashboard']);
  }
  controlAction(type: string) {
    this.playerService.controlAction(type);
  }
  changePlayBackRate(rate: number) {
    this.playerService.changePlayBackRate(rate);
  }
  playNext() {
    this.playerService.playNext();
  }
  toggleFullScreen() {
    this.playerService.toggleFullScreen();
  }
  togglePlayList() {
    this.playerService.togglePlayList();
  }
}
