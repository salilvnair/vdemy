import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlayList } from '../model/playlist.model';
import { CurrentPlayListModel } from '../model/current-playlist.model';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
  panelOpenState: boolean = false;
  @Input() playList: PlayList[] = [];
  @Output() onVideoSelection = new EventEmitter<CurrentPlayListModel>();
  constructor() {}

  ngOnInit() {}

  play(playListIndex: number, fileIndex: number, fileLocation: string) {
    let currentPlayListModel: CurrentPlayListModel = new CurrentPlayListModel();
    currentPlayListModel.playListIndex = playListIndex;
    currentPlayListModel.fileIndex = fileIndex;
    currentPlayListModel.fileLocation = fileLocation;
    this.onVideoSelection.emit(currentPlayListModel);
  }
}
