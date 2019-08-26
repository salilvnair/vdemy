import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  AfterViewInit,
  HostListener,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { DashboardService } from './../dashboard/service/dashboard.service';
import * as CommonConstant from '../shared/constant/common.constant';
import { CurrentPlayListModel } from './model/current-playlist.model';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { PlayerService } from './service/player.service';
import { PlayerComponentGlobalData } from './model/player-global.model';
import { OnRouterNavigate } from '../util/router/service/router-navigate.service';
import { CurrentPlayListStatusModel } from './model/current-playlist-status.model';
@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
  providers: [PlayerService]
})
export class PlayerComponent
  implements OnInit, OnDestroy, OnRouterNavigate, AfterViewInit, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    console.log('PlayerComponent change triggered', changes);
  }
  constructor(
    private router: Router,
    private playerService: PlayerService,
    private cdRef: ChangeDetectorRef,
    private dashboardService: DashboardService
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
    this.initGlobalFields();
    this.playerService.initPlayList();
    this.playerService.initCoursePlayListStatus();
    this.playerService.initCoursePlayListModel();
    this.playerService.initEventListeners();
  }

  initGlobalFields() {
    this.playerComponentGlobalData = new PlayerComponentGlobalData();
    this.playerService.initPlayerComponentGlobalData(
      this.playerComponentGlobalData
    );
  }
  ngAfterViewInit(): void {
    //console.log('ngAfterViewInit');
    //console.log('next');
    this.playerService.resumeFromTime();
    this.playerService.showOrHideElementsOnInit();
    this.playerService.fadeVideoControls();
    this.playerService.styleDropupRate();
    this.playerService.changeCoursePlayListViewedItemPostInit();
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

  toggleCoursePlayListStatus(
    currentPlayListStatus: CurrentPlayListStatusModel
  ) {
    this.playerService.toggleCoursePlayListStatus(currentPlayListStatus);
  }

  jumpToDashboard() {
    var courseId = this.dashboardService.playCourseId;
    var percentageCompleted = this.playerComponentGlobalData
      .coursePlayListStatus.totalDurationCompleted;
    this.dashboardService.updateCourseCompletion(courseId, percentageCompleted);
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
    this.playerService.controlPlayOrPause(CommonConstant.PLAYLIST_PLAY);
  }
  playPrev() {
    this.playerService.playPrev();
    this.playerService.controlPlayOrPause(CommonConstant.PLAYLIST_PLAY);
  }

  toggleFullScreen() {
    this.playerService.toggleFullScreen();
  }
  togglePlayList() {
    this.playerService.togglePlayList();
  }
}
