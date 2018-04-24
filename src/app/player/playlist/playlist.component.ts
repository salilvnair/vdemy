import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IPlayList } from '../model/playlist.model';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
  panelOpenState: boolean = false;
  @Input() playList: IPlayList[] = [];
  @Output() onVideoSelection = new EventEmitter<string>();
  constructor() {}

  ngOnInit() {}

  play(fileLocation: string) {
    this.onVideoSelection.emit(fileLocation);
  }
}
