import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlayList } from '../model/playlist.model';
import { CurrentPlayListModel } from '../model/current-playlist.model';
import { DashboardService } from '../../dashboard/service/dashboard.service';
import { PlayerService } from '../service/player.service';
import { CoursePlayListStatusModel } from '../model/course-playlist-status.model';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
  panelOpenState: boolean = false;
  step = 0;
  @Input() playList: PlayList[] = [];
  @Output() onVideoSelection = new EventEmitter<CurrentPlayListModel>();
  @Output() onExpansionPanelOpen = new EventEmitter<number>();
  //@Input() coursePlayListStatus: CoursePlayListStatusModel;
  constructor(
    private dashboardService: DashboardService,
    private playerService: PlayerService
  ) {}

  ngOnInit() {
    this.init();
  }

  init() {
    this.initExpansionPanelSubscription();
  }

  initExpansionPanelSubscription() {
    var self = this;
    this.playerService.panelExpandedEventPublisher().subscribe(step => {
      self.openExpansionPanel(step);
    });
  }

  play(playListIndex: number, fileIndex: number, fileLocation: string) {
    let currentPlayListModel: CurrentPlayListModel = new CurrentPlayListModel();
    currentPlayListModel.playListIndex = playListIndex;
    currentPlayListModel.fileIndex = fileIndex;
    currentPlayListModel.fileLocation = fileLocation;
    this.onVideoSelection.emit(currentPlayListModel);
  }
  updateViewStatusOnCurrentVideo(
    status: boolean,
    playListIndex: number,
    fileIndex: number
  ) {
    this.playList[playListIndex].fileContent[fileIndex].played = !this.playList[
      playListIndex
    ].fileContent[fileIndex].played;
    //this.dashboardService.setCoursePlayListData(this.playList);
    //change this to new coursePlaylist status
  }
  setStep(index: number) {
    this.step = index;
  }

  openExpansionPanel(step) {
    this.step = step;
  }
  // nextStep() {
  //   this.onExpansionPanelOpen.emit(this.step++);
  //   //this.step++;
  // }

  // prevStep() {
  //   this.onExpansionPanelOpen.emit(this.step--);
  //   //this.step--;
  // }
}
