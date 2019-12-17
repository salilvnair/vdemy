import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
  ViewEncapsulation
} from '@angular/core';
import { PlayList } from '../model/playlist.model';
import { CurrentPlayListModel } from '../model/current-playlist.model';
import { DashboardService } from '../../dashboard/service/dashboard.service';
import { PlayerService } from '../service/player.service';
import { CurrentPlayListStatusModel } from '../model/current-playlist-status.model';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css'],
  //encapsulation: ViewEncapsulation.ShadowDom
})
export class PlaylistComponent implements OnInit, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    //console.log("PlaylistComponent change triggered",changes);
  }
  panelOpenState: boolean = false;
  step = 0;
  @Input() playList: PlayList[] = [];
  @Output() onVideoSelection = new EventEmitter<CurrentPlayListModel>();
  @Output() onExpansionPanelOpen = new EventEmitter<number>();
  @Output() currentPlayListStatus = new EventEmitter<
    CurrentPlayListStatusModel
  >();
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
    played: boolean,
    playListIndex: number,
    fileIndex: number
  ) {
    let currentPlayListStatusModel: CurrentPlayListStatusModel = new CurrentPlayListStatusModel();
    currentPlayListStatusModel.playListIndex = playListIndex;
    currentPlayListStatusModel.fileIndex = fileIndex;
    if (!played) {
      played = false;
    }
    currentPlayListStatusModel.played = played;
    this.currentPlayListStatus.emit(currentPlayListStatusModel);
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
